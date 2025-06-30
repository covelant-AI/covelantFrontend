"use client";
import { useEffect, useState } from "react";
import ExplainedStepCard from '@/components/demoPage/ExplainedStepCard';
import { adStepsData } from '@/util/data';
import RadialBlurBg from '@/components/UI/RadialBlur';
import ReturnBackPage from '@/components/demoPage/ReturnBackPage';

export default function DemoNotePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100); // Delay for the initial image rendering

    return () => clearTimeout(timer); // Cleanup on component unmount
  }, []);

  return (
    <>
    <div className="bg-gradient-to-r from-[#AAAEC5] via-[#C0E9F1] to-[#AAAEC5] h-screen">
      <div className="relative h-full bg-gradient-to-t from-white via-transparent to-[#AAAEC5] flex items-start justify-between text-white">
        {/* Isometric Image */}
        <img
          src="/demoImages/isometric.png" // Path to your Isometric image
          alt="Isometric"
          className={`absolute bottom-0 left-0 w-full max-w-9xl opacity-0 transition-all duration-1000 ease-out transform ${
              isLoaded
              ? "translate-x-0 translate-y-0 opacity-100"
              : "translate-x-[-100%] translate-y-[100%] opacity-0"
            }`}
            />
        <div className="z-10 px-18 py-42 max-w-xl">
          <h1 className="text-7xl text-black font-semibold mb-6 text-center">
            Next Update <span className="font-bold text-8xl text-white">GENESIS</span><br/>Coming Soon 
          </h1>
        </div>
      </div>
    </div>
    <div className=" bg-white">
        <div className="w-full h-[4px] bg-gray-600"></div>
        <h2 className="text-7xl max-lg:text-2xl font-bold text-black text-center pt-10">Instant Feedback.<br/> Better Plays.</h2>
        <div className="mx-auto px-4 py-12">
        {adStepsData().map((step, index) => (
            <ExplainedStepCard
            key={index}
            imageSrc={step.imageSrc}
            stepNumber={step.stepNumber}
            title={step.title}
            description={step.description}
            bulletPoints={step.bulletPoints}
            />
        ))}
        <RadialBlurBg 
            background={'radial-gradient(50% 50% at 50% 50%,rgba(8, 113, 151, 0.1) 61%,rgba(0, 180, 174, 0.12) 78%,rgba(176, 198, 255, 0) 100%)'}
            width={"auto"} 
            height={"1204.04px"} 
            rotate={"0deg"} 
            top={'115vh'} 
            left={'40vh'}
          />
        </div>
    </div>
    <ReturnBackPage />
    </>
  );
}
