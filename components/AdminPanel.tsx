'use client';

import { useEffect, useState, useRef } from 'react';
import type {
  SiteContent, Nav, Hero, HeroSlide, Section01Problem, Section02Story, Section03Benefits,
  Section04NoPro, Section05WhatYouGet, Section06NoPromises, Section07Closing, CollabSection,
  FormPage, Submission,
} from '@/lib/content';
import { Icon, ICON_KEYS } from '@/lib/icons';
import { UI } from '@/lib/icons';
import s from './admin.module.css';

function prettyLabel(key: string) {
  return key.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── Login ───────────────────────────────────────────────
function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr('');
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw }),
    });
    setLoading(false);
    if (res.ok) onSuccess();
    else setErr('Password salah. Coba lagi.');
  }

  return (
    <div className={s.loginPage}>
      <form onSubmit={submit} className={s.loginCard}>
        <div className={s.loginLogo}><UI.Clapperboard size={18} strokeWidth={1.8} /> SHOTPROJECT</div>
        <h1 className={s.loginTitle}>Admin Panel</h1>
        <p className={s.loginSub}>Masuk untuk mengatur landing page & form.</p>
        <input
          type="password"
          className={s.input}
          placeholder="Password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          autoFocus
          required
        />
        {err && <div className={s.errText}>{err}</div>}
        <button type="submit" className={s.btnPrimary} disabled={loading || !pw}>
          {loading ? 'Memeriksa...' : 'Masuk'}
        </button>
      </form>
    </div>
  );
}

// ─── Upload helper ───────────────────────────────────────
function UploadField({ label, onUploaded, accept = 'image/*' }: { label: string; onUploaded: (url: string) => void; accept?: string }) {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'done'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus('uploading');
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (res.ok) {
      const data = await res.json();
      onUploaded(data.url);
      setStatus('done');
    } else {
      setStatus('idle');
    }
    setTimeout(() => setStatus('idle'), 2000);
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <label className={s.uploadRow}>
      <input ref={inputRef} type="file" accept={accept} className={s.fileInput} onChange={upload} />
      {status === 'idle' && <><UI.Upload size={14} strokeWidth={1.8} /> {label}</>}
      {status === 'uploading' && 'Uploading…'}
      {status === 'done' && <><UI.Check size={14} strokeWidth={2} /> Berhasil diupload!</>}
    </label>
  );
}

// ─── Icon picker (replaces free-text emoji input) ────────
function IconPicker({ value, onChange }: { value: string; onChange: (key: string) => void }) {
  return (
    <div className={s.iconPicker}>
      <span className={s.iconPreview}><Icon name={value} size={18} strokeWidth={1.8} /></span>
      <select className={s.select} value={value} onChange={(e) => onChange(e.target.value)}>
        {ICON_KEYS.map((key) => (
          <option key={key} value={key}>{prettyLabel(key)}</option>
        ))}
      </select>
    </div>
  );
}

// ─── Simple {id, text} list editor (chips / checklist / promises) ──
function TextListEditor({
  items, onChange, placeholder,
}: {
  items: { id: string; text: string }[];
  onChange: (items: { id: string; text: string }[]) => void;
  placeholder?: string;
}) {
  function update(i: number, text: string) {
    onChange(items.map((it, j) => (j === i ? { ...it, text } : it)));
  }
  function remove(i: number) {
    onChange(items.filter((_, j) => j !== i));
  }
  function add() {
    onChange([...items, { id: `it-${Date.now()}`, text: '' }]);
  }
  return (
    <div className={s.listEditor}>
      {items.map((it, i) => (
        <div key={it.id} className={s.listRow}>
          <input className={s.input} value={it.text} placeholder={placeholder} onChange={(e) => update(i, e.target.value)} />
          <button className={s.btnDangerSm} onClick={() => remove(i)} type="button"><UI.X size={14} /></button>
        </div>
      ))}
      <button className={s.btnAddSm} onClick={add} type="button"><UI.Plus size={13} /> Tambah</button>
    </div>
  );
}

type Tab =
  | 'hero' | 'section01' | 'section02' | 'section03' | 'section04'
  | 'section0506' | 'section07' | 'collabs' | 'formpage' | 'submissions' | 'site';

const TABS: { id: Tab; label: string; icon: keyof typeof UI }[] = [
  { id: 'hero', label: 'Hero', icon: 'Film' },
  { id: 'section01', label: '01 · Masalah', icon: 'LayoutDashboard' },
  { id: 'section02', label: '02 · Cerita', icon: 'LayoutDashboard' },
  { id: 'section03', label: '03 · Manfaat', icon: 'LayoutDashboard' },
  { id: 'section04', label: '04 · Nggak Harus Jago', icon: 'LayoutDashboard' },
  { id: 'section0506', label: '05-06 · Dapat & Janji', icon: 'LayoutDashboard' },
  { id: 'section07', label: '07 · Penutup', icon: 'LayoutDashboard' },
  { id: 'collabs', label: 'Kolaborasi', icon: 'Link2' },
  { id: 'formpage', label: 'Halaman Form', icon: 'ImageIcon' },
  { id: 'submissions', label: 'Pendaftar', icon: 'Inbox' },
  { id: 'site', label: 'Nav & Sosial', icon: 'Settings' },
];

// ─── Main Panel ──────────────────────────────────────────
export function AdminPanel({ initialAuthed }: { initialAuthed: boolean }) {
  const [authed, setAuthed] = useState(initialAuthed);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [tab, setTab] = useState<Tab>('hero');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!authed) return;
    fetch('/api/content').then((r) => r.json()).then(setContent);
  }, [authed]);

  async function save() {
    if (!content) return;
    setSaving(true);
    await fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  async function logout() {
    await fetch('/api/auth', { method: 'DELETE' });
    setAuthed(false);
    setContent(null);
  }

  if (!authed) return <LoginForm onSuccess={() => setAuthed(true)} />;
  if (!content) return <div className={s.loading}>Memuat konten…</div>;

  return (
    <div className={s.shell}>
      <aside className={s.sidebar}>
        <div className={s.sideHead}>
          <span className={s.sideTitle}><UI.Clapperboard size={16} strokeWidth={1.8} /> Admin</span>
          <button onClick={logout} className={s.logoutBtn}><UI.LogOut size={13} /> Logout</button>
        </div>
        <nav className={s.sideNav}>
          {TABS.map((t) => {
            const TabIcon = UI[t.icon];
            return (
              <button
                key={t.id}
                className={`${s.sideLink} ${tab === t.id ? s.sideLinkActive : ''}`}
                onClick={() => setTab(t.id)}
              >
                <TabIcon size={16} strokeWidth={1.8} /><span>{t.label}</span>
              </button>
            );
          })}
        </nav>
        <a href="/" target="_blank" rel="noopener" className={s.viewSite}><UI.ExternalLink size={13} /> Lihat Landing Page</a>
        <a href="/join" target="_blank" rel="noopener" className={s.viewSite}><UI.ExternalLink size={13} /> Lihat Form Page</a>
      </aside>

      <main className={s.main}>
        <div className={s.topBar}>
          <h2 className={s.pageTitle}>{TABS.find((t) => t.id === tab)?.label}</h2>
          <button onClick={save} className={s.saveBtn} disabled={saving}>
            <UI.Save size={14} /> {saving ? 'Menyimpan…' : saved ? 'Tersimpan!' : 'Simpan Semua'}
          </button>
        </div>

        {tab === 'hero' && <HeroEditor hero={content.hero} onChange={(hero) => setContent({ ...content, hero })} />}
        {tab === 'section01' && <Section01Editor data={content.section01} onChange={(section01) => setContent({ ...content, section01 })} />}
        {tab === 'section02' && <Section02Editor data={content.section02} onChange={(section02) => setContent({ ...content, section02 })} />}
        {tab === 'section03' && <Section03Editor data={content.section03} onChange={(section03) => setContent({ ...content, section03 })} />}
        {tab === 'section04' && <Section04Editor data={content.section04} onChange={(section04) => setContent({ ...content, section04 })} />}
        {tab === 'section0506' && (
          <Section0506Editor
            s5={content.section05} s6={content.section06}
            onChange5={(section05) => setContent({ ...content, section05 })}
            onChange6={(section06) => setContent({ ...content, section06 })}
          />
        )}
        {tab === 'section07' && <Section07Editor data={content.section07} onChange={(section07) => setContent({ ...content, section07 })} />}
        {tab === 'collabs' && <CollabEditor data={content.collabs} onChange={(collabs) => setContent({ ...content, collabs })} />}
        {tab === 'formpage' && <FormPageEditor data={content.formPage} onChange={(formPage) => setContent({ ...content, formPage })} />}
        {tab === 'submissions' && <SubmissionsPanel />}
        {tab === 'site' && <SiteEditor nav={content.nav} onChange={(nav) => setContent({ ...content, nav })} />}
      </main>
    </div>
  );
}

// ─── Hero Editor (slides + text + socials) ───────────────
function HeroEditor({ hero, onChange }: { hero: Hero; onChange: (h: Hero) => void }) {
  function upd(patch: Partial<Hero>) { onChange({ ...hero, ...patch }); }
  function updSlide(i: number, patch: Partial<HeroSlide>) {
    upd({ slides: hero.slides.map((sl, j) => (j === i ? { ...sl, ...patch } : sl)) });
  }
  function removeSlide(i: number) {
    upd({ slides: hero.slides.filter((_, j) => j !== i) });
  }
  function addSlide() {
    upd({ slides: [...hero.slides, { id: `hs-${Date.now()}`, type: 'image', src: '' }] });
  }
  function moveSlide(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= hero.slides.length) return;
    const next = [...hero.slides];
    [next[i], next[j]] = [next[j], next[i]];
    upd({ slides: next });
  }

  return (
    <div className={s.editorList}>
      <div className={s.card}>
        <div className={s.cardHead}><strong>Slide Background Hero</strong></div>
        <p className={s.hintText}>Bisa campur gambar & video. Slide otomatis berganti tiap {Math.round(hero.slideDurationMs / 1000)} detik dengan transisi crossfade + efek Ken Burns (zoom perlahan).</p>
        <label className={s.label} style={{ maxWidth: 260, marginTop: 10 }}>
          Durasi tiap slide (detik)
          <input
            className={s.input}
            type="number"
            min={2}
            max={20}
            value={Math.round(hero.slideDurationMs / 1000)}
            onChange={(e) => upd({ slideDurationMs: Math.max(2, +e.target.value) * 1000 })}
          />
        </label>

        {hero.slides.map((slide, i) => (
          <div key={slide.id} className={s.subCard}>
            <div className={s.cardHead}>
              <strong>Slide {i + 1}</strong>
              <div style={{ display: 'flex', gap: 6 }}>
                <button type="button" className={s.btnIconSm} onClick={() => moveSlide(i, -1)} disabled={i === 0}>↑</button>
                <button type="button" className={s.btnIconSm} onClick={() => moveSlide(i, 1)} disabled={i === hero.slides.length - 1}>↓</button>
                <button type="button" className={s.btnDangerSm} onClick={() => removeSlide(i)}><UI.X size={14} /></button>
              </div>
            </div>
            <div className={s.fieldGrid}>
              <label className={s.label}>
                Tipe Media
                <select className={s.select} value={slide.type} onChange={(e) => updSlide(i, { type: e.target.value as 'image' | 'video' })}>
                  <option value="image">Gambar</option>
                  <option value="video">Video</option>
                </select>
              </label>
              <label className={s.label}>
                Path {slide.type === 'video' ? 'Video' : 'Gambar'}
                <input className={s.input} value={slide.src} onChange={(e) => updSlide(i, { src: e.target.value })} />
              </label>
            </div>
            <UploadField
              label={`Upload ${slide.type === 'video' ? 'Video' : 'Gambar'}`}
              accept={slide.type === 'video' ? 'video/*' : 'image/*'}
              onUploaded={(url) => updSlide(i, { src: url })}
            />
          </div>
        ))}
        <button className={s.btnAddSm} type="button" onClick={addSlide}><UI.Plus size={13} /> Tambah Slide</button>
      </div>

      <div className={s.card}>
        <div className={s.fieldGrid}>
          <label className={s.label}>Baris Judul 1<input className={s.input} value={hero.titleLine1} onChange={(e) => upd({ titleLine1: e.target.value })} /></label>
          <label className={s.label}>Baris Judul 2 (kuning/highlight)<input className={s.input} value={hero.titleLine2Highlight} onChange={(e) => upd({ titleLine2Highlight: e.target.value })} /></label>
          <label className={s.label} style={{ gridColumn: '1/-1' }}>Subjudul<input className={s.input} value={hero.subtitle} onChange={(e) => upd({ subtitle: e.target.value })} /></label>
          <label className={s.label} style={{ gridColumn: '1/-1' }}>Paragraf 1<textarea className={s.textarea} rows={2} value={hero.paragraph1} onChange={(e) => upd({ paragraph1: e.target.value })} /></label>
          <label className={s.label} style={{ gridColumn: '1/-1' }}>Paragraf 2<textarea className={s.textarea} rows={2} value={hero.paragraph2} onChange={(e) => upd({ paragraph2: e.target.value })} /></label>
          <label className={s.label} style={{ gridColumn: '1/-1' }}>Baris Highlight (kuning, tebal)<input className={s.input} value={hero.highlightLine} onChange={(e) => upd({ highlightLine: e.target.value })} /></label>
          <label className={s.label}>Teks Tombol CTA<input className={s.input} value={hero.ctaLabel} onChange={(e) => upd({ ctaLabel: e.target.value })} /></label>
          <label className={s.label}>Link Tombol CTA<input className={s.input} value={hero.ctaHref} onChange={(e) => upd({ ctaHref: e.target.value })} /></label>
        </div>
      </div>

      <div className={s.card}>
        <div className={s.cardHead}><strong>Social Media Links</strong></div>
        {hero.socials.map((soc, i) => (
          <div key={soc.id} className={s.listRow}>
            <select className={s.select} value={soc.platform} onChange={(e) => {
              const next = hero.socials.map((x, j) => j === i ? { ...x, platform: e.target.value } : x);
              upd({ socials: next });
            }}>
              <option value="youtube">YouTube</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="email">Email</option>
            </select>
            <input className={s.input} value={soc.url} onChange={(e) => {
              const next = hero.socials.map((x, j) => j === i ? { ...x, url: e.target.value } : x);
              upd({ socials: next });
            }} />
            <button className={s.btnDangerSm} type="button" onClick={() => upd({ socials: hero.socials.filter((_, j) => j !== i) })}><UI.X size={14} /></button>
          </div>
        ))}
        <button className={s.btnAddSm} type="button" onClick={() => upd({ socials: [...hero.socials, { id: `soc-${Date.now()}`, platform: 'instagram', url: '' }] })}><UI.Plus size={13} /> Tambah Social Link</button>
      </div>
    </div>
  );
}

// ─── Section 01 ──────────────────────────────────────────
function Section01Editor({ data, onChange }: { data: Section01Problem; onChange: (d: Section01Problem) => void }) {
  function upd(patch: Partial<Section01Problem>) { onChange({ ...data, ...patch }); }
  return (
    <div className={s.editorList}>
      <div className={s.card}>
        <div className={s.fieldGrid}>
          <label className={s.label}>Judul (putih)<input className={s.input} value={data.title} onChange={(e) => upd({ title: e.target.value })} /></label>
          <label className={s.label}>Judul Highlight (kuning)<input className={s.input} value={data.titleHighlight} onChange={(e) => upd({ titleHighlight: e.target.value })} /></label>
          <label className={s.label} style={{ gridColumn: '1/-1' }}>Body Text<textarea className={s.textarea} rows={2} value={data.bodyText} onChange={(e) => upd({ bodyText: e.target.value })} /></label>
          <label className={s.label} style={{ gridColumn: '1/-1' }}>Highlight Line<input className={s.input} value={data.highlightLine} onChange={(e) => upd({ highlightLine: e.target.value })} /></label>
          <label className={s.label}>Path Gambar<input className={s.input} value={data.image} onChange={(e) => upd({ image: e.target.value })} /></label>
        </div>
        <UploadField label="Ganti Gambar" onUploaded={(url) => upd({ image: url })} />
      </div>
      <div className={s.card}>
        <div className={s.cardHead}><strong>Pain Points (chip alasan)</strong></div>
        <TextListEditor items={data.painPoints} onChange={(painPoints) => upd({ painPoints })} placeholder='"Nanti aja kalau udah punya kamera."' />
      </div>
    </div>
  );
}

// ─── Section 02 ──────────────────────────────────────────
function Section02Editor({ data, onChange }: { data: Section02Story; onChange: (d: Section02Story) => void }) {
  function upd(patch: Partial<Section02Story>) { onChange({ ...data, ...patch }); }
  function updGallery(i: number, image: string) {
    upd({ gallery: data.gallery.map((g, j) => (j === i ? { ...g, image } : g)) });
  }
  return (
    <div className={s.editorList}>
      <div className={s.card}>
        <div className={s.fieldGrid}>
          <label className={s.label}>Judul<input className={s.input} value={data.title} onChange={(e) => upd({ title: e.target.value })} /></label>
          <label className={s.label}>Judul Highlight (kuning)<input className={s.input} value={data.titleHighlight} onChange={(e) => upd({ titleHighlight: e.target.value })} /></label>
          <label className={s.label} style={{ gridColumn: '1/-1' }}>Judul Baris 2<input className={s.input} value={data.titleLine2} onChange={(e) => upd({ titleLine2: e.target.value })} /></label>
          <label className={s.label} style={{ gridColumn: '1/-1' }}>Deskripsi<textarea className={s.textarea} rows={2} value={data.description} onChange={(e) => upd({ description: e.target.value })} /></label>
          <label className={s.label}>Footnote (sebelum bold)<input className={s.input} value={data.footnote} onChange={(e) => upd({ footnote: e.target.value })} /></label>
          <label className={s.label}>Footnote Bold<input className={s.input} value={data.footnoteBold} onChange={(e) => upd({ footnoteBold: e.target.value })} /></label>
        </div>
      </div>
      <div className={s.card}>
        <div className={s.cardHead}><strong>Checklist (tema cerita)</strong></div>
        <TextListEditor items={data.checklist} onChange={(checklist) => upd({ checklist })} placeholder="Tentang pertemanan." />
      </div>
      <div className={s.card}>
        <div className={s.cardHead}><strong>Galeri Foto (grid)</strong></div>
        {data.gallery.map((g, i) => (
          <div key={g.id} className={s.listRow}>
            <input className={s.input} value={g.image} onChange={(e) => updGallery(i, e.target.value)} />
            <button className={s.btnDangerSm} type="button" onClick={() => upd({ gallery: data.gallery.filter((_, j) => j !== i) })}><UI.X size={14} /></button>
          </div>
        ))}
        {data.gallery.map((g, i) => (
          <UploadField key={g.id + '-up'} label={`Upload Foto ${i + 1}`} onUploaded={(url) => updGallery(i, url)} />
        ))}
        <button className={s.btnAddSm} type="button" onClick={() => upd({ gallery: [...data.gallery, { id: `g-${Date.now()}`, image: '' }] })}><UI.Plus size={13} /> Tambah Foto</button>
      </div>
    </div>
  );
}

// ─── Section 03 ──────────────────────────────────────────
function Section03Editor({ data, onChange }: { data: Section03Benefits; onChange: (d: Section03Benefits) => void }) {
  function upd(patch: Partial<Section03Benefits>) { onChange({ ...data, ...patch }); }
  function updCard(i: number, patch: Partial<Section03Benefits['cards'][number]>) {
    upd({ cards: data.cards.map((c, j) => (j === i ? { ...c, ...patch } : c)) });
  }
  return (
    <div className={s.editorList}>
      <div className={s.card}>
        <div className={s.fieldGrid}>
          <label className={s.label}>Judul<input className={s.input} value={data.title} onChange={(e) => upd({ title: e.target.value })} /></label>
          <label className={s.label}>Judul Highlight<input className={s.input} value={data.titleHighlight} onChange={(e) => upd({ titleHighlight: e.target.value })} /></label>
          <label className={s.label} style={{ gridColumn: '1/-1' }}>Subjudul<textarea className={s.textarea} rows={2} value={data.subtitle} onChange={(e) => upd({ subtitle: e.target.value })} /></label>
        </div>
      </div>
      {data.cards.map((card, i) => (
        <div key={card.id} className={s.card}>
          <div className={s.cardHead}><strong>Kartu {i + 1}</strong></div>
          <div className={s.fieldGrid}>
            <label className={s.label}>Icon<IconPicker value={card.icon} onChange={(icon) => updCard(i, { icon })} /></label>
            <label className={s.label}>Nomor<input className={s.input} value={card.number} onChange={(e) => updCard(i, { number: e.target.value })} /></label>
            <label className={s.label} style={{ gridColumn: '1/-1' }}>Judul<input className={s.input} value={card.title} onChange={(e) => updCard(i, { title: e.target.value })} /></label>
            <label className={s.label} style={{ gridColumn: '1/-1' }}>Deskripsi<textarea className={s.textarea} rows={3} value={card.description} onChange={(e) => updCard(i, { description: e.target.value })} /></label>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Section 04 ──────────────────────────────────────────
function Section04Editor({ data, onChange }: { data: Section04NoPro; onChange: (d: Section04NoPro) => void }) {
  function upd(patch: Partial<Section04NoPro>) { onChange({ ...data, ...patch }); }
  function updItem(i: number, patch: Partial<Section04NoPro['items'][number]>) {
    upd({ items: data.items.map((it, j) => (j === i ? { ...it, ...patch } : it)) });
  }
  return (
    <div className={s.editorList}>
      <div className={s.card}>
        <div className={s.fieldGrid}>
          <label className={s.label}>Judul<input className={s.input} value={data.title} onChange={(e) => upd({ title: e.target.value })} /></label>
          <label className={s.label}>Judul Highlight<input className={s.input} value={data.titleHighlight} onChange={(e) => upd({ titleHighlight: e.target.value })} /></label>
          <label className={s.label} style={{ gridColumn: '1/-1' }}>Quote Box<textarea className={s.textarea} rows={3} value={data.quote} onChange={(e) => upd({ quote: e.target.value })} /></label>
        </div>
      </div>
      <div className={s.card}>
        <div className={s.cardHead}><strong>Background Section (opsional)</strong></div>
        <div className={s.fieldGrid}>
          <label className={s.label} style={{ gridColumn: '1/-1' }}>
            Path Gambar Background (kosongkan buat pakai background hitam polos)
            <input className={s.input} value={data.backgroundImage} onChange={(e) => upd({ backgroundImage: e.target.value })} />
          </label>
          <label className={s.label}>
            Opacity ({Math.round(data.backgroundOpacity * 100)}%)
            <input type="range" min={0} max={1} step={0.05} value={data.backgroundOpacity} onChange={(e) => upd({ backgroundOpacity: +e.target.value })} />
          </label>
        </div>
        <UploadField label="Upload Gambar Background" onUploaded={(url) => upd({ backgroundImage: url })} />
        {data.backgroundImage && (
          <button className={s.btnAddSm} type="button" onClick={() => upd({ backgroundImage: '' })} style={{ marginTop: 10 }}>
            <UI.X size={13} /> Hapus Background
          </button>
        )}
      </div>
      <div className={s.card}>
        <div className={s.cardHead}><strong>3 Poin Icon</strong></div>
        {data.items.map((it, i) => (
          <div key={it.id} className={s.listRow}>
            <IconPicker value={it.icon} onChange={(icon) => updItem(i, { icon })} />
            <input className={s.input} value={it.text} onChange={(e) => updItem(i, { text: e.target.value })} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section 05 & 06 ─────────────────────────────────────
function Section0506Editor({
  s5, s6, onChange5, onChange6,
}: {
  s5: Section05WhatYouGet; s6: Section06NoPromises;
  onChange5: (d: Section05WhatYouGet) => void; onChange6: (d: Section06NoPromises) => void;
}) {
  function upd5(patch: Partial<Section05WhatYouGet>) { onChange5({ ...s5, ...patch }); }
  function upd6(patch: Partial<Section06NoPromises>) { onChange6({ ...s6, ...patch }); }
  function updItem5(i: number, patch: Partial<Section05WhatYouGet['items'][number]>) {
    upd5({ items: s5.items.map((it, j) => (j === i ? { ...it, ...patch } : it)) });
  }
  function updOffer(i: number, patch: Partial<Section06NoPromises['offers'][number]>) {
    upd6({ offers: s6.offers.map((o, j) => (j === i ? { ...o, ...patch } : o)) });
  }

  return (
    <div className={s.editorList}>
      <div className={s.card}>
        <div className={s.cardHead}><strong>05 · Apa yang Lo Dapat</strong></div>
        <div className={s.fieldGrid}>
          <label className={s.label}>Judul<input className={s.input} value={s5.title} onChange={(e) => upd5({ title: e.target.value })} /></label>
          <label className={s.label}>Judul Highlight<input className={s.input} value={s5.titleHighlight} onChange={(e) => upd5({ titleHighlight: e.target.value })} /></label>
          <label className={s.label} style={{ gridColumn: '1/-1' }}>Catatan (sebelum bold)<input className={s.input} value={s5.noteText} onChange={(e) => upd5({ noteText: e.target.value })} /></label>
          <label className={s.label} style={{ gridColumn: '1/-1' }}>Catatan Bold<textarea className={s.textarea} rows={2} value={s5.noteBold} onChange={(e) => upd5({ noteBold: e.target.value })} /></label>
        </div>
        {s5.items.map((it, i) => (
          <div key={it.id} className={s.listRow}>
            <IconPicker value={it.icon} onChange={(icon) => updItem5(i, { icon })} />
            <input className={s.input} value={it.title} onChange={(e) => updItem5(i, { title: e.target.value })} placeholder="Judul singkat" />
            <input className={s.input} value={it.description} onChange={(e) => updItem5(i, { description: e.target.value })} placeholder="Deskripsi" />
          </div>
        ))}
      </div>

      <div className={s.card}>
        <div className={s.cardHead}><strong>06 · Nggak Ada Janji</strong></div>
        <div className={s.fieldGrid}>
          <label className={s.label}>Judul<input className={s.input} value={s6.title} onChange={(e) => upd6({ title: e.target.value })} /></label>
          <label className={s.label}>Judul Highlight<input className={s.input} value={s6.titleHighlight} onChange={(e) => upd6({ titleHighlight: e.target.value })} /></label>
          <label className={s.label}>Intro Offer<input className={s.input} value={s6.offerIntro} onChange={(e) => upd6({ offerIntro: e.target.value })} /></label>
          <label className={s.label}>Closing (sebelum bold)<input className={s.input} value={s6.closingText} onChange={(e) => upd6({ closingText: e.target.value })} /></label>
          <label className={s.label} style={{ gridColumn: '1/-1' }}>Closing Bold<input className={s.input} value={s6.closingBold} onChange={(e) => upd6({ closingBold: e.target.value })} /></label>
        </div>
        <div className={s.cardHead}><strong>Daftar &quot;Nggak ada janji...&quot;</strong></div>
        <TextListEditor items={s6.promises} onChange={(promises) => upd6({ promises })} placeholder="Nggak ada janji bakal viral." />
        <div className={s.cardHead}><strong>Yang Ditawarkan</strong></div>
        {s6.offers.map((o, i) => (
          <div key={o.id} className={s.listRow}>
            <IconPicker value={o.icon} onChange={(icon) => updOffer(i, { icon })} />
            <input className={s.input} value={o.label} onChange={(e) => updOffer(i, { label: e.target.value })} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section 07 ──────────────────────────────────────────
function Section07Editor({ data, onChange }: { data: Section07Closing; onChange: (d: Section07Closing) => void }) {
  function upd(patch: Partial<Section07Closing>) { onChange({ ...data, ...patch }); }
  function updFeature(i: number, patch: Partial<Section07Closing['features'][number]>) {
    upd({ features: data.features.map((f, j) => (j === i ? { ...f, ...patch } : f)) });
  }
  return (
    <div className={s.editorList}>
      <div className={s.card}>
        <div className={s.fieldGrid}>
          <label className={s.label} style={{ gridColumn: '1/-1' }}>Judul<input className={s.input} value={data.title} onChange={(e) => upd({ title: e.target.value })} /></label>
          <label className={s.label} style={{ gridColumn: '1/-1' }}>Highlight Line (kuning)<input className={s.input} value={data.highlightLine} onChange={(e) => upd({ highlightLine: e.target.value })} /></label>
          <label className={s.label} style={{ gridColumn: '1/-1' }}>Deskripsi<textarea className={s.textarea} rows={2} value={data.description} onChange={(e) => upd({ description: e.target.value })} /></label>
          <label className={s.label}>Teks Tombol<input className={s.input} value={data.ctaLabel} onChange={(e) => upd({ ctaLabel: e.target.value })} /></label>
          <label className={s.label}>Link Tombol<input className={s.input} value={data.ctaHref} onChange={(e) => upd({ ctaHref: e.target.value })} /></label>
          <label className={s.label}>Path Gambar<input className={s.input} value={data.image} onChange={(e) => upd({ image: e.target.value })} /></label>
        </div>
        <UploadField label="Ganti Gambar" onUploaded={(url) => upd({ image: url })} />
      </div>
      <div className={s.card}>
        <div className={s.cardHead}><strong>Feature Tags Bawah</strong></div>
        {data.features.map((f, i) => (
          <div key={f.id} className={s.listRow}>
            <IconPicker value={f.icon} onChange={(icon) => updFeature(i, { icon })} />
            <input className={s.input} value={f.label} onChange={(e) => updFeature(i, { label: e.target.value })} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Collab Conveyor Editor ───────────────────────────────
function CollabEditor({ data, onChange }: { data: CollabSection; onChange: (d: CollabSection) => void }) {
  function upd(patch: Partial<CollabSection>) { onChange({ ...data, ...patch }); }
  function updLogo(i: number, patch: Partial<CollabSection['logos'][number]>) {
    upd({ logos: data.logos.map((l, j) => (j === i ? { ...l, ...patch } : l)) });
  }
  function removeLogo(i: number) {
    upd({ logos: data.logos.filter((_, j) => j !== i) });
  }
  function addLogo() {
    upd({ logos: [...data.logos, { id: `cl-${Date.now()}`, name: 'Kolaborator Baru', image: '', description: '' }] });
  }

  return (
    <div className={s.editorList}>
      <div className={s.card}>
        <div className={s.fieldGrid}>
          <label className={s.label}>Judul<input className={s.input} value={data.title} onChange={(e) => upd({ title: e.target.value })} /></label>
          <label className={s.label}>Judul Highlight (kuning)<input className={s.input} value={data.titleHighlight} onChange={(e) => upd({ titleHighlight: e.target.value })} /></label>
          <label className={s.label} style={{ gridColumn: '1/-1' }}>Subjudul<textarea className={s.textarea} rows={2} value={data.subtitle} onChange={(e) => upd({ subtitle: e.target.value })} /></label>
        </div>
        <p className={s.hintText}>Logo berjalan otomatis (infinite loop). Kalau diklik di halaman publik, logo itu membesar dengan glow hijau dan logo lain jadi blur, sambil nampilin deskripsi di bawahnya.</p>
      </div>

      {data.logos.map((logo, i) => (
        <div key={logo.id} className={s.card}>
          <div className={s.cardHead}>
            <strong>Kolaborator {i + 1}</strong>
            <button className={s.btnDangerSm} type="button" onClick={() => removeLogo(i)}><UI.X size={14} /></button>
          </div>
          <div className={s.fieldGrid}>
            <label className={s.label}>Nama<input className={s.input} value={logo.name} onChange={(e) => updLogo(i, { name: e.target.value })} /></label>
            <label className={s.label}>Path Logo<input className={s.input} value={logo.image} onChange={(e) => updLogo(i, { image: e.target.value })} /></label>
            <label className={s.label} style={{ gridColumn: '1/-1' }}>Deskripsi (muncul saat logo diklik)<textarea className={s.textarea} rows={2} value={logo.description} onChange={(e) => updLogo(i, { description: e.target.value })} /></label>
          </div>
          <UploadField label="Upload Logo" onUploaded={(url) => updLogo(i, { image: url })} />
        </div>
      ))}
      <button className={s.btnAddSm} type="button" onClick={addLogo}><UI.Plus size={13} /> Tambah Kolaborator</button>
    </div>
  );
}

// ─── Form Page Editor (background image/video/slideshow + glassmorphism) ───
function FormPageEditor({ data, onChange }: { data: FormPage; onChange: (d: FormPage) => void }) {
  function upd(patch: Partial<FormPage>) { onChange({ ...data, ...patch }); }
  function updBenefit(i: number, patch: Partial<FormPage['benefits'][number]>) {
    upd({ benefits: data.benefits.map((b, j) => (j === i ? { ...b, ...patch } : b)) });
  }
  function updNote(i: number, patch: Partial<FormPage['notes'][number]>) {
    upd({ notes: data.notes.map((n, j) => (j === i ? { ...n, ...patch } : n)) });
  }
  function updSlideshow(i: number, image: string) {
    upd({ backgroundSlideshow: data.backgroundSlideshow.map((sl, j) => (j === i ? { ...sl, image } : sl)) });
  }

  return (
    <div className={s.editorList}>
      <div className={s.card}>
        <div className={s.cardHead}><strong>Background Halaman Form</strong></div>
        <label className={s.label} style={{ maxWidth: 320, marginBottom: 14 }}>
          Tipe Background
          <select className={s.select} value={data.backgroundType} onChange={(e) => upd({ backgroundType: e.target.value as FormPage['backgroundType'] })}>
            <option value="image">Gambar Statis</option>
            <option value="video">Video</option>
            <option value="slideshow">Slideshow Gambar (transisi otomatis)</option>
          </select>
        </label>

        {data.backgroundType === 'image' && (
          <>
            <label className={s.label} style={{ gridColumn: '1/-1' }}>
              Path Gambar Background
              <input className={s.input} value={data.backgroundImage} onChange={(e) => upd({ backgroundImage: e.target.value })} />
            </label>
            <UploadField label="Upload Gambar Background" onUploaded={(url) => upd({ backgroundImage: url })} />
          </>
        )}

        {data.backgroundType === 'video' && (
          <>
            <label className={s.label} style={{ gridColumn: '1/-1' }}>
              Path Video Background (mp4, idealnya di-compress & tanpa suara)
              <input className={s.input} value={data.backgroundVideo} onChange={(e) => upd({ backgroundVideo: e.target.value })} />
            </label>
            <UploadField label="Upload Video Background" accept="video/*" onUploaded={(url) => upd({ backgroundVideo: url })} />
          </>
        )}

        {data.backgroundType === 'slideshow' && (
          <>
            {data.backgroundSlideshow.map((sl, i) => (
              <div key={sl.id}>
                <div className={s.listRow}>
                  <input className={s.input} value={sl.image} onChange={(e) => updSlideshow(i, e.target.value)} />
                  <button className={s.btnDangerSm} type="button" onClick={() => upd({ backgroundSlideshow: data.backgroundSlideshow.filter((_, j) => j !== i) })}><UI.X size={14} /></button>
                </div>
                <UploadField label={`Upload Gambar ${i + 1}`} onUploaded={(url) => updSlideshow(i, url)} />
              </div>
            ))}
            <button className={s.btnAddSm} type="button" onClick={() => upd({ backgroundSlideshow: [...data.backgroundSlideshow, { id: `fs-${Date.now()}`, image: '' }] })}><UI.Plus size={13} /> Tambah Gambar Slideshow</button>
          </>
        )}

        {(data.backgroundType === 'video' || data.backgroundType === 'slideshow') && (
          <label className={s.label} style={{ maxWidth: 260, marginTop: 14 }}>
            Durasi tiap slide (detik) {data.backgroundType === 'video' ? '— hanya berlaku untuk crossfade awal video' : ''}
            <input
              className={s.input}
              type="number"
              min={2}
              max={20}
              value={Math.round(data.slideDurationMs / 1000)}
              onChange={(e) => upd({ slideDurationMs: Math.max(2, +e.target.value) * 1000 })}
            />
          </label>
        )}

        <div className={s.fieldGrid} style={{ marginTop: 16 }}>
          <label className={s.label}>
            Warna Fallback (sebelum media termuat)
            <input type="color" className={s.colorInput} value={data.backgroundColor} onChange={(e) => upd({ backgroundColor: e.target.value })} />
          </label>
          <label className={s.label}>
            Gelap Overlay ({Math.round(data.backgroundOverlayOpacity * 100)}%)
            <input type="range" min={0} max={0.9} step={0.05} value={data.backgroundOverlayOpacity} onChange={(e) => upd({ backgroundOverlayOpacity: +e.target.value })} />
          </label>
        </div>
        <p className={s.hintText}>Overlay gelap ini penting supaya teks form tetap kebaca jelas di atas media apapun yang lo pakai.</p>
      </div>

      <div className={s.card}>
        <div className={s.cardHead}><strong>Glassmorphism Kartu Form</strong></div>
        <div className={s.fieldGrid}>
          <label className={s.label}>
            Opacity Kaca ({Math.round(data.glassOpacity * 100)}%)
            <input type="range" min={0} max={1} step={0.02} value={data.glassOpacity} onChange={(e) => upd({ glassOpacity: +e.target.value })} />
          </label>
          <label className={s.label}>
            Blur Belakang ({data.glassBlur}px)
            <input type="range" min={0} max={24} step={1} value={data.glassBlur} onChange={(e) => upd({ glassBlur: +e.target.value })} />
          </label>
        </div>
        <p className={s.hintText}>Opacity rendah + blur tinggi = efek kaca buram yang tetap nampilin background di baliknya. Opacity tinggi = kartu form makin solid/gelap.</p>
      </div>

      <div className={s.card}>
        <div className={s.fieldGrid}>
          <label className={s.label}>Judul Baris 1<input className={s.input} value={data.titleLine1} onChange={(e) => upd({ titleLine1: e.target.value })} /></label>
          <label className={s.label}>Judul Baris 2 (kuning)<input className={s.input} value={data.titleLine2Highlight} onChange={(e) => upd({ titleLine2Highlight: e.target.value })} /></label>
          <label className={s.label} style={{ gridColumn: '1/-1' }}>Judul Form (di atas kolom input)<input className={s.input} value={data.formTitle} onChange={(e) => upd({ formTitle: e.target.value })} /></label>
          <label className={s.label}>Teks Tombol Submit<input className={s.input} value={data.submitLabel} onChange={(e) => upd({ submitLabel: e.target.value })} /></label>
        </div>
        <div className={s.cardHead}><strong>Baris Subjudul (kiri)</strong></div>
        {data.subtitleLines.map((line, i) => (
          <div key={i} className={s.listRow}>
            <input className={s.input} value={line} onChange={(e) => {
              const next = [...data.subtitleLines]; next[i] = e.target.value; upd({ subtitleLines: next });
            }} />
            <button className={s.btnDangerSm} type="button" onClick={() => upd({ subtitleLines: data.subtitleLines.filter((_, j) => j !== i) })}><UI.X size={14} /></button>
          </div>
        ))}
        <button className={s.btnAddSm} type="button" onClick={() => upd({ subtitleLines: [...data.subtitleLines, ''] })}><UI.Plus size={13} /> Tambah Baris</button>
      </div>

      <div className={s.card}>
        <div className={s.cardHead}><strong>4 Poin Manfaat (kiri, di bawah subjudul)</strong></div>
        {data.benefits.map((b, i) => (
          <div key={b.id} className={s.fieldGrid} style={{ borderBottom: '1px solid #2a2a2d', paddingBottom: 12, marginBottom: 12 }}>
            <label className={s.label}>Icon<IconPicker value={b.icon} onChange={(icon) => updBenefit(i, { icon })} /></label>
            <label className={s.label}>Judul<input className={s.input} value={b.title} onChange={(e) => updBenefit(i, { title: e.target.value })} /></label>
            <label className={s.label} style={{ gridColumn: '1/-1' }}>Deskripsi<input className={s.input} value={b.description} onChange={(e) => updBenefit(i, { description: e.target.value })} /></label>
          </div>
        ))}
      </div>

      <div className={s.card}>
        <div className={s.cardHead}><strong>Catatan Kecil (bawah form)</strong></div>
        <label className={s.label}>Judul Badge<input className={s.input} value={data.noteTitle} onChange={(e) => upd({ noteTitle: e.target.value })} /></label>
        {data.notes.map((n, i) => (
          <div key={n.id} className={s.listRow}>
            <IconPicker value={n.icon} onChange={(icon) => updNote(i, { icon })} />
            <input className={s.input} value={n.text} onChange={(e) => updNote(i, { text: e.target.value })} />
          </div>
        ))}
        <div className={s.fieldGrid} style={{ marginTop: 12 }}>
          <label className={s.label}>Label Penutup<input className={s.input} value={data.closingLabel} onChange={(e) => upd({ closingLabel: e.target.value })} /></label>
          <label className={s.label} style={{ gridColumn: '1/-1' }}>Highlight Penutup (kuning besar)<input className={s.input} value={data.closingHighlight} onChange={(e) => upd({ closingHighlight: e.target.value })} /></label>
        </div>
      </div>
    </div>
  );
}

// ─── Site (Nav & general) Editor ─────────────────────────
function SiteEditor({ nav, onChange }: { nav: Nav; onChange: (n: Nav) => void }) {
  function upd(patch: Partial<Nav>) { onChange({ ...nav, ...patch }); }
  function updLink(i: number, patch: Partial<Nav['links'][number]>) {
    upd({ links: nav.links.map((l, j) => (j === i ? { ...l, ...patch } : l)) });
  }
  return (
    <div className={s.editorList}>
      <div className={s.card}>
        <div className={s.cardHead}><strong>Logo</strong></div>
        <div className={s.fieldGrid}>
          <label className={s.label} style={{ gridColumn: '1/-1' }}>
            Path Logo (muncul di pojok kanan atas header & pojok kanan bawah footer)
            <input className={s.input} value={nav.logoImage} onChange={(e) => upd({ logoImage: e.target.value })} />
          </label>
        </div>
        <UploadField label="Ganti Logo" onUploaded={(url) => upd({ logoImage: url })} />
        <p className={s.hintText}>Pakai file PNG transparan warna putih biar nyatu sama background gelap, sama kayak logo default.</p>
      </div>

      <div className={s.card}>
        <div className={s.fieldGrid}>
          <label className={s.label}>Nama Brand (navbar)<input className={s.input} value={nav.brand} onChange={(e) => upd({ brand: e.target.value })} /></label>
          <label className={s.label}>Teks Tombol CTA Navbar<input className={s.input} value={nav.ctaLabel} onChange={(e) => upd({ ctaLabel: e.target.value })} /></label>
        </div>
        <div className={s.cardHead}><strong>Menu Navigasi</strong></div>
        {nav.links.map((l, i) => (
          <div key={l.id} className={s.listRow}>
            <input className={s.input} value={l.label} onChange={(e) => updLink(i, { label: e.target.value })} placeholder="Label" />
            <input className={s.input} value={l.href} onChange={(e) => updLink(i, { href: e.target.value })} placeholder="#anchor atau /path" />
            <button className={s.btnDangerSm} type="button" onClick={() => upd({ links: nav.links.filter((_, j) => j !== i) })}><UI.X size={14} /></button>
          </div>
        ))}
        <button className={s.btnAddSm} type="button" onClick={() => upd({ links: [...nav.links, { id: `n-${Date.now()}`, label: 'Menu Baru', href: '#' }] })}><UI.Plus size={13} /> Tambah Menu</button>
      </div>
    </div>
  );
}

// ─── Submissions Panel ───────────────────────────────────
function SubmissionsPanel() {
  const [subs, setSubs] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/submissions')
      .then((r) => r.json())
      .then((d) => { setSubs(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className={s.loading}>Memuat pendaftar…</div>;

  return (
    <div className={s.editorList}>
      <div style={{ color: '#f4f3ef', fontSize: '1rem', marginBottom: 4 }}>{subs.length} orang sudah daftar</div>
      {subs.length === 0 && <div className={s.hintText}>Belum ada yang isi form.</div>}
      {subs.map((sub) => (
        <div key={sub.id} className={s.card}>
          <div className={s.cardHead}>
            <strong>{sub.nama}</strong>
            <span style={{ fontSize: '0.72rem', color: '#8a8a86' }}>
              {new Date(sub.createdAt).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className={s.subMetaRow}>
            <span><Icon name="map-pin" size={13} strokeWidth={1.8} /> {sub.domisili}</span>
            <span><Icon name="calendar" size={13} strokeWidth={1.8} /> {sub.usia} th</span>
            <span><Icon name="mask" size={13} strokeWidth={1.8} /> {sub.jenisKelamin}</span>
            <span><Icon name="graduation-cap" size={13} strokeWidth={1.8} /> {sub.status}</span>
          </div>
          {sub.alasan && <p style={{ color: '#a9a9a3', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>{sub.alasan}</p>}
        </div>
      ))}
    </div>
  );
}
