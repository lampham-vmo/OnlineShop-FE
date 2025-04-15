'use client'
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import "../globals.css";


import { useEffect } from "react";
import Header from "@/app/components/Header/Header";
import Footer from "@/app/components/Footer/Footer";
import { useAuthStore } from "../../../../lib/authStore";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  useEffect(() => {
    useAuthStore.getState().initAuth();

  }, [])
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}