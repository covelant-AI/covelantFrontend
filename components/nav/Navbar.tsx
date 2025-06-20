'use client';
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import NavProfile from "@/components/nav/NavProfile";
import Link from 'next/link'


export default function NavBar() {
  const router = useRouter();
  const path = usePathname();

  return (
    <nav className="fixed top-0 left-0 w-full flex items-center justify-between backdrop-blur-lg border border-[#F9F9F9]/20 rounded-b-xl z-50 px-20 pt-6 max-sm:px-4 xl:px-50 py-2">
      <div className="flex flex-row justify-center items-center">
      {path !== "/" && (
        <button
          onClick={() => router.back()}
          className="
            px-4 py-4 rounded-xl bg-white shadow-md 
            hover:bg-gray-100 transition-colors duration-100 
            hover:scale-105 active:scale-95
          "
        >
          <Image src="https://firebasestorage.googleapis.com/v0/b/fir-auth-f8ffb.firebasestorage.app/o/images%2Ficons%2FBackArrow.svg?alt=media&token=f4695bb5-dfd2-4733-9755-32748dbc86b8" alt="Back" width={20} height={20} />
        </button>
      )}
        <Link href="/">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/fir-auth-f8ffb.firebasestorage.app/o/images%2Ficons%2Flogoblack.svg?alt=media&token=85bf4e35-fa7a-416f-9b7a-bb10cf105536"
            alt="Covalent Logo"
            width={170}
            height={60} 
            style={{ height: 'auto' }}
            className="cursor-pointer ml-4"
          />
        </Link>
      </div>

      <div className="flex items-center space-x-8 text-lg font-medium text-black">
        <NavProfile />
      </div>
    </nav>
  );
}

