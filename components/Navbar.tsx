'use client'
import Image from "next/image";
import Link from "next/link";
import { useAuth } from '../app/context/AuthContext';
import { useState, useRef, useEffect, MouseEvent, JSX } from "react";


export default function NavBar(): JSX.Element {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [rotated, setRotated] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { logOut } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | MouseEvent & { target: Node }) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside as unknown as EventListener);
    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside as unknown as EventListener
      );
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-20 xl:px-40 py-2 flex items-center justify-between backdrop-blur-lg border border-[#F9F9F9]/20 rounded-b-xl pt-6">
      {/* Logo */}
      <Link href="/" passHref>
        <Image
          src="/images/logoBlack.png"
          alt="Covalent Logo"
          width={170}
          height={40}
          className="cursor-pointer"
        />
      </Link>

      {/* Desktop Navigation Links */}
      <div className="flex items-center space-x-8 text-lg font-medium text-black">
        <div className="relative flex flex-row items-center space-x-4">
          <img
            className="w-12 h-12 rounded-xl object-cover"
            src="./images/test.jpg"
            alt="User Image"
          />
          <div>
            <div className="font-semibold text-xl">George Daniels</div>
            <div className="text-sm text-gray-500">Coach</div>
          </div>
          <div className="pl-4 relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu((prev) => !prev)}
              aria-label="Settings"
              type="button"
            >
              <img
                  className={`w-6 h-6 rounded-xl object-cover hover:cursor-pointer transition-transform duration-300 ${
                    rotated ? "rotate-90" : ""}`}
                  src="./icons/Settings.svg"
                  alt="Settings Icon"
                  onClick={() => setRotated((prev) => !prev)}
                />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-4 w-34 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <button
                  className="flex items-center px-4 py-1 text-red-600 hover:bg-gray-100 w-full font-semibold text-sm hover:cursor-pointer"
                  onClick={logOut}
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-7 mr-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
                    />
                  </svg>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
