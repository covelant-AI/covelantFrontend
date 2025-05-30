"use client";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from '@/app/context/AuthContext';
import { useState, useRef, useEffect, MouseEvent } from "react";
import {UserData, defaultUserData} from '@/util/interfaces'
import {profile} from "@/util/interfaces"

export default function NavProfile(){
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [rotated, setRotated] = useState<boolean>(false);
  const [profile, setProfile] = useState<profile>()
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const { logOut} = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  
  const getUserData = async (): Promise<void> => {
    try {
      const email = sessionStorage.getItem('email');
      if(!email) return alert("Email is not in user")

      await fetch(`/api/getUser?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
      })
      .then((response) => response.json())
      .then((result)=> {
        if(result.error){
          console.error('Error fetching user data:', result.error);
        }
        setUserData(()=> result.data);
      })
    } catch (error) {
      alert('Error fetching user data:');
    }
  };

  useEffect(() => {
    const keys: (keyof Storage)[] = ['userEmail', 'firstName', 'lastName', 'avatar', 'type'];
    const values: (string | null)[] = keys.map((key) => sessionStorage.getItem(String(key)));

    if (values.every((value): value is string => value !== null)) {
      const [email, firstName, lastName, avatar, type] = values;
      setProfile({ email, firstName, lastName, avatar, type });
    }
    if(profile) getUserData();   
  }, []);

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
    
    return(
        <div className="relative flex flex-row items-center space-x-4">
          {!userData ? (
            <div className="w-12 h-12 flex justify-center items-center">
              <svg
                className="animate-spin h-6 w-6 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
            </div>
          ) : (
            <>
              <img
                className="w-12 h-12 rounded-xl object-cover"
                src={profile?.avatar || './images/default-avatar.png'}
                alt="User Image"
              />
              <div>
                <div className="font-semibold text-xl">
                  {profile?.firstName} {profile?.lastName}
                </div>
                <div className="text-sm text-gray-500">
                  {profile?.type}
                </div>
              </div>
              <div className="pl-4 relative" ref={menuRef}>
                <div className="pl-[12px] pt-[12px] w-12 h-12 bg-white rounded-md">
                  <button
                    onClick={() => setShowMenu((prev) => !prev)}
                    aria-label="Settings"
                    type="button"
                  >
                    <img
                      className={`w-6 h-6 rounded-xl object-cover hover:cursor-pointer transition-transform duration-300 ${
                        rotated ? "rotate-90" : ""
                      }`}
                      src="./icons/settings.svg"
                      alt="Settings Icon"
                      onClick={() => setRotated((prev) => !prev)}
                    />
                  </button>
                </div>
                {showMenu && (
                  <div className="absolute flex flex-col right-0 mt-4 w-34 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <Link href='/edit-profile'>
                    <button
                      className="flex items-center px-2 py-1 text-rblack w-full font-semibold text-sm hover:cursor-pointer 
                      hover:bg-gray-200 transition-colors duration-300 active:bg-gray-400 transition-colors duration-300"
                      type="button"
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
                    <button
                      className="flex items-center px-4 py-1 text-red-600 w-full font-semibold text-sm hover:cursor-pointer 
                      hover:bg-red-100 transition-colors duration-300  active:bg-red-400 transition-colors duration-300"
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
            </>
          )}
        </div>
    )
}