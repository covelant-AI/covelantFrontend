'use client';
import { motion } from "framer-motion";
import { useAuth } from './context/AuthContext';
import SignInPage from './sign-in/page';
import Loading from './loading';
import HeroSection from '@/components/HeroSection/HeroSection'
import HomeDashboard from '@/components/Dashboard/HomeDashboard';

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) return <Loading />
  if (!user) return <SignInPage />

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}>
      <HeroSection />
      <HomeDashboard />
    </motion.div>
  );
}
