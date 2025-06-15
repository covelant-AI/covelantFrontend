import Image from 'next/image'
import { useAuth } from '@/app/context/AuthContext';
import { useEffect } from 'react'
import { PlayerSelectorProps } from '@/util/interfaces'
import * as Sentry from "@sentry/nextjs";
import { Player } from '@/util/interfaces'

export default function StaticPlayerDisplay({onSelect}: PlayerSelectorProps){
    const {profile} = useAuth();

    useEffect(() => {
        if (!profile?.email) return

        fetch(`/api/getUser?email=${encodeURIComponent(profile.email)}`, {
          headers: { 'Content-Type': 'application/json' },
        })
          .then((r) => r.json())
          .then((result) => {
            if (result.error) throw new Error("something went wrong, refresh the page");
            onSelect(result.data as Player)
          })
          .catch((err) => Sentry.captureException(err))
  
      }, [])

    return(
      <div className="flex-1 border border-gray-200 rounded-xl flex flex-col items-center justify-center h-45 shadow-md bg-gray-100 hover:border-cyan-400 relative">
          <div className="flex flex-col items-center gap-2 w-full">
              <div className="h-45 w-full flex items-center justify-center text-black font-bold">
                  <div className="relative w-full h-full rounded-xl overflow-hidden">
                    <Image
                      src={profile?.avatar || "/images/default-avatar.png"}
                      alt="User"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
              </div>
          </div>
      </div>
    )
}