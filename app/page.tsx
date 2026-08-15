import Link from 'next/link';
import { readContent } from '@/lib/content';
import { HeroSlider } from '@/components/HeroSlider';
import { CollabConveyor } from '@/components/CollabConveyor';
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
            </div>
          </nav>

          <div className={s.heroGrid}>
            <div className={s.heroLeft}>
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
      <section className={`${s.section} ${s.sectionLight}`}>
        <div className={s.sec01Grid}>
          <div className={s.sec01Image}>
            <span className={s.numBadge}>{c.section01.number}</span>
            <img src={c.section01.image} alt="" />
          </div>
          <div>
            <h2 className={s.h2Dark}>
              {c.section01.title} <span className={s.limeDark}>{c.section01.titleHighlight}</span> BIKIN FILM...
            </h2>
            <div className={s.chipGrid}>
              {c.section01.painPoints.map((p) => (
                <span key={p.id} className={s.chip}>{p.text} <b>×</b></span>
              ))}
            </div>
            <p className={s.bodyDark}>{c.section01.bodyText}</p>
            <p className={s.highlightDark}>{c.section01.highlightLine}</p>
          </div>
        </div>
      </section>

      {/* ── 02 Story ── */}
      <section id="tentang" className={`${s.section} ${s.sectionDark}`}>
        <div className={s.sec02Grid}>
          <div>
            <h2 className={s.h2Light}>
              <span className={s.numBadgeLime}>{c.section02.number}</span>{' '}
              {c.section02.title} <span className={s.lime}>{c.section02.titleHighlight}</span><br />
              {c.section02.titleLine2}
            </h2>
            <p className={s.bodyLight}>{c.section02.description}</p>
            <div className={s.checklistGrid}>
              {c.section02.checklist.map((item) => (
                <div key={item.id} className={s.checkItem}>
                  <Icon name="check" size={16} className={s.checkIcon} />
                  {item.text}
                </div>
              ))}
            </div>
            <p className={s.footnote}>
              {c.section02.footnote}<b>{c.section02.footnoteBold}</b>
            </p>
          </div>
          <div className={s.galleryGrid}>
            {c.section02.gallery.map((g) => (
              <div key={g.id} className={s.galleryItem}>
                <img src={g.image} alt="" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 03 Benefits ── */}
      <section id="manfaat" className={`${s.section} ${s.sectionLight}`}>
        <span className={s.numBadge}>{c.section03.number}</span>
        <h2 className={s.h2Dark}>
          {c.section03.title} <span className={s.limeDark}>{c.section03.titleHighlight}</span>
        </h2>
        <p className={s.subDark}>{c.section03.subtitle}</p>
        <div className={s.cardGrid}>
          {c.section03.cards.map((card) => (
            <div key={card.id} className={s.benefitCard}>
              <div className={s.benefitTop}>
                <span className={s.benefitIconWrap}><Icon name={card.icon} size={22} strokeWidth={1.6} /></span>
                <span className={s.benefitNum}>{card.number}</span>
              </div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 04 No Need To Be Pro ── */}
      <section id="proses" className={`${s.section} ${s.sectionDark}`}>
        {c.section04.backgroundImage && (
          <div
            className={s.sectionBgImage}
            style={{ backgroundImage: `url(${c.section04.backgroundImage})`, opacity: c.section04.backgroundOpacity }}
          />
        )}
        <div className={s.sectionBgContent}>
          <span className={s.numBadgeLime}>{c.section04.number}</span>
          <h2 className={s.h2Light}>
            {c.section04.title} <span className={s.lime}>{c.section04.titleHighlight}</span>
          </h2>
          <div className={s.iconRow}>
            {c.section04.items.map((it) => (
              <div key={it.id} className={s.iconItem}>
                <span className={s.iconItemWrap}><Icon name={it.icon} size={22} strokeWidth={1.6} /></span>
                {it.text}
              </div>
            ))}
          </div>
          <div className={s.quoteBox}>{c.section04.quote}</div>
        </div>
      </section>

      {/* ── 05 / 06 ── */}
      <section className={`${s.section} ${s.sectionLight}`}>
        <div className={s.twoColGrid}>
          <div>
            <span className={s.numBadge}>{c.section05.number}</span>
            <h2 className={s.h2Dark}>
              {c.section05.title} <span className={s.limeDark}>{c.section05.titleHighlight}</span>
            </h2>
            <div className={s.detailList}>
              {c.section05.items.map((it) => (
                <div key={it.id} className={s.detailItem}>
                  <span className={s.detailIconWrap}><Icon name={it.icon} size={18} strokeWidth={1.6} /></span>
                  <p>{it.description}</p>
                </div>
              ))}
            </div>
            <p className={s.noteBox}>
              {c.section05.noteText}<b>{c.section05.noteBold}</b>
            </p>
          </div>

          <div>
            <span className={s.numBadge}>{c.section06.number}</span>
            <h2 className={s.h2Dark}>
              {c.section06.title} <span className={s.limeDark}>{c.section06.titleHighlight}</span>
            </h2>
            <div className={s.promiseList}>
              {c.section06.promises.map((p) => (
                <div key={p.id} className={s.promiseItem}>
                  <Icon name="x" size={16} className={s.promiseIcon} />
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
          </div>
        </div>
      </section>

      {/* ── Collab conveyor ── */}
      <section className={`${s.section} ${s.sectionDark}`}>
        <span className={s.numBadgeLime}><Icon name="handshake" size={18} strokeWidth={1.8} /></span>
        <h2 className={s.h2Light}>
          {c.collabs.title} <span className={s.lime}>{c.collabs.titleHighlight}</span>
        </h2>
        <p className={s.bodyLight} style={{ marginBottom: 40 }}>{c.collabs.subtitle}</p>
        <CollabConveyor logos={c.collabs.logos} />
      </section>

      {/* ── 07 Closing ── */}
      <section id="faq" className={`${s.section} ${s.sectionDark} ${s.sectionClosing}`}>
        <div className={s.closingGrid}>
          <div>
            <span className={s.numBadgeLime}>{c.section07.number}</span>
            <h2 className={s.h2Light}>{c.section07.title}</h2>
            <p className={s.closingHighlight}>{c.section07.highlightLine}</p>
            <p className={s.bodyLight}>{c.section07.description}</p>
            <Link href={c.section07.ctaHref} className={s.btnLime}>
              {c.section07.ctaLabel} <span>→</span>
            </Link>
          </div>
          <div className={s.closingImageWrap}>
            <img src={c.section07.image} alt="" />
          </div>
        </div>
        <div className={s.featureRow}>
          {c.section07.features.map((f) => (
            <span key={f.id} className={s.featureTag}>
              <Icon name={f.icon} size={15} strokeWidth={1.8} /> {f.label}
            </span>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={s.footer}>
        <span className={s.footerText}>© {new Date().getFullYear()} {c.nav.brand}. Dibuat dengan niat baik.</span>
        <img src={c.nav.logoImage} alt={c.nav.brand} className={s.footerLogo} />
      </footer>
    </main>
  );
}
