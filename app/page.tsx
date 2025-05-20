'use client';
import SignInPage from './sign-in/page';
import { useAuth } from './context/AuthContext';
import NavBar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import HomeDashboard from '@/components/HomeDashboard';
import Loading from './loading';

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) return <Loading />
  if (!user) return <SignInPage />

  return (
    <>
      <NavBar/>
      <HeroSection/>
      <HomeDashboard/>
    </>
  );
}
