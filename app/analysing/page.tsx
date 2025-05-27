'use client';
import Image from 'next/image';
import RadialBlurBg from '@/components/UI/RadialBlur';
import Link from 'next/link';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function Analysing() {
    return(
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 ">
            <Image
                src="/images/analyzing.png"
                alt="analyzing"
                width={350}
                height={300}
                className="mb-1"
            />
            <div className='text-center w-110 px-4'>
                <DotLottieReact
                    src="https://lottie.host/9106445d-fa8a-4009-8e09-5a3ddd374956/BXOjRzOTeI.lottie"
                    loop
                    autoplay
                    />
            </div>
            <p className="text-gray-600">Estimated processing time : <strong>20min</strong></p>

            <div className="mt-8 cursor-pointer z-10">
                <Link href="/">
                    <button className="px-8 py-2 bg-[#42B6B1] text-white rounded-lg hover:bg-teal-600 transition-colors duration-300 active:scale-95 transition-transform cursor-pointer">
                        Wait in Home Page
                    </button>
                </Link>
            </div>
            <RadialBlurBg 
              background={'radial-gradient(50% 50% at 50% 50%,rgba(8, 113, 151, 0.07) 61%,rgba(0, 180, 174, 0.07) 78%,rgba(176, 198, 255, 0) 100%)'}
              width={"auto"} 
              height={"504.04px"} 
              rotate={"0deg"} 
              top={'22vh'} 
              left={'5vh'}
            />
        </div>
    )
}