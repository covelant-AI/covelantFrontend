'use client'
import {useEffect, useState } from 'react';
import SignInPage from './sign-in/page';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import RadialBlurBg from '@/components/UI/RadialBlur';
import Image from 'next/image';
import { motion } from 'framer-motion';


export default function Loading() {
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSignUp(true);
    }, 4000); 

    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  if (showSignUp) {
    return <SignInPage />;
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2.4 }}
    >
    <div className="flex flex-col items-center justify-center h-screen bg-white max-h-screen pt-10">
      <Image
        src="/images/logoBlack.png"
        alt="Covalent Logo"
        width={270}
        height={160}
        className="cursor-pointer mb-10"
      />
      <h1 className="absolute text-3xl font-normal text-center text-gray-300 mb-78">
        please wait while<br />Our AI finishes its pasta
      </h1>

      <DotLottieReact
        className="w-auto h-1/2 max-lg:w-screen max-md:h-100"
        src="https://lottie.host/ffd48327-3d2c-49c5-ba29-ef3f29cfec87/Npx18yevSd.lottie"
        loop
        autoplay
      />

      <RadialBlurBg
        background={
          'radial-gradient(50% 50% at 50% 50%,rgba(8, 113, 151, 0.1) 61%,rgba(0, 180, 174, 0.12) 78%,rgba(176, 198, 255, 0) 100%)'
        }
        width="auto"
        height="700px"
        rotate="0deg"
        top="15vh"
        left="5vh"
      />
    </div>
    </motion.div>
  )
}
