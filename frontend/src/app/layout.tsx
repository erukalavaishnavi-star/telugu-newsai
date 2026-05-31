import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import QueryProvider from '@/components/providers/QueryProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Telugu NewsAI — Social Media Post Generator',
  description:
    'AI-powered social media content generation for Telugu news publishers. Convert articles to Facebook, Instagram, Twitter, WhatsApp posts instantly.',
  keywords: ['Telugu news', 'social media', 'AI', 'content generator', 'Gemini'],
  openGraph: {
    title: 'Telugu NewsAI',
    description: 'AI-powered social media post generator for Telugu news',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="te">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Tiro+Telugu:ital@0;1&family=Syne:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <QueryProvider>{children}</QueryProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#0a1628',
              color: '#fff',
              fontSize: '13px',
              borderRadius: '8px',
            },
          }}
        />
      </body>
    </html>
  );
}
