'use client';
import NavBar from '@/components/nav/Navbar';
import Link from 'next/link';
import { PlayerData } from '@/util/interfaces';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import Image from 'next/image';
import * as Sentry from "@sentry/nextjs";

export default function YourConnection() {
  const [playerData, setPlayerData] = useState<PlayerData[]>([]);
  const { profile } = useAuth();

  useEffect(() => {
    if (!profile?.type) return;

    const getUserData = async () => {
      try {
        const res = await fetch(
          `/api/getConnection?email=${encodeURIComponent(profile.email)}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              type: profile.type,
            },
          }
        );
        const result = await res.json();
        if (result.error) throw new Error(result.error);

        if (profile.type === 'coach') {
          setPlayerData(result.connection);
        } else {
          setPlayerData(result.connection[0].coaches);
        }
      } catch (err) {
        Sentry.captureException(err);
      }
    };

    getUserData();
  }, [profile?.type, profile?.email]);

  // Delete player from the connection list
  const handleRemovePlayer = async (playerId: number) => {
    try {
      const res = await fetch(`/api/deleteConnection?email=${profile?.email}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: playerId,
        }),
      });

      if (!res.ok) throw new Error("Failed to remove player");

      // Re-fetch the data to reflect the removal in the UI
      await fetchUserData();
    } catch (error) {
      console.error("Error removing player:", error);
      alert("Could not remove player. Please try again.");
    }
  };

  // Re-fetch user data after deletion
  const fetchUserData = async () => {
    if (!profile?.type) return;

    try {
      const res = await fetch(
        `/api/getConnection?email=${encodeURIComponent(profile.email)}`,
        {
          headers: { 'Content-Type': 'application/json', Accept: 'application/json', type: profile.type },
        }
      );
      const result = await res.json();
      if (profile.type === 'coach') {
        setPlayerData(result.connection);
      } else {
        setPlayerData(result.connection[0].coaches);
      }
    } catch (err) {
      Sentry.captureException(err);
      alert('Error fetching user data:');
    }
  };

  return (
    <>
      {/* Full-page light gray background */}
      <div className="bg-gray-100 min-h-screen pt-40">
        <NavBar />

        {/* Page title */}
        <h2 className="text-3xl font-bold text-center pt-8 text-gray-800">
          {profile?.type === 'coach' ? 'Your Athletes' : 'Your Coaches'}
        </h2>

        {/* Centered white card */}
        <div className="max-w-3xl mx-auto mt-6 bg-white rounded-2xl shadow-lg p-6">
          {/* “Athlete List” or “Coaches List” header */}
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            {profile?.type === 'coach' ? 'Athlete List' : 'Coaches List'}
          </h3>

          {/* Grid of avatars, up to 5 per row */}
          <div className="grid grid-cols-2 justify-center items-center sm:grid-cols-3 md:grid-cols-5 gap-y-4">
            {playerData.length === 0 ? (
              <>
                {/* Add two empty placeholders on small screens so the “no‐connections” card is centered */}
                <div className="max-md:hidden" />
                <div className="max-md:hidden" />
                <div className="flex flex-col items-center justify-center h-100 bg-white rounded-lg">
                  <Image
                    src="/images/noMatches.png"
                    alt="No connections"
                    width={500}  // Define width according to your design
                    height={300} // Define height according to your design
                    className="max-w-full max-h-full object-contain mb-4"
                  />
                  <h3 className="text-black text-xl font-bold text-center">
                    Oh no! You need some connections.
                  </h3>
                  <p className="text-gray-400 font-semibold text-center mt-2">
                    You need to invite some people before accessing this page.
                  </p>
                </div>
              </>
            ) : (
              playerData.map((athlete) => {
                return (
                  <div key={athlete.id} className="relative flex flex-col justify-center items-center">
                    {/* "X" button to remove player */}
                    <button
                      onClick={() => handleRemovePlayer(athlete.id)}
                      className="absolute -top-2 right-5 bg-radial-[at_50%_50%] from-white  to-white-900 to-[#FF4545] to-300% hover:to-200%
                      text-red-500 rounded-full p-1  hover:scale-[1.1]  active:scale-[1.05] pointer:cursor"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    {/* <Link href={`/profile/${athlete.id}`} className="flex flex-col items-center"> */}
                      <div className="rounded-lg p-1 border hover:border-[#6EB6B3] hover:bg-[#6EB6B3] active:scale-[0.98]">
                        <Image
                          src={athlete.avatar || '/images/default-avatar.png'}
                          alt={`${athlete.firstName} ${athlete.lastName}`}
                          width={80}  
                          height={80} 
                          className="object-cover rounded-md w-20 h-20 object-cover rounded-md"
                        />
                      </div>
                      <span className="mt-2 text-sm font-semibold text-gray-700 text-center">
                        {athlete.firstName} {athlete.lastName}
                      </span>
                    {/* </Link> */}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}
