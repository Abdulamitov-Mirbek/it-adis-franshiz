import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const Scene = lazy(() => import('./Scene'));

/** Если WebGL упал — просто убираем сцену, запасная вёрстка остаётся. */
class SceneBoundary extends Component<{ children: ReactNode; onFail: () => void }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onFail();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    context?.getExtension('WEBGL_lose_context')?.loseContext();
    return Boolean(context);
  } catch {
    return false;
  }
}

interface Props {
  variant: 'hero' | 'apply';
  className: string;
  onReady?: (ready: boolean) => void;
}

/**
 * 3D — прогрессивное улучшение: отдельный чанк, грузится только при
 * WebGL и без prefers-reduced-motion. На телефонах используем лёгкую сцену.
 */
export function SceneCanvas({ variant, className, onReady }: Props) {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [compact, setCompact] = useState(false);
  const [visible, setVisible] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const handleReady = useCallback(() => setReady(true), []);
  const handleFail = useCallback(() => {
    setReady(false);
    setEnabled(false);
  }, []);

  useEffect(() => {
    setReady(false);
    setEnabled(!reduced && hasWebGL());
  }, [reduced]);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 1100px)');
    const update = () => setCompact(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    onReady?.(enabled && ready);
  }, [enabled, ready, onReady]);

  useEffect(() => {
    if (!enabled || !container.current) return;
    const node = container.current;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(node);
    const onContextLost = (event: Event) => {
      event.preventDefault();
      handleFail();
    };
    node.addEventListener('webglcontextlost', onContextLost, true);
    return () => {
      observer.disconnect();
      node.removeEventListener('webglcontextlost', onContextLost, true);
    };
  }, [enabled, handleFail]);

  if (!enabled) return null;

  return (
    <div ref={container} className={`${className} ${ready ? 'is-ready' : ''}`} aria-hidden="true">
      <SceneBoundary onFail={handleFail}>
        <Suspense fallback={null}>
          <Scene variant={variant} compact={compact} active={visible} onReady={handleReady} />
        </Suspense>
      </SceneBoundary>
    </div>
  );
}
