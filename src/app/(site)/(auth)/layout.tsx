'use client';
import { Geist, Geist_Mono } from 'next/font/google';
// import "../globals.css";

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Toaster } from 'react-hot-toast';

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = useAuthStore((state) => state.user);


    if (user){
      window.location.href="/"
      return null
    }
   
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
