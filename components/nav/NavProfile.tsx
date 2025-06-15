"use client";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from '@/app/context/AuthContext';
import { useState, useRef, useEffect, MouseEvent } from "react";
import { useMouseLoading } from '@/hooks/useMouseLoading';


export default function NavProfile(){
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [rotated, setRotated] = useState<boolean>(false);
  const { logOut, profile} = useAuth();
  const [mouseLoading, setMouseLoading] = useState(false);
  useMouseLoading(mouseLoading); 
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(evt: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(evt.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener(
      'mousedown',
      handleClickOutside as unknown as EventListener
    );
    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside as unknown as EventListener
      );
    };
  }, []);

    
  return (
    <div className="relative flex flex-row items-center space-x-4">
      <Image
        className="w-12 h-12 rounded-xl object-cover"
        src={profile?.avatar || '/images/default-avatar.png'}
        alt="User Avatar"
        width={48}
        height={48}
      />
      <div>
        <div className="font-semibold text-xl">
          {profile?.firstName || "Edit"} {profile?.lastName || "profile here→"}
        </div>
        <div className="text-sm text-gray-500">{profile?.type || ""}</div>
      </div>
      <div className="pl-4 relative" ref={menuRef}>
        <button
          onClick={() => setShowMenu((p) => !p)}
          className="p-2 bg-white rounded-md"
          aria-label="Settings"
        >
          <Image
            className={`w-6 h-6 hover:cursor-pointer transition-transform duration-300 ${
              rotated ? 'rotate-90' : ''
            }`}
            src="https://firebasestorage.googleapis.com/v0/b/fir-auth-f8ffb.firebasestorage.app/o/images%2Ficons%2Fsettings.svg?alt=media&token=f80dd536-386e-431d-a67e-646d91ea6bae"
            alt="Settings Icon"
            width={24}
            height={24}
            onClick={() => setRotated((p) => !p)}
          />
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-4 w-34 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
            <Link href="/edit-profile">
              <button
                className="flex items-center px-2 py-1 w-full font-semibold text-sm text-rblack hover:bg-gray-200 hover:scale-[1.02] active:bg-gray-400"
                type="button"
                onClick={(e) => {
                  document.body.style.cursor = 'wait';
                  e.currentTarget.style.cursor = 'wait';
                }}
              >
                <Image
                  src="/images/default-avatar.png"
                  alt="Edit Profile Icon"
                  width={30}
                  height={30}
                  className="mx-2"
                />
                Edit Profile
              </button>
            </Link>
            <Link href="/sign-in">
            <button
              className="flex items-center px-4 py-1 w-full font-semibold text-sm text-red-600 hover:bg-red-100 hover:scale-[1.02] active:bg-red-300"
              type="button"
              onClick={logOut}
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
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}