import Link from 'next/link';
import { readContent } from '@/lib/content';
import { HeroSlider } from '@/components/HeroSlider';
import { CollabConveyor } from '@/components/CollabConveyor';
import { MobileNav } from '@/components/MobileNav';
import { Icon } from '@/lib/icons';
import s from './page.module.css';

// Content lives in Redis and can change any time from the admin panel,
// so render this on every request instead of baking it in at build time.
export const dynamic = 'force-dynamic';

export default async function Home() {
  const c = await readContent();

  return (
    <main className={s.page}>
      {/* ── Hero (full-bleed slider) ── */}
      <section className={s.hero}>
        <HeroSlider slides={c.hero.slides} durationMs={c.hero.slideDurationMs} />

        <div className={s.heroContent}>
          <nav className={s.nav}>
            <span className={s.brand}>{c.nav.brand}</span>
            <div className={s.navLinks}>
              {c.nav.links.map((l) => (
                <a key={l.id} href={l.href}>{l.label}</a>
              ))}
            </div>
            <div className={s.navRight}>
              <Link href={c.hero.ctaHref} className={s.navCta}>{c.nav.ctaLabel}</Link>
              <img src={c.nav.logoImage} alt={c.nav.brand} className={s.navLogo} />
              <MobileNav links={c.nav.links} ctaLabel={c.nav.ctaLabel} ctaHref={c.hero.ctaHref} />
            </div>
          </nav>

          <div className={s.heroBody}>
            <h1 className={s.heroTitle}>
              {c.hero.titleLine1}<br />
              <span className={s.lime}>{c.hero.titleLine2Highlight}</span>
            </h1>
            <p className={s.heroSubtitle}>{c.hero.subtitle}</p>
            <p className={s.heroP}>{c.hero.paragraph1}</p>
            <p className={s.heroP}>{c.hero.paragraph2}</p>
            <p className={s.heroHighlight}>{c.hero.highlightLine}</p>
            <Link href={c.hero.ctaHref} className={s.btnLime}>
              {c.hero.ctaLabel} <span>→</span>
            </Link>
          </div>

          <div className={s.socialRail}>
            {c.hero.socials.map((soc) => (
              <a key={soc.id} href={soc.url} target="_blank" rel="noopener noreferrer" aria-label={soc.platform}>
                <Icon name={soc.platform} size={16} strokeWidth={1.8} />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── 01 Problem ── */}
      <section className={`${s.section} ${s.sectionAlt}`}>
        <div className={s.card01}>
          <div className={s.card01Image}>
            <span className={s.numBadge}>{c.section01.number}</span>
            <img src={c.section01.image} alt="" />
          </div>
          <div className={s.card01Body}>
            <h2 className={s.h2}>
              {c.section01.title} <span className={s.lime}>{c.section01.titleHighlight}</span> BIKIN FILM...
            </h2>
            <div className={s.chipGrid}>
              {c.section01.painPoints.map((p) => (
                <span key={p.id} className={s.chip}>{p.text} <b>×</b></span>
              ))}
            </div>
            <p className={s.body}>{c.section01.bodyText}</p>
            <p className={s.highlight}>{c.section01.highlightLine}</p>
          </div>
        </div>
      </section>

      {/* ── 02 Story ── */}
      <section id="tentang" className={`${s.section} ${s.sectionBase}`}>
        <span className={s.numBadge}>{c.section02.number}</span>
        <h2 className={s.h2}>
          {c.section02.title} <span className={s.lime}>{c.section02.titleHighlight}</span><br />
          {c.section02.titleLine2}
        </h2>
        <p className={s.body}>{c.section02.description}</p>
        <div className={s.checklistGrid}>
          {c.section02.checklist.map((item) => (
            <div key={item.id} className={s.checkChip}>
              <Icon name="check" size={14} className={s.checkIcon} />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
        {c.section02.gallery.length > 0 && (
          <div className={s.galleryStrip}>
            {c.section02.gallery.map((g) => (
              <div key={g.id} className={s.galleryStripItem}>
                <img src={g.image} alt="" />
              </div>
            ))}
          </div>
        )}
        <p className={s.footnote}>
          {c.section02.footnote}<b>{c.section02.footnoteBold}</b>
        </p>
      </section>

      {/* ── 03 Benefits ── */}
      <section id="manfaat" className={`${s.section} ${s.sectionAlt}`}>
        <span className={s.numBadge}>{c.section03.number}</span>
        <h2 className={s.h2}>
          {c.section03.title} <span className={s.lime}>{c.section03.titleHighlight}</span>
        </h2>
        <p className={s.sub}>{c.section03.subtitle}</p>
        <div className={s.cardGrid}>
          {c.section03.cards.map((card) => (
            <div key={card.id} className={s.benefitCard}>
              <div className={s.benefitTop}>
                <span className={s.benefitIconWrap}><Icon name={card.icon} size={20} strokeWidth={1.6} /></span>
                <span className={s.benefitNum}>{card.number}</span>
              </div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 04 No Need To Be Pro ── */}
      <section id="proses" className={`${s.section} ${s.sectionBase}`}>
        {c.section04.backgroundImage && (
          <div
            className={s.sectionBgImage}
            style={{ backgroundImage: `url(${c.section04.backgroundImage})`, opacity: c.section04.backgroundOpacity }}
          />
        )}
        <div className={s.sectionBgContent}>
          <span className={s.numBadge}>{c.section04.number}</span>
          <h2 className={s.h2}>
            {c.section04.title} <span className={s.lime}>{c.section04.titleHighlight}</span>
          </h2>
          <div className={s.iconRow}>
            {c.section04.items.map((it) => (
              <div key={it.id} className={s.iconItem}>
                <span className={s.iconItemWrap}><Icon name={it.icon} size={20} strokeWidth={1.6} /></span>
                <span>{it.text}</span>
              </div>
            ))}
          </div>
          <div className={s.quoteBox}>{c.section04.quote}</div>
        </div>
      </section>

      {/* ── 05 What You Get ── */}
      <section className={`${s.section} ${s.sectionAlt}`}>
        <span className={s.numBadge}>{c.section05.number}</span>
        <h2 className={s.h2}>
          {c.section05.title} <span className={s.lime}>{c.section05.titleHighlight}</span>
        </h2>
        <div className={s.detailList}>
          {c.section05.items.map((it) => (
            <div key={it.id} className={s.detailItem}>
              <span className={s.detailIconWrap}><Icon name={it.icon} size={16} strokeWidth={1.6} /></span>
              <p>{it.description}</p>
            </div>
          ))}
        </div>
        <p className={s.noteBox}>
          {c.section05.noteText}<b>{c.section05.noteBold}</b>
        </p>
      </section>

      {/* ── 06 No Promises ── */}
      <section className={`${s.section} ${s.sectionBase}`}>
        <span className={s.numBadge}>{c.section06.number}</span>
        <h2 className={s.h2}>
          {c.section06.title} <span className={s.lime}>{c.section06.titleHighlight}</span>
        </h2>
        <div className={s.promiseList}>
          {c.section06.promises.map((p) => (
            <div key={p.id} className={s.promiseItem}>
              <Icon name="x" size={15} className={s.promiseIcon} />
              {p.text}
            </div>
          ))}
        </div>
        <div className={s.offerBox}>
          <p>{c.section06.offerIntro}</p>
          <div className={s.offerGrid}>
            {c.section06.offers.map((o) => (
              <div key={o.id} className={s.offerItem}>
                <span className={s.offerIconWrap}><Icon name={o.icon} size={14} strokeWidth={1.8} /></span>
                {o.label}
              </div>
            ))}
          </div>
        </div>
        <p className={s.noteBox}>
          {c.section06.closingText}<b>{c.section06.closingBold}</b>
        </p>
      </section>

      {/* ── Collab conveyor ── */}
      <section className={`${s.section} ${s.sectionAlt}`}>
        <span className={s.numBadge}><Icon name="handshake" size={17} strokeWidth={1.8} /></span>
        <h2 className={s.h2}>
          {c.collabs.title} <span className={s.lime}>{c.collabs.titleHighlight}</span>
        </h2>
        <p className={s.body} style={{ marginBottom: 32 }}>{c.collabs.subtitle}</p>
        <CollabConveyor logos={c.collabs.logos} />
      </section>

      {/* ── 07 Closing ── */}
      <section id="faq" className={`${s.section} ${s.sectionBase} ${s.sectionClosing}`}>
        <div className={s.closingImageWrap}>
          <img src={c.section07.image} alt="" />
        </div>
        <span className={s.numBadge}>{c.section07.number}</span>
        <h2 className={s.h2}>{c.section07.title}</h2>
        <p className={s.closingHighlight}>{c.section07.highlightLine}</p>
        <p className={s.body}>{c.section07.description}</p>
        <Link href={c.section07.ctaHref} className={s.btnLime}>
          {c.section07.ctaLabel} <span>→</span>
        </Link>
        <div className={s.featureRow}>
          {c.section07.features.map((f) => (
            <span key={f.id} className={s.featureTag}>
              <Icon name={f.icon} size={14} strokeWidth={1.8} /> {f.label}
            </span>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={s.footer}>
        <img src={c.nav.logoImage} alt={c.nav.brand} className={s.footerLogo} />
        <span className={s.footerText}>© {new Date().getFullYear()} {c.nav.brand}. Dibuat dengan niat baik.</span>
      </footer>
    </main>
  );
}
