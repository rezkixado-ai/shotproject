'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { NavLink } from '@/lib/content';
import s from './MobileNav.module.css';

export function MobileNav({ links, ctaLabel, ctaHref }: { links: NavLink[]; ctaLabel: string; ctaHref: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={s.wrap}>
      <button
        type="button"
        className={s.burger}
        aria-label={open ? 'Tutup menu' : 'Buka menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`${s.bar} ${open ? s.barTop : ''}`} />
        <span className={`${s.bar} ${open ? s.barMid : ''}`} />
        <span className={`${s.bar} ${open ? s.barBot : ''}`} />
      </button>

      <div className={`${s.drawer} ${open ? s.drawerOpen : ''}`}>
        <nav className={s.drawerLinks}>
          {links.map((l) => (
            <a key={l.id} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
          ))}
        </nav>
        <Link href={ctaHref} className={s.drawerCta} onClick={() => setOpen(false)}>
          {ctaLabel} <span>→</span>
        </Link>
      </div>
    </div>
  );
}
