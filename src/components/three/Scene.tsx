import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { getHeroVisual } from '@/content/heroVisual';
import { useLanguage } from '@/content/Language';
import {
  makeCodeCardTexture,
  makeDiplomaTexture,
  makeGlowTexture,
  makeStickerTexture,
} from './textures';

/* ─────────────── Цифровой ландшафт из точек ─────────────── */

interface FieldProps {
  cols?: number;
  rows?: number;
  gap?: number;
  color?: string;
  amplitude?: number;
}

function WaveField({
  cols = 100,
  rows = 58,
  gap = 0.3,
  color = '#9AA6FF',
  amplitude = 0.42,
}: FieldProps) {
  const ref = useRef<THREE.Points>(null);

  const { geometry, base } = useMemo(() => {
    const count = cols * rows;
    const positions = new Float32Array(count * 3);
    let i = 0;
    for (let z = 0; z < rows; z += 1) {
      for (let x = 0; x < cols; x += 1) {
        positions[i * 3] = (x - cols / 2) * gap;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = (z - rows / 2) * gap;
        i += 1;
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return { geometry: geo, base: positions.slice() };
  }, [cols, rows, gap]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(({ clock }) => {
    const attr = geometry.getAttribute('position') as THREE.BufferAttribute;
    const t = clock.getElapsedTime();
    for (let i = 0; i < attr.count; i += 1) {
      const x = base[i * 3];
      const z = base[i * 3 + 2];
      const y =
        Math.sin(x * 0.38 + t * 0.6) * amplitude +
        Math.cos(z * 0.32 - t * 0.45) * amplitude * 0.75;
      attr.setY(i, y);
    }
    attr.needsUpdate = true;
    if (ref.current) ref.current.rotation.y = Math.sin(t * 0.04) * 0.08;
  });

  return (
    <points ref={ref} geometry={geometry} position={[0, -2.4, -1]}>
      <pointsMaterial
        size={0.042}
        color={color}
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ─────────────── Каркасный многогранник ─────────────── */

function WireShape({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  const ref = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(
    () => new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1, 1)),
    [],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.x = t * 0.12;
    ref.current.rotation.y = t * 0.17;
    ref.current.position.y = position[1] + Math.sin(t * 0.5) * 0.14;
  });

  return (
    <lineSegments
      ref={ref}
      geometry={geometry}
      position={position}
      scale={scale}
    >
      <lineBasicMaterial color="#83E40A" transparent opacity={0.4} />
    </lineSegments>
  );
}

/* ─────────────── Свечение ─────────────── */

function Glow({
  position,
  size = 7,
  color = '131,228,10',
}: {
  position: [number, number, number];
  size?: number;
  color?: string;
}) {
  const texture = useMemo(() => makeGlowTexture(color), [color]);
  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <mesh position={position}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* ─────────────── Парящая панель ─────────────── */

interface PanelProps {
  texture: THREE.Texture;
  position: [number, number, number];
  rotation?: [number, number, number];
  width: number;
  period?: number;
  phase?: number;
  amplitude?: number;
}

function Panel({
  texture,
  position,
  rotation = [0, 0, 0],
  width,
  period = 8,
  phase = 0,
  amplitude = 0.17,
}: PanelProps) {
  const ref = useRef<THREE.Group>(null);
  const image = texture.image as { width: number; height: number };
  const height = (width * image.height) / image.width;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y =
      position[1] + Math.sin((t / period) * Math.PI * 2 + phase) * amplitude;
    ref.current.rotation.y =
      rotation[1] + Math.sin((t / (period * 1.4)) * Math.PI * 2) * 0.035;
    ref.current.rotation.x =
      rotation[0] + Math.sin((t / (period * 1.8)) * Math.PI * 2) * 0.02;
  });

  return (
    <group ref={ref} position={position} rotation={rotation}>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ─────────────── Параллакс за курсором ─────────────── */

function Rig({
  children,
  strength = 0.14,
}: {
  children: ReactNode;
  strength?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame((_, delta) => {
    if (!ref.current) return;
    const damp = 1 - Math.pow(0.002, delta);
    ref.current.rotation.y +=
      (pointer.x * strength - ref.current.rotation.y) * damp;
    ref.current.rotation.x +=
      (-pointer.y * strength * 0.7 - ref.current.rotation.x) * damp;
  });

  return <group ref={ref}>{children}</group>;
}

/* ─────────────── Сцены ─────────────── */

function HeroContent({
  compact,
  onReady,
  hero: HERO,
}: {
  compact: boolean;
  onReady: () => void;
  hero: ReturnType<typeof getHeroVisual>;
}) {
  const [textures, setTextures] = useState<THREE.CanvasTexture[] | null>(null);
  const reportedReady = useRef(false);

  useFrame(() => {
    if ((compact || textures) && !reportedReady.current) {
      reportedReady.current = true;
      onReady();
    }
  });

  useEffect(() => {
    if (compact) {
      setTextures(null);
      return;
    }
    let cancelled = false;
    const build = () => {
      if (cancelled) return;
      setTextures([
        makeCodeCardTexture(HERO.cards.python.lang, HERO.cards.python.lines),
        makeCodeCardTexture(
          HERO.cards.javascript.lang,
          HERO.cards.javascript.lines,
        ),
        makeCodeCardTexture(HERO.cards.flutter.lang, HERO.cards.flutter.lines),
        makeDiplomaTexture(
          HERO.diploma.title,
          HERO.diploma.sub,
          HERO.diploma.langs,
        ),
        makeStickerTexture(HERO.sticker.top, HERO.sticker.bottom),
      ]);
    };

    if (document.fonts?.ready)
      void document.fonts.ready.then(build).catch(build);
    else build();

    return () => {
      cancelled = true;
    };
  }, [compact, HERO]);

  useEffect(() => {
    if (!textures) return;
    return () => textures.forEach((texture) => texture.dispose());
  }, [textures]);

  return (
    <>
      <WaveField
        cols={compact ? 48 : 100}
        rows={compact ? 32 : 58}
        gap={compact ? 0.22 : 0.3}
      />
      <Glow position={[2.6, 1.2, -3]} size={9} />
      <Glow position={[-3.6, -1.4, -4]} size={8} color="42,37,242" />

      <Rig strength={compact ? 0.04 : 0.14}>
        <WireShape
          position={compact ? [1.3, 1.8, -1.2] : [3.1, 1.5, -1.2]}
          scale={compact ? 0.7 : 1.15}
        />

        {!compact && textures ? (
          <>
            <Panel
              texture={textures[0]}
              position={[2.3, 1.15, 0.2]}
              rotation={[0.03, -0.26, 0.02]}
              width={3}
              period={7}
            />
            <Panel
              texture={textures[1]}
              position={[3.5, -0.55, 0.9]}
              rotation={[0.02, -0.34, -0.015]}
              width={3.2}
              period={8}
              phase={1.2}
            />
            <Panel
              texture={textures[2]}
              position={[1.6, -1.75, 0.5]}
              rotation={[0.02, -0.2, 0.02]}
              width={2.5}
              period={9}
              phase={2.3}
            />
            <Panel
              texture={textures[3]}
              position={[4.4, -2.1, 1.4]}
              rotation={[0.01, -0.4, -0.07]}
              width={1.9}
              period={8.5}
              phase={0.7}
              amplitude={0.12}
            />
            <mesh position={[1.5, 0.3, 1.5]} rotation={[0, -0.2, 0.175]}>
              <circleGeometry args={[0.5, 64]} />
              <meshBasicMaterial
                map={textures[4]}
                transparent
                toneMapped={false}
              />
            </mesh>
          </>
        ) : null}
      </Rig>
    </>
  );
}

function ApplyContent({
  compact,
  onReady,
}: {
  compact: boolean;
  onReady: () => void;
}) {
  const reportedReady = useRef(false);
  useFrame(() => {
    if (!reportedReady.current) {
      reportedReady.current = true;
      onReady();
    }
  });
  return (
    <>
      <WaveField
        cols={compact ? 40 : 70}
        rows={compact ? 28 : 40}
        gap={0.34}
        color="#7C8BFF"
        amplitude={0.34}
      />
      <Glow position={[3, 0.8, -3]} size={9} />
      <Rig strength={0.1}>
        <WireShape position={[-3.4, 1.1, -1]} scale={0.9} />
      </Rig>
    </>
  );
}

export default function Scene({
  variant,
  compact,
  active,
  onReady,
}: {
  variant: 'hero' | 'apply';
  compact: boolean;
  active: boolean;
  onReady: () => void;
}) {
  const { isKg } = useLanguage();
  const hero = useMemo(() => getHeroVisual(isKg), [isKg]);
  return (
    <Canvas
      camera={{
        position: compact ? [0, -0.4, 7.8] : [0, 0.6, 7],
        fov: compact ? 50 : 46,
      }}
      frameloop={active ? 'always' : 'never'}
      dpr={compact ? [1, 2] : [1, 1.6]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: compact ? 'default' : 'high-performance',
      }}
      style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
    >
      {variant === 'hero' ? (
        <HeroContent compact={compact} onReady={onReady} hero={hero} />
      ) : (
        <ApplyContent compact={compact} onReady={onReady} />
      )}
    </Canvas>
  );
}
