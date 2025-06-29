"use client";
import { geistSans, geistMono, cairo } from "../lib/fonts";
import {AuthProvider} from "./context/AuthContext";
import NavBar from '@/components/nav/Navbar'
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  // List of routes where the navbar should not be displayed
  const hideNavbarRoutes = ['/sign-in', '/sign-up'];
  const isMatchesPage = /^\/matches\/[^/]+$/.test(pathname); 
  const showNavbar = !hideNavbarRoutes.includes(pathname) && !isMatchesPage;

  return (
    <html lang="en">
      <AuthProvider>
      <body className={`${geistSans.variable} ${geistMono.variable}  ${cairo.variable} antialiased bg-[#FBFBFB]`}>
        {showNavbar && <NavBar />}
        {children}
        <ToastContainer />
      </body>
      </AuthProvider>
    </html>
  );
}
