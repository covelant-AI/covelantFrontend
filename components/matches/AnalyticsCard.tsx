import Image from "next/image";
import Link from "next/link";


export default function AnalyticsCard() {
  return (
    <div className="relative w-[220px]  rounded-[22px] overflow-hidden bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)] ring-1 ring-black/5 min-w-60">
      {/* Background image (replace src) */}
      <Image
        src="/images/AIBackgound.png"
        alt=""
        fill
        className="object-covers z-0"
        priority
      />

      {/* Soft teal overlay like the mock */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/60 via-white/20 to-[#42B6B1]/70" />

      {/* Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center">
        <div className="mt-24 text-black/90 text-sm font-medium tracking-wide">
          Start Climbing ®
        </div>

        <div className="mt-auto mb-5">
        <Link href="/coming-soon"> 
          <button className="px-5 py-2 rounded-2xl bg-white text-slate-900 font-semibold shadow-[0_10px_22px_rgba(66,182,177,0.35)] ring-1 ring-white/70
          hover:bg-teal-600 hover:text-white transition-colors duration-300 cursor-pointer">
            Full Analytics
          </button>
        </Link>
        </div>
      </div>
    </div>
  );
}
