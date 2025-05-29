'use client';
import { motion } from "framer-motion";
import { useAuth } from './context/AuthContext';
import SignInPage from './sign-in/page';
import Loading from './loading';
import NavBar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import HomeDashboard from '@/components/HomeDashboard';

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) return <Loading />
  if (!user) return <SignInPage />

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2.2, ease: "easeOut" }}>
      <NavBar />
      <HeroSection />
      {/* <HomeDashboard /> */}
    </motion.div>
  );
}
