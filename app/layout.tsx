import { geistSans, geistMono, cairo } from "../lib/fonts";
import { AuthProvider } from "./context/AuthContext";
import NavBar from '@/components/nav/Navbar'
import "./globals.css";
import { ToastContainer } from 'react-toastify';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <AuthProvider>
        <body className={`${geistSans.variable} ${geistMono.variable}  ${cairo.variable} antialiased bg-[#FBFBFB]`}>
          <NavBar />
          {children}
          <ToastContainer />
        </body>
      </AuthProvider>
    </html>
  );
}
