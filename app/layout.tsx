import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vending Display',
  description: 'Interactive vending machine display built with Next.js App Router',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
