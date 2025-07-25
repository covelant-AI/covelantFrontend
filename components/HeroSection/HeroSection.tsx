import Image from 'next/image'
import RadialBlurBg from '@/components/UI/RadialBlur'
import ConnectionBox from './ConnectionsBox'
import Link from 'next/link'

export default function HeroSection(){
    return(
        <div className="relative overflow-hidden flex justify-between items-center px-20 pt-60 pb-8 xl:px-60 bg-[#F9F9F9]  max-md:flex-col max-md:items-start max-sm:px-4 max-sm:pt-35">
          <RadialBlurBg 
              background={'radial-gradient(50% 50% at 50% 50%,rgba(8, 113, 151, 0.1) 61%,rgba(0, 180, 174, 0.12) 78%,rgba(176, 198, 255, 0) 100%)'}
              width={"auto"} 
              height={"504.04px"} 
              rotate={"0deg"} 
              top={'15vh'} 
              left={'5vh'}
            />

          <div className="flex flex-col items-start space-x-2 z-1">
            {/* left hand side */}
            <div className="pb-4">
                <p className="font-semibold text-[#3E3E3E] text-md">Your Actions</p>
            </div>
            <Link href="/upload-match">
                <button className="flex items-center bg-[#42B6B1] text-white py-2 px-7 rounded-lg font-semibold mb-2 
                cursor-pointer hover:bg-teal-600 transition-colors duration-100 active:scale-95 transition-transform">
                  <Image className="w-5 h-5 mr-4" src="https://firebasestorage.googleapis.com/v0/b/fir-auth-f8ffb.firebasestorage.app/o/images%2Ficons%2Fupload.svg?alt=media&token=dfda23e3-1367-4a90-b6e2-c5f2dd829831" 
                  width={50} height={50} alt="Upload Icon" />
                  Upload Match
                </button>
              </Link>
            </div>
          <ConnectionBox/>
        </div>
    )
}