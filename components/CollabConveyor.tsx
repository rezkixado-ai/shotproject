'use client';

import { useState } from 'react';
import type { CollabLogo } from '@/lib/content';
import s from './CollabConveyor.module.css';

export function CollabConveyor({ logos }: { logos: CollabLogo[] }) {
  const [selected, setSelected] = useState<string | null>(null);

  if (logos.length === 0) return null;

  // Duplicate the track once so the loop is seamless (translate exactly -50%).
  const track = [...logos, ...logos];
  const selectedLogo = logos.find((l) => l.id === selected) ?? null;

  return (
    <div className={s.wrap}>
      <div className={`${s.marquee} ${selected ? s.paused : ''}`}>
        <div className={s.track}>
          {track.map((logo, i) => {
            const isSelected = logo.id === selected;
            const isDimmed = selected !== null && !isSelected;
            return (
              <button
                key={`${logo.id}-${i}`}
                type="button"
                className={`${s.item} ${isSelected ? s.itemSelected : ''} ${isDimmed ? s.itemDimmed : ''}`}
                onClick={() => setSelected(isSelected ? null : logo.id)}
                aria-pressed={isSelected}
              >
                <img src={logo.image} alt={logo.name} />
              </button>
            );
          })}
        </div>
      </div>

      <div className={`${s.detail} ${selectedLogo ? s.detailShow : ''}`}>
        {selectedLogo && (
          <>
            <strong>{selectedLogo.name}</strong>
            <p>{selectedLogo.description}</p>
          </>
        )}
      </div>
    </div>
  );
}
