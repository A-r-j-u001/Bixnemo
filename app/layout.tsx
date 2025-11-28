import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/app/components/auth/NextAuthProvider";
import ParticleBackground from "@/app/components/ParticleBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bixnemo",
  description: "Collaboration, Video Conferencing, and AI Minutes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <ParticleBackground />
          <div className="relative z-10">
            {children}
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
