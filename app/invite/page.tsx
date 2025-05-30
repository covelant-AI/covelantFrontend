'use client';
import NavBar from "@/components/nav/Navbar"
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useAuth } from '@/app/context/AuthContext';
import { User } from '@/util/interfaces'
import AthletesList from '@/components/AthletesList'
import CoachesList from '@/components/CoachesList'
import { PlayerSelector } from '@/components/UI/PlayerSelector'
import RadialBlurBg from "@/components/UI/RadialBlur";
import {profile} from "@/util/interfaces"

export default function InvitePage() {
    const [playerOne, setPlayerOne] = useState<User | null>(null)
    const {user} = useAuth();
    const [copied, setCopied] = useState(false)
    const [profile, setProfile] = useState<profile>()
    const [invited, setInvited] = useState(false)
    const inviteUrl = 'https://www.covelant.com/sign-up' 

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(inviteUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000) 
      } catch (err) {
        console.error('Copy failed', err)
        alert('Failed to copy link')
      }
    }

    const handleInvite = async () =>{
      try{
        setInvited(true)
        setTimeout(() => setInvited(false), 2000)
      }
      catch(err){
        alert('failed to invite Athlete')
      }
    }

    async function handleOnSubmit() {
        if (!playerOne) return 
        try {
          const res = await fetch('/api/addPlayer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ player: playerOne, email: profile?.email }),
          })
          if (!res.ok) throw new Error('Failed to add player')

        } catch (error) {
          console.error(error)
          alert('Error inviting player')
        }
    }
    
      useEffect(() => {
        const keys: (keyof Storage)[] = ['userEmail', 'firstName', 'lastName', 'avatar', 'type'];
        const values: (string | null)[] = keys.map((key) => sessionStorage.getItem(String(key)));
    
        if (values.every((value): value is string => value !== null)) {
          const [email, firstName, lastName, avatar, type] = values;
          setProfile({ email, firstName, lastName, avatar, type });
        }
      }, []);
  return (
    <>
    <NavBar/>
    <RadialBlurBg 
        background={'radial-gradient(50% 30% at 50% 50%,rgba(8, 113, 151, 0.1) 37%,rgba(0, 180, 174, 0.13) 38%,rgba(176, 198, 255, 0) 100%)'}
        width={"auto"} 
        height={"500"} 
        rotate={"0deg"} 
        top={'10vh'} 
        left={'5vh'}
        />
    <div className=" pt-40 min-h-screen bg-gray-100 flex flex-col items-center pt-24 space-y-10 px-4 z-10">
      {/* Title */}
      {profile?.type == "coach"? 
      <div className="text-4xl font-bold text-gray-900">Your Athletes</div> 
      : 
      <div className="text-4xl font-bold text-gray-900">Your Coaches</div>
      }

      {/* Invitation Section */}
      <div className="bg-white rounded-xl shadow-md px-6 py-5 items-center gap-6 max-w-md w-full z-10">
        {/* Left side: Invite manually */}
        <div className="flex flex-row justify-between flex-1">
            <span className="flex flex-col">
                <label className="text-gray-600 text-xl font-semibold">Invite manualy</label>
                <span className="text-sm text-gray-400">Share with Player</span>
            </span>
            <button
              onClick={handleCopy}
              className="border border-[#9ED8D5] rounded-xl px-4 text-black font-semibold hover:bg-teal-50 
                         transition flex flex-row justify-between items-center cursor-pointer"
            >
              <Image src="/images/link.png" alt="Link" width={24} height={24} className="pr-2" />
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
        </div>

        <div className="flex items-center text-gray-400 font-semibold py-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-xl font-bold">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <PlayerSelector label="Your Athlete" onSelect={setPlayerOne} />
      <div className="flex flex-row justify-center mt-6">
        <button
          disabled={!playerOne}
          onClick={() => {
            handleInvite()
            handleOnSubmit()
          }}
          className={`border rounded-xl px-4 py-2 flex flex-row items-center transition
            ${playerOne
              ? 'bg-white text-black border-[#9ED8D5] hover:bg-teal-50 cursor-pointer'
              : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'}
          `}
        >
          <svg
            className="w-6 h-6 stroke-current pr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>{invited? "Athlete Invited": "Invite" }</span>
        </button>
        </div>
      </div>
      {profile?.type == 'coach'? <AthletesList/>:<CoachesList/>}
    </div>
    </>
  )
}
