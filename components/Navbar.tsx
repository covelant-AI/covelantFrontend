import Image from "next/image";
import Link from "next/link";

export default function NavBar() { 
  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-20  xl:px-40 py-2 flex items-center justify-between 
    backdrop-blur-lg border border-[#F9F9F9]/20 rounded-b-xl pt-6">
      {/* Logo */}
      <Link href="/">
        <Image src="/images/logoBlack.png" alt="Covalent Logo" width={170} height={40} className="cursor-pointer" />
      </Link>
      {/* Desktop Navigation Links (Hidden on Small Screens) */}
      <div className="flex items-center space-x-8 text-lg font-medium text-black">
        <div className="flex flex-row items-center space-x-4 pr-5">
          <img className="w-12 h-12 rounded-xl object-cover" src="./images/test.jpg" alt="User Image" />
          <div>
            <div className="font-semibold text-xl">George Daniels</div>
            <div className="text-sm text-gray-500">Coach</div>
          </div>
        </div>
      </div>
    </nav>
  );
}