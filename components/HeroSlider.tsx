'use client';

import { useEffect, useState } from 'react';
import type { HeroSlide } from '@/lib/content';
import s from './HeroSlider.module.css';

const FADE_MS = 1400;

export function HeroSlider({ slides, durationMs = 6000 }: { slides: HeroSlide[]; durationMs?: number }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const [tick, setTick] = useState(0); // bumped each rotation to force a fresh mount (restarts Ken Burns cleanly)

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIdx((current) => {
        setPrevIdx(current);
        return (current + 1) % slides.length;
      });
      setTick((t) => t + 1);
    }, durationMs);
    return () => clearInterval(interval);
  }, [slides.length, durationMs]);

  useEffect(() => {
    if (prevIdx === null) return;
    const t = setTimeout(() => setPrevIdx(null), FADE_MS);
    return () => clearTimeout(t);
  }, [prevIdx]);

  if (slides.length === 0) return null;

  const active = slides[activeIdx];
  const prev = prevIdx !== null ? slides[prevIdx] : null;

  return (
    <div className={s.slider} aria-hidden>
      {prev && (
        <div className={`${s.slide} ${s.slideOut}`}>
          <SlideMedia slide={prev} animate={false} durationMs={durationMs} />
        </div>
      )}
      <div key={`${active.id}-${tick}`} className={`${s.slide} ${s.slideIn}`}>
        <SlideMedia slide={active} animate durationMs={durationMs} />
      </div>
      <div className={s.gradient} />
    </div>
  );
}

function SlideMedia({ slide, animate, durationMs }: { slide: HeroSlide; animate: boolean; durationMs: number }) {
  const animStyle = animate ? { animationDuration: `${durationMs + FADE_MS}ms` } : undefined;
  if (slide.type === 'video') {
    return (
      <video
        className={`${s.media} ${animate ? s.kenburns : ''}`}
        style={animStyle}
        src={slide.src}
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }
  return (
    <div
      className={`${s.media} ${animate ? s.kenburns : ''}`}
      style={{ backgroundImage: `url(${slide.src})`, ...animStyle }}
    />
  );
}
