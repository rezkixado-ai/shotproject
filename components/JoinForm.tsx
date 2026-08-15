'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Nav, FormPage, HeroSlide } from '@/lib/content';
import { HeroSlider } from './HeroSlider';
import { Icon } from '@/lib/icons';
import s from './JoinForm.module.css';

const STATUS_OPTIONS = ['SMA', 'Kuliah', 'Kerja', 'Lainnya'];
const GENDER_OPTIONS = ['Laki-laki', 'Perempuan', 'Lainnya'];

function buildBackgroundSlides(form: FormPage): HeroSlide[] {
  if (form.backgroundType === 'video') {
    return form.backgroundVideo ? [{ id: 'bg-video', type: 'video', src: form.backgroundVideo }] : [];
  }
  if (form.backgroundType === 'slideshow') {
    return form.backgroundSlideshow.map((s) => ({ id: s.id, type: 'image' as const, src: s.image }));
  }
  return form.backgroundImage ? [{ id: 'bg-image', type: 'image', src: form.backgroundImage }] : [];
}

export function JoinForm({ nav, form }: { nav: Nav; form: FormPage }) {
  const [nama, setNama] = useState('');
  const [domisili, setDomisili] = useState('');
  const [usia, setUsia] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState('');
  const [status, setStatus] = useState('');
  const [alasan, setAlasan] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!nama || !domisili || !usia || !jenisKelamin || !status) {
      setError('Lengkapi dulu semua data yang wajib diisi ya.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, domisili, usia, jenisKelamin, status, alasan }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      setError('Gagal mengirim. Coba lagi sebentar lagi.');
    } finally {
      setSubmitting(false);
    }
  }

  const bgSlides = buildBackgroundSlides(form);
  const overlayStyle: React.CSSProperties = {
    background: `rgba(10,10,10,${form.backgroundOverlayOpacity})`,
  };
  const glassStyle: React.CSSProperties = {
    background: `rgba(18,18,18,${form.glassOpacity})`,
    backdropFilter: `blur(${form.glassBlur}px)`,
    WebkitBackdropFilter: `blur(${form.glassBlur}px)`,
  };

  return (
    <main className={s.page} style={{ backgroundColor: form.backgroundColor }}>
      {bgSlides.length > 0 && (
        <div className={s.bgLayer}>
          <HeroSlider slides={bgSlides} durationMs={form.slideDurationMs} />
        </div>
      )}
      <div className={s.bgOverlay} style={overlayStyle} aria-hidden />

      <div className={s.content}>
        <nav className={s.nav}>
          <span className={s.brand}>{nav.brand}</span>
          <div className={s.navLinks}>
            {nav.links.map((l) => (
              <a key={l.id} href={l.href}>{l.label}</a>
            ))}
          </div>
          <Link href="/" className={s.backCta}>← Kembali ke Beranda</Link>
        </nav>

        <div className={s.mainGrid}>
          <div className={s.left}>
            <h1 className={s.title}>
              {form.titleLine1}<br />
              <span className={s.lime}>{form.titleLine2Highlight}</span>
            </h1>
            <div className={s.subtitleLines}>
              {form.subtitleLines.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            <p className={s.formTitle}>{form.formTitle}</p>
            <div className={s.divider} />

            <div className={s.benefitList}>
              {form.benefits.map((b) => (
                <div key={b.id} className={s.benefitRow}>
                  <span className={s.benefitIcon}><Icon name={b.icon} size={19} strokeWidth={1.6} /></span>
                  <div>
                    <strong>{b.title}</strong>
                    <p>{b.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={s.right} style={glassStyle}>
            {done ? (
              <div className={s.successBox}>
                <span className={s.successIcon}><Icon name="check" size={26} strokeWidth={2} /></span>
                <h2>Makasih udah gabung!</h2>
                <p>Data lo udah kami terima. Tim {nav.brand} bakal hubungin lo lewat kontak yang lo kasih tau di domisili/media sosial.</p>
                <Link href="/" className={s.backCta}>← Kembali ke Beranda</Link>
              </div>
            ) : (
              <form className={s.form} onSubmit={submit}>
                <label className={s.label}>
                  <span><Icon name="users" size={15} strokeWidth={1.8} /> Nama Panggilan</span>
                  <input className={s.input} value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Ketik nama panggilan lo di sini..." required />
                </label>

                <label className={s.label}>
                  <span><Icon name="map-pin" size={15} strokeWidth={1.8} /> Domisili</span>
                  <input className={s.input} value={domisili} onChange={(e) => setDomisili(e.target.value)} placeholder="Kota / Kabupaten tempat tinggal lo..." required />
                </label>

                <div className={s.row2}>
                  <label className={s.label}>
                    <span><Icon name="calendar" size={15} strokeWidth={1.8} /> Usia</span>
                    <input className={s.input} type="number" min={10} max={99} value={usia} onChange={(e) => setUsia(e.target.value)} placeholder="Contoh: 17" required />
                  </label>

                  <div className={s.label}>
                    <span><Icon name="mask" size={15} strokeWidth={1.8} /> Jenis Kelamin</span>
                    <div className={s.pillRow}>
                      {GENDER_OPTIONS.map((g) => (
                        <button
                          type="button"
                          key={g}
                          className={`${s.pill} ${jenisKelamin === g ? s.pillActive : ''}`}
                          onClick={() => setJenisKelamin(g)}
                        >
                          <span className={s.radioDot} data-active={jenisKelamin === g} />
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={s.label}>
                  <span><Icon name="graduation-cap" size={15} strokeWidth={1.8} /> Status Saat Ini</span>
                  <div className={s.pillRow}>
                    {STATUS_OPTIONS.map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        className={`${s.pill} ${status === opt ? s.pillActive : ''}`}
                        onClick={() => setStatus(opt)}
                      >
                        <span className={s.radioDot} data-active={status === opt} />
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <label className={s.label}>
                  <span><Icon name="message" size={15} strokeWidth={1.8} /> Kenapa lo pengen ikut project ini?</span>
                  <textarea
                    className={s.textarea}
                    value={alasan}
                    maxLength={500}
                    rows={5}
                    onChange={(e) => setAlasan(e.target.value)}
                    placeholder="Ceritain alasan lo pengen ikut project ini..."
                  />
                  <span className={s.counter}>{alasan.length}/500</span>
                </label>

                {error && <div className={s.errorBox}>{error}</div>}

                <button type="submit" className={s.submitBtn} disabled={submitting}>
                  {submitting ? 'Mengirim...' : form.submitLabel} {!submitting && <span>→</span>}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className={s.noteBar}>
          <span className={s.noteBadge}><Icon name="book-open" size={15} strokeWidth={1.8} /> {form.noteTitle}</span>
          <div className={s.noteGrid}>
            {form.notes.map((n) => (
              <div key={n.id} className={s.noteItem}>
                <span><Icon name={n.icon} size={19} strokeWidth={1.6} /></span>
                <p>{n.text}</p>
              </div>
            ))}
          </div>
          <p className={s.noteClosingLabel}>{form.closingLabel}</p>
          <p className={s.noteClosingHighlight}>{form.closingHighlight}</p>
        </div>
      </div>
    </main>
  );
}
