import { Redis } from '@upstash/redis';

const CONTENT_KEY = 'shotproject:content';
const SUBMISSIONS_KEY = 'shotproject:submissions';

// Vercel KV (the old standalone product) is sunset — Redis on Vercel now
// goes through a Marketplace integration (e.g. Upstash Redis), which injects
// either KV_REST_API_URL/KV_REST_API_TOKEN or UPSTASH_REDIS_REST_URL/
// UPSTASH_REDIS_REST_TOKEN depending on how it was installed. We check both
// so this works regardless of which naming your integration used.
let _redis: Redis | null = null;
function getRedis(): Redis {
  if (_redis) return _redis;
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    throw new Error(
      'Redis belum terhubung. Install integrasi Redis (mis. Upstash) dari Vercel Marketplace ke project ini, lalu redeploy — lihat README.'
    );
  }
  _redis = new Redis({ url, token });
  return _redis;
}

// ─── Types ───────────────────────────────────────────────

export type NavLink = { id: string; label: string; href: string };

export type Nav = {
  brand: string;
  links: NavLink[];
  ctaLabel: string;
  logoImage: string;
};

export type SocialLink = { id: string; platform: string; url: string };

export type Hero = {
  titleLine1: string;
  titleLine2Highlight: string;
  subtitle: string;
  paragraph1: string;
  paragraph2: string;
  highlightLine: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  socials: SocialLink[];
};

export type Section01Problem = {
  number: string;
  title: string;
  titleHighlight: string;
  image: string;
  painPoints: { id: string; text: string }[];
  bodyText: string;
  highlightLine: string;
};

export type Section02Story = {
  number: string;
  title: string;
  titleHighlight: string;
  titleLine2: string;
  description: string;
  checklist: { id: string; text: string }[];
  gallery: { id: string; image: string }[];
  footnote: string;
  footnoteBold: string;
};

export type BenefitCard = { id: string; icon: string; number: string; title: string; description: string };

export type Section03Benefits = {
  number: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  cards: BenefitCard[];
};

export type SimpleIconItem = { id: string; icon: string; text: string };

export type Section04NoPro = {
  number: string;
  title: string;
  titleHighlight: string;
  items: SimpleIconItem[];
  quote: string;
};

export type DetailedItem = { id: string; icon: string; title: string; description: string };

export type Section05WhatYouGet = {
  number: string;
  title: string;
  titleHighlight: string;
  items: DetailedItem[];
  noteText: string;
  noteBold: string;
};

export type OfferItem = { id: string; icon: string; label: string };

export type Section06NoPromises = {
  number: string;
  title: string;
  titleHighlight: string;
  promises: { id: string; text: string }[];
  offerIntro: string;
  offers: OfferItem[];
  closingText: string;
  closingBold: string;
};

export type FeatureTag = { id: string; icon: string; label: string };

export type Section07Closing = {
  number: string;
  title: string;
  highlightLine: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  features: FeatureTag[];
};

export type FormBenefit = { id: string; icon: string; title: string; description: string };

export type FormPage = {
  backgroundImage: string;
  backgroundOverlayOpacity: number; // 0-1, darkens the bg image for readability
  backgroundColor: string; // fallback / tint color behind the image
  titleLine1: string;
  titleLine2Highlight: string;
  subtitleLines: string[];
  benefits: FormBenefit[];
  formTitle: string;
  submitLabel: string;
  noteTitle: string;
  notes: { id: string; icon: string; text: string }[];
  closingLabel: string;
  closingHighlight: string;
};

export type SiteContent = {
  nav: Nav;
  hero: Hero;
  section01: Section01Problem;
  section02: Section02Story;
  section03: Section03Benefits;
  section04: Section04NoPro;
  section05: Section05WhatYouGet;
  section06: Section06NoPromises;
  section07: Section07Closing;
  formPage: FormPage;
};

export type Submission = {
  id: string;
  createdAt: string;
  nama: string;
  domisili: string;
  usia: string;
  jenisKelamin: string;
  status: string;
  alasan: string;
};

// ─── Defaults (mirrors the reference design copy) ───────

export const DEFAULT_CONTENT: SiteContent = {
  nav: {
    brand: 'SHOTPROJECT',
    links: [
      { id: 'n1', label: 'Beranda', href: '/' },
      { id: 'n2', label: 'Tentang Project', href: '#tentang' },
      { id: 'n3', label: 'Manfaat', href: '#manfaat' },
      { id: 'n4', label: 'Proses', href: '#proses' },
      { id: 'n5', label: 'FAQ', href: '#faq' },
    ],
    ctaLabel: 'GABUNG SEKARANG',
    logoImage: '/assets/logo-mark.png',
  },
  hero: {
    titleLine1: 'JANGAN CUMA',
    titleLine2Highlight: 'JADI PENONTON.',
    subtitle: 'Sekali-sekali, yuk jadi bagian dari ceritanya.',
    paragraph1: 'Kami sedang membangun sebuah project YouTube berisi film-film pendek tentang kehidupan sehari-hari.',
    paragraph2: 'Bukan audisi. Bukan kelas. Bukan juga tempat mencari orang yang sudah jago.',
    highlightLine: 'Kami cuma mencari orang yang mau berkarya, belajar, dan seru-seruan bareng.',
    ctaLabel: 'GABUNG SEKARANG',
    ctaHref: '/join',
    image: '/assets/hero.jpg',
    socials: [
      { id: 'sy', platform: 'youtube', url: 'https://youtube.com' },
      { id: 'si', platform: 'instagram', url: 'https://instagram.com' },
      { id: 'st', platform: 'tiktok', url: 'https://tiktok.com' },
      { id: 'se', platform: 'email', url: 'mailto:hello@shotproject.id' },
    ],
  },
  section01: {
    number: '01',
    title: 'PERNAH',
    titleHighlight: 'PENGEN COBA',
    image: '/assets/section01.jpg',
    painPoints: [
      { id: 'p1', text: '"Nanti aja kalau udah punya kamera."' },
      { id: 'p2', text: '"Takut hasilnya jelek."' },
      { id: 'p3', text: '"Gua nggak bisa acting."' },
      { id: 'p4', text: '"Nggak punya temen buat bikin."' },
      { id: 'p5', text: '"Gua nggak ngerti cara ngambil video."' },
    ],
    bodyText: 'Padahal mungkin yang lo butuhin bukan kamera mahal. Bukan pengalaman bertahun-tahun. Bukan juga harus jago acting.',
    highlightLine: 'Lo cuma butuh satu kesempatan untuk mulai.',
  },
  section02: {
    number: '02',
    title: 'KITA BIKIN CERITA',
    titleHighlight: 'SEDERHANA',
    titleLine2: 'DARI KEHIDUPAN SEHARI-HARI.',
    description: 'Project ini akan mengangkat cerita pendek tentang hal-hal yang mungkin sebenarnya dekat dengan kehidupan kita.',
    checklist: [
      { id: 'c1', text: 'Tentang pertemanan.' },
      { id: 'c2', text: 'Tentang pilihan.' },
      { id: 'c3', text: 'Tentang kehilangan.' },
      { id: 'c4', text: 'Tentang awkward moment.' },
      { id: 'c5', text: 'Tentang kehidupan setelah pulang kerja.' },
      { id: 'c6', text: 'Tentang orang-orang yang kita temui.' },
      { id: 'c7', text: 'Tentang hal-hal kecil yang sering kita anggap biasa.' },
    ],
    gallery: [
      { id: 'g1', image: '/assets/gallery-1.jpg' },
      { id: 'g2', image: '/assets/gallery-2.jpg' },
      { id: 'g3', image: '/assets/gallery-3.jpg' },
      { id: 'g4', image: '/assets/gallery-4.jpg' },
      { id: 'g5', image: '/assets/gallery-5.jpg' },
    ],
    footnote: 'Dan semuanya akan dibuat dengan pendekatan ',
    footnoteBold: 'film pendek + mobile filmmaking.',
  },
  section03: {
    number: '03',
    title: 'APA YANG BISA',
    titleHighlight: 'LO DAPAT?',
    subtitle: 'Bukan janji akan terkenal. Bukan janji akan dapat uang. Tapi ada beberapa hal yang mungkin jauh lebih berharga.',
    cards: [
      { id: 'b1', icon: '🙂', number: '01', title: 'BELAJAR MICRO ACTING', description: 'Lo akan belajar bagaimana menyampaikan emosi bukan hanya lewat dialog. Tatapan. Gerakan kecil. Diam. Ekspresi. Cara duduk. Cara berjalan. Hal-hal kecil yang bikin sebuah karakter terasa hidup.' },
      { id: 'b2', icon: '📷', number: '02', title: 'BELAJAR MOBILE VIDEO SHOT', description: 'Kita akan eksplor bagaimana membuat footage yang menarik hanya dengan perangkat yang kita punya. Composition. Camera movement. Framing. Shot size. Angle. Dan bagaimana membuat sebuah adegan terasa seperti film.' },
      { id: 'b3', icon: '👁️', number: '03', title: 'BELAJAR MEMBACA EKSPRESI', description: 'Kadang karakter nggak perlu banyak bicara. Satu ekspresi bisa mengatakan lebih banyak daripada satu paragraf dialog. Di sini lo akan belajar mengontrol ekspresi dan gesture secara natural di depan kamera.' },
      { id: 'b4', icon: '👥', number: '04', title: 'PUNYA PENGALAMAN BERKARYA', description: 'Daripada cuma bilang: "Gua pengen bikin sesuatu, suatu hari nanti." Mending suatu hari itu kita mulai sekarang.' },
    ],
  },
  section04: {
    number: '04',
    title: 'LO NGGAK HARUS',
    titleHighlight: 'JAGO.',
    items: [
      { id: 'i1', icon: '🎭', text: 'Kalau lo belum pernah acting, nggak masalah.' },
      { id: 'i2', icon: '📷', text: 'Kalau lo belum pernah pegang kamera, nggak masalah.' },
      { id: 'i3', icon: '🎬', text: 'Kalau lo belum pernah bikin film, justru nggak masalah.' },
    ],
    quote: 'Kita belajar sambil jalan. Karena project ini bukan tentang mencari orang paling jago. Tapi tentang menemukan orang-orang yang mau mencoba.',
  },
  section05: {
    number: '05',
    title: 'DAN YANG PALING',
    titleHighlight: 'PENTING...',
    items: [
      { id: 'd1', icon: '👥', title: 'Membawa pengalaman', description: 'Lo mungkin akan pulang bukan cuma membawa footage. Tapi membawa pengalaman.' },
      { id: 'd2', icon: '👥', title: 'Ketemu orang baru', description: 'Punya cerita baru. Punya sesuatu yang pernah lo buat.' },
      { id: 'd3', icon: '⭐', title: 'Teman baru', description: 'Dan mungkin... punya teman baru yang sama-sama suka bikin sesuatu.' },
    ],
    noteText: 'Untuk urusan konsumsi selama proses shooting, ',
    noteBold: 'kami yang tanggung. Karena kalau kita mau bikin sesuatu bareng-bareng, setidaknya kita bikin prosesnya tetap nyaman dan menyenangkan.',
  },
  section06: {
    number: '06',
    title: 'TAPI KITA',
    titleHighlight: 'NGGAK MENJANJIKAN APA-APA.',
    promises: [
      { id: 'np1', text: 'Nggak ada janji bakal viral.' },
      { id: 'np2', text: 'Nggak ada janji bakal terkenal.' },
      { id: 'np3', text: 'Nggak ada janji bakal langsung jadi aktor.' },
      { id: 'np4', text: 'Nggak ada janji project ini akan mengubah hidup lo.' },
    ],
    offerIntro: 'Yang bisa kami tawarkan cuma:',
    offers: [
      { id: 'o1', icon: '🛟', label: 'ruang untuk mencoba' },
      { id: 'o2', icon: '📗', label: 'ruang untuk belajar' },
      { id: 'o3', icon: '🤝', label: 'ruang untuk berkarya' },
      { id: 'o4', icon: '🎟️', label: 'kesempatan untuk membuat sesuatu bersama' },
    ],
    closingText: 'Sisanya? Kita lihat sejauh mana kita bisa ',
    closingBold: 'jalan bareng.',
  },
  section07: {
    number: '07',
    title: 'MUNGKIN INI BUKAN PROJECT BESAR.',
    highlightLine: 'Tapi bisa jadi... ini adalah sesuatu yang akhirnya benar-benar lo mulai.',
    description: 'Kalau selama ini lo cuma jadi penonton, sekarang waktunya masuk ke dalam frame.',
    ctaLabel: 'GABUNG SEKARANG',
    ctaHref: '/join',
    image: '/assets/section07.jpg',
    features: [
      { id: 'f1', icon: '👑', label: 'Proses seru dan fun' },
      { id: 'f2', icon: '👥', label: 'Belajar bareng dari awal' },
      { id: 'f3', icon: '💬', label: 'Teman baru, cerita baru' },
      { id: 'f4', icon: '🎬', label: 'Create something together' },
    ],
  },
  formPage: {
    backgroundImage: '/assets/form-bg.jpg',
    backgroundOverlayOpacity: 0.55,
    backgroundColor: '#0a0a0a',
    titleLine1: 'OKE.',
    titleLine2Highlight: 'KENALAN DULU.',
    subtitleLines: [
      'Nggak perlu bikin CV.',
      'Nggak perlu portofolio.',
      'Nggak perlu pengalaman acting.',
    ],
    benefits: [
      { id: 'fb1', icon: '👥', title: 'BERKARYA BARENG', description: 'Bikin cerita sederhana tentang kehidupan sehari-hari.' },
      { id: 'fb2', icon: '🎬', title: 'BELAJAR PRAKTIS', description: 'Micro acting, mobile video shot, dan ekspresi.' },
      { id: 'fb3', icon: '🙂', title: 'PROSES YANG SERU', description: 'Belajar sambil jalan, ketawa bareng, dan bikin kenangan baru.' },
      { id: 'fb4', icon: '☕', title: 'KONSUMSI KAMI TANGGUNG', description: 'Biar lo bisa fokus berkarya dan menikmati prosesnya.' },
    ],
    formTitle: 'Kami cuma ingin tahu sedikit tentang lo.',
    submitLabel: 'GABUNG',
    noteTitle: 'CATATAN KECIL',
    notes: [
      { id: 'nt1', icon: '👥', text: 'Project ini dibuat untuk belajar dan berkarya bersama.' },
      { id: 'nt2', icon: '🛡️', text: 'Tidak ada jaminan bayaran, popularitas, atau kesempatan tertentu setelah mengikuti project.' },
      { id: 'nt3', icon: '☕', text: 'Tapi selama proses shooting, konsumsi akan kami tanggung.' },
    ],
    closingLabel: 'YANG PENTING:',
    closingHighlight: 'datang, belajar, bikin sesuatu, dan have fun!',
  },
};

// ─── Storage helpers (Redis via Vercel Marketplace) ──────
//
// Locally, run `vercel env pull .env.development.local` after linking the
// project so this has credentials to talk to Redis.

export async function readContent(): Promise<SiteContent> {
  const redis = getRedis();
  const stored = await redis.get<SiteContent>(CONTENT_KEY);
  if (!stored) {
    await redis.set(CONTENT_KEY, DEFAULT_CONTENT);
    return DEFAULT_CONTENT;
  }
  // Merge with defaults so newly-added fields don't break older saved content.
  return { ...DEFAULT_CONTENT, ...stored };
}

export async function writeContent(content: SiteContent): Promise<void> {
  await getRedis().set(CONTENT_KEY, content);
}

export async function readSubmissions(): Promise<Submission[]> {
  const list = await getRedis().get<Submission[]>(SUBMISSIONS_KEY);
  return list ?? [];
}

export async function addSubmission(sub: Submission): Promise<void> {
  const redis = getRedis();
  const list = await readSubmissions();
  list.unshift(sub);
  await redis.set(SUBMISSIONS_KEY, list);
}
