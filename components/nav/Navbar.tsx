import Image from "next/image";
import Link from "next/link";
import NavProfile from "@/components/nav/NavProfile"

export default function NavBar() {

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-20 xl:px-60 py-2 flex items-center justify-between backdrop-blur-lg border border-[#F9F9F9]/20 rounded-b-xl pt-6">
      <Link href="/" passHref>
        <Image
          src="/images/logoBlack.png"
          alt="Covalent Logo"
          width={170}
          height={60}
          className="cursor-pointer"
        />
      </Link>
      <div className="flex items-center space-x-8 text-lg font-medium text-black">
        <NavProfile/>
      </div>
    </nav>
  );
}
