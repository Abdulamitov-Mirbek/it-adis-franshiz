import { Component, Suspense, lazy, useEffect, useState, type ReactNode } from 'react';
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
    return Boolean(
      window.WebGLRenderingContext && (canvas.getContext('webgl2') ?? canvas.getContext('webgl')),
    );
  } catch {
    return false;
  }
}

interface Props {
  variant: 'hero' | 'apply';
  className: string;
  minWidth?: number;
  onReady?: (ready: boolean) => void;
}

/**
 * 3D — прогрессивное улучшение: отдельный чанк, грузится только при
 * WebGL, достаточной ширине и без prefers-reduced-motion.
 */
export function SceneCanvas({ variant, className, minWidth = 700, onReady }: Props) {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reduced) {
      setEnabled(false);
      return;
    }
    const check = () => {
      const wide = window.matchMedia(`(min-width: ${minWidth}px)`).matches;
      const cores = navigator.hardwareConcurrency ?? 4;
      setEnabled(wide && cores >= 4 && hasWebGL());
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [reduced, minWidth]);

  useEffect(() => {
    onReady?.(enabled && ready);
  }, [enabled, ready, onReady]);

  useEffect(() => {
    if (!enabled) return;
    const timer = window.setTimeout(() => setReady(true), 120);
    return () => window.clearTimeout(timer);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className={`${className} ${ready ? 'is-ready' : ''}`} aria-hidden="true">
      <SceneBoundary onFail={() => setEnabled(false)}>
        <Suspense fallback={null}>
          <Scene variant={variant} />
        </Suspense>
      </SceneBoundary>
    </div>
  );
}
