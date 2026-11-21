import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/lib/authContext';

export const metadata: Metadata = {
  title: 'Placement Nexus 360 - Diagnostic Placement Platform',
  description: 'Proctored campus recruitment and diagnostic readiness platform powered by Gemini and STAR rubrics.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AuthProvider>
          <Navbar />
          <main className="app-container">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
