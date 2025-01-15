import type { Metadata } from 'next';
import { AuthProvider } from '@/app/utils/AuthContext';
import Providers from './utils/Providers';
import '@/app/globals.css';
import { SnackbarProvider } from './utils/SnackbarContext';
import Navbar from './utils/Navbar';
import { LoadingProvider } from './utils/LoadingContext';
import { Montserrat } from 'next/font/google';

const font = Montserrat({ subsets: ['latin'], weight: '500' });

export const metadata: Metadata = {
  title: 'Keg Tracker',
  description: 'Keg tracking application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <Providers>
        <html lang="en">
          <head>
            <link rel="icon" href="/favicon.png" />
          </head>
          <body className={font.className}>
            <SnackbarProvider>
              <LoadingProvider>
                <div
                  style={{
                    display: 'flex',
                    width: '100vw',
                    height: '100vh',
                    overflow: 'hidden',
                  }}
                >
                  <Navbar />
                  <main
                    style={{
                      flexGrow: 1,
                      overflow: 'auto',
                    }}
                  >
                    {children}
                  </main>
                </div>
              </LoadingProvider>
            </SnackbarProvider>
          </body>
        </html>
      </Providers>
    </AuthProvider>
  );
}
