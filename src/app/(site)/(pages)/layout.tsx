'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import '../../globals.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import ScrollToTop from '../../components/Common/ScrollToTop';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { getCart } from '@/generated/api/endpoints/cart/cart';
import useCartStore from '@/stores/useCartStore';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasHydrated, setHasHydrated] = useState(false);
  const { cartItems, getCartFromServer } = useCartStore();

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setHasHydrated(true);
    } else {
      const unsub = useAuthStore.persist.onHydrate(() => {
        setHasHydrated(true);
      });
      useAuthStore.persist.rehydrate();
      return unsub;
    }
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {hasHydrated ? (
          <>
            <Header />
            {children}
            <ScrollToTop />
            <Footer />
            <Toaster />
          </>
        ) : null}
      </body>
    </html>
  );
}
