'use client';
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavProfile from "@/components/nav/NavProfile";

export default function NavBar() {
  const path = usePathname();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-20 xl:px-50 py-2 flex items-center justify-between backdrop-blur-lg border border-[#F9F9F9]/20 rounded-b-xl pt-6">
      <div className="flex flex-row justify-center items-center">
        {path !== "/" && (
          <Link href="/">
            <button
              className="px-4 py-4 rounded-xl bg-white shadow-md 
                         hover:bg-gray-100 transition-colors duration-100 
                         hover:scale-105 active:scale-95"
            >
              <Image src="/icons/backArrow.svg" alt="Back" width={20} height={20} />
            </button>
          </Link>
        )}
        <Image
          src="/images/logoBlack.png"
          alt="Covalent Logo"
          width={170}
          height={60}
          className="cursor-pointer ml-4"
        />
      </div>

      <div className="flex items-center space-x-8 text-lg font-medium text-black">
        <NavProfile />
      </div>
    </nav>
  );
}

