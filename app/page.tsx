'use client';
import SignInPage from './sign-in/page';
import { useAuth } from './context/AuthContext';
import NavBar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'

export default function Home() {
  const { user } = useAuth();

  if (!user) {
    return <SignInPage />;
  }

  return (
    <>
      <NavBar/>
      <HeroSection/>
    </>
  );
}
