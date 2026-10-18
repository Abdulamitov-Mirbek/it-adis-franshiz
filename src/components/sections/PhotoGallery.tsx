import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { useLanguage } from '@/content/Language';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import graduationGroup from '@/assets/photo_2026-10-16_15-32-18.jpg';
import graduates from '@/assets/photo_2026-10-16_15-32-09.jpg';
import certificate from '@/assets/photo_2026-10-16_15-32-25.jpg';
import graduationCelebration from '@/assets/photo_2026-10-16_15-31-58.jpg';
import portrait from '@/assets/photo_2026-10-16_15-32-30.jpg';
import redCertificate from '@/assets/photo_2026-10-16_18-22-57.jpg';
import reception from '@/assets/photo_3_2026-10-16_18-31-45.jpg';
import academyWindows from '@/assets/photo_4_2026-10-16_18-31-45.jpg';
import academyEntrance from '@/assets/photo_6_2026-10-16_18-31-45.jpg';
import receptionHall from '@/assets/photo_7_2026-10-16_18-31-45.jpg';
import './photo-gallery.css';

interface GalleryPhoto {
  src: string;
  width: number;
  height: number;
  rotate?: boolean;
  ru: string;
  kg: string;
}

const photos: GalleryPhoto[] = [
  {
    src: graduationGroup,
    width: 960,
    height: 1280,
    ru: 'Групповое фото выпускников с сертификатами',
    kg: 'Сертификаттары менен бүтүрүүчүлөрдүн жалпы сүрөтү',
  },
  {
    src: graduates,
    width: 960,
    height: 1280,
    ru: 'Выпускницы в мантиях с сертификатами',
    kg: 'Мантия кийген бүтүрүүчү кыздар сертификаттары менен',
  },
  {
    src: certificate,
    width: 1280,
    height: 960,
    rotate: true,
    ru: 'Обложка сертификата',
    kg: 'Сертификаттын мукабасы',
  },
  {
    src: graduationCelebration,
    width: 960,
    height: 1280,
    ru: 'Выпускники на празднике вручения сертификатов',
    kg: 'Сертификат тапшыруу аземиндеги бүтүрүүчүлөр',
  },
  {
    src: portrait,
    width: 848,
    height: 1264,
    ru: 'Портрет в деловом костюме',
    kg: 'Костюм кийген адамдын портрети',
  },
  {
    src: redCertificate,
    width: 1280,
    height: 960,
    rotate: true,
    ru: 'Красная обложка сертификата',
    kg: 'Сертификаттын кызыл мукабасы',
  },
  {
    src: reception,
    width: 960,
    height: 1280,
    ru: 'Ресепшен и интерьер учебного центра IT ADIS',
    kg: 'IT ADIS окуу борборунун кабылдамасы жана ички көрүнүшү',
  },
  {
    src: academyWindows,
    width: 1280,
    height: 960,
    ru: 'Окна учебного центра с оформлением IT ADIS',
    kg: 'IT ADIS жасалгасы бар окуу борборунун терезелери',
  },
  {
    src: academyEntrance,
    width: 960,
    height: 1280,
    ru: 'Вход в учебный центр IT ADIS',
    kg: 'IT ADIS окуу борборунун кире бериши',
  },
  {
    src: receptionHall,
    width: 960,
    height: 1280,
    ru: 'Холл и стойка ресепшена IT ADIS',
    kg: 'IT ADIS залы жана кабылдама үстөлү',
  },
];

interface RowProps {
  reverse?: boolean;
  playing: boolean;
  visible: boolean;
  reduced: boolean;
}
function PhotoRow({ reverse = false, playing, visible, reduced }: RowProps) {
  const { isKg } = useLanguage();
  const viewport = useRef<HTMLDivElement>(null);
  const group = useRef<HTMLDivElement>(null);
  const dragging = useRef<{ x: number; left: number } | null>(null);
  const interacting = useRef(false);
  const resumeAt = useRef(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const ordered = reverse ? [...photos].reverse() : photos;
  // A group stays wider than the gallery even on large monitors.
  const sequence = [...ordered, ...ordered];

  useEffect(() => {
    const node = viewport.current;
    const firstGroup = group.current;
    if (
      !node ||
      !firstGroup ||
      !playing ||
      !visible ||
      reduced ||
      hovered ||
      focused
    )
      return;
    let frame = 0;
    let last = 0;
    let position = node.scrollLeft;
    const tick = (now: number) => {
      const width = firstGroup.offsetWidth;
      const delta = last ? Math.min(now - last, 50) : 0;
      last = now;
      if (interacting.current || now < resumeAt.current) {
        position = node.scrollLeft;
      } else if (width > 0) {
        position =
          (((position +
            (reverse ? -1 : 1) * delta * (reverse ? 0.025 : 0.021)) %
            width) +
            width) %
          width;
        node.scrollLeft = position;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, visible, reduced, hovered, focused, reverse]);

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    interacting.current = true;
    if (event.pointerType !== 'mouse') return;
    dragging.current = {
      x: event.clientX,
      left: event.currentTarget.scrollLeft,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    event.currentTarget.scrollLeft =
      dragging.current.left - (event.clientX - dragging.current.x);
  };
  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    dragging.current = null;
    interacting.current = false;
    resumeAt.current = performance.now() + 1800;
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <div
      className="photo-gallery__row"
      ref={viewport}
      tabIndex={0}
      role="group"
      aria-label={
        isKg
          ? `Сүрөттөрдүн ${reverse ? 'экинчи' : 'биринчи'} катары`
          : `${reverse ? 'Второй' : 'Первый'} ряд фотографий`
      }
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onWheel={() => {
        resumeAt.current = performance.now() + 1800;
      }}
    >
      <div className="photo-gallery__track">
        {[false, true].map((clone) => (
          <div
            className="photo-gallery__group"
            key={String(clone)}
            ref={clone ? undefined : group}
            aria-hidden={clone || undefined}
          >
            {sequence.map((photo, index) => (
              <figure
                className={`photo-gallery__photo${photo.rotate ? ' photo-gallery__photo--upright' : ''}`}
                key={`${photo.src}-${index}`}
                aria-hidden={index >= ordered.length || undefined}
                style={{
                  aspectRatio: photo.rotate
                    ? `${photo.height} / ${photo.width}`
                    : `${photo.width} / ${photo.height}`,
                }}
              >
                <img
                  src={photo.src}
                  alt={
                    clone || index >= ordered.length
                      ? ''
                      : isKg
                        ? photo.kg
                        : photo.ru
                  }
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </figure>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PhotoGallery() {
  const { isKg } = useLanguage();
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(false);
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!section.current) return;
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    observer.observe(section.current);
    return () => observer.disconnect();
  }, []);
  return (
    <section
      className="section section--alt photo-gallery"
      id="gallery"
      ref={section}
      aria-labelledby="gallery-title"
    >
      <div className="wrap photo-gallery__heading">
        <div>
          <span className="eyebrow">
            <span className="dot" />
            {isKg ? 'Сүрөт галереясы' : 'Фотогалерея'}
          </span>
          <h2 className="t-h2" id="gallery-title">
            {isKg ? 'IT ADIS сүрөттөрдө' : 'IT ADIS в кадре'}
          </h2>
          <p>
            {isKg
              ? 'Көбүрөөк көрүү үчүн сүрөттөрдү жылдырыңыз.'
              : 'Листайте фотографии, чтобы увидеть больше.'}
          </p>
        </div>
        {!reduced && (
          <button
            className="photo-gallery__toggle"
            type="button"
            aria-pressed={!playing}
            onClick={() => setPlaying((value) => !value)}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="currentColor"
              aria-hidden="true"
            >
              {playing ? (
                <path d="M4 3h3v12H4zm7 0h3v12h-3z" />
              ) : (
                <path d="M5 2.5 15 9 5 15.5z" />
              )}
            </svg>
            {playing
              ? isKg
                ? 'Токтотуу'
                : 'Пауза'
              : isKg
                ? 'Улантуу'
                : 'Продолжить'}
          </button>
        )}
      </div>
      <div className="photo-gallery__rows">
        <PhotoRow playing={playing} visible={visible} reduced={reduced} />
        <PhotoRow
          reverse
          playing={playing}
          visible={visible}
          reduced={reduced}
        />
      </div>
    </section>
  );
}
