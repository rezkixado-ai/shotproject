import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ShotProject — Jangan Cuma Jadi Penonton',
  description: 'Project film pendek YouTube tentang kehidupan sehari-hari. Bukan audisi, bukan kelas — cuma ruang buat berkarya, belajar, dan seru-seruan bareng.',
  icons: {
    icon: [
      { url: '/assets/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/assets/favicon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/assets/favicon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/assets/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: ['/favicon.ico'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
