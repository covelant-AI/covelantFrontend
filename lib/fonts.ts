import { Geist, Geist_Mono, Cairo } from "next/font/google";

export const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
  });
  
export const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
  });
  
export const cairo = Cairo({
    variable: '--font-cairo',
    subsets: ['latin'],
  }) 