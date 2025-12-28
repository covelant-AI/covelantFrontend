'use client';

import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { UserPen } from 'lucide-react';
import {normalizeConnectionToItems, fetchConnections} from '@/util/helpers/heroSection/ConnectionBoxHelper';
import { getLabels, ConnectionItem } from '@/util/types/heroSection/ConnectionBoxTypes';
import * as Sentry from '@sentry/nextjs';


export default function ConnectionBox() {
  const { profile } = useAuth();
  const [items, setItems] = useState<ConnectionItem[]>([]);

  const { heading, singular, plural } = useMemo(
    () => getLabels(profile?.type),
    [profile?.type]
  );

  const count = items.length;
  const preview = count <= 3 ? items : items.slice(0, 3);

  useEffect(() => {
    const email = profile?.email;
    const profileType = profile?.type;

    if (!email || !profileType) return;

    const controller = new AbortController();

    (async () => {
      try {
        const result = await fetchConnections({ email, profileType, signal: controller.signal });

        if (result.error) Sentry.captureException(result.error);

        const normalized = normalizeConnectionToItems(profileType, result);
        setItems(normalized);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        Sentry.captureException(err);
        setItems([]); // never undefined[]
      }
    })();

    return () => controller.abort();
  }, [profile?.email, profile?.type]);

  return (
    <div className="flex flex-col z-10">
      <div className="pb-2 items-start">
        <p className="font-semibold text-[#3E3E3E] text-md pl-2">{heading}</p>
      </div>

      <div className="flex items-center justify-center flex-wrap p-2 space-x-2 bg-[#F9F9F9] border border-[#E7E7E7] rounded-2xl">
        {count === 0 ? (
          <div className="flex items-center justify-between px-1 py-1 gap-6">
            <div className="p-2 rounded-xl bg-[#42B6B1] hidden sm:block">
              <Image
                className="w-7 h-7 bg-[#42B6B1] justify-center"
                src="/images/default-avatar.png"
                width={50}
                height={50}
                alt="Default avatar"
              />
            </div>

            <div>
              <div className="font-bold text-gray-900">Add a New {singular}!</div>
              <div className="font-semibold text-gray-500 text-sm">
                Add your {plural} will appear here →
              </div>
            </div>

            <Link href="/invite">
              <div
                className="active:scale-[0.9] w-10 h-10 flex items-center justify-center border-2 border-[#E7E7E7] rounded-xl bg-white hover:bg-[#42B6B1]
                cursor-pointer hover:text-white transition-colors duration-300"
              >
                <svg
                  className="w-5 h-5 stroke-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-2 mr-6 max-sm:mx-2">
              {preview.map((player) => (
                <Link key={player.id} href="/coming-soon">
                  <button className="cursor-pointer active:scale-[0.9] hover:scale-[1.05]">
                    <div className="w-12 h-12 rounded-xl overflow-hidden">
                      <div className="relative w-full h-full">
                        <Image
                          src={player.avatar || '/images/test.jpg'}
                          alt={`${player.firstName} ${player.lastName}`}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    </div>
                  </button>
                </Link>
              ))}

              <Link href="/your-connection">
                <button className="active:scale-[0.9]">
                  <div
                    className="w-13 h-13 flex justify-center items-center bg-white border cursor-pointer
                    border-[#E7E7E7] font-semibold text-black rounded-xl text-md hover:bg-[#42B6B1] hover:text-white transition-colors duration-300"
                  >
                    <UserPen />
                  </div>
                </button>
              </Link>
            </div>

            <Link href="/invite">
              <button
                className="flex items-center justify-center w-12 h-12 bg-white border border-[#E7E7E7] text-black rounded-xl
                cursor-pointer hover:bg-[#42B6B1] hover:text-white transition-colors duration-300 active:scale-[0.9]"
              >
                <svg
                  className="w-7 h-7 stroke-current"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
