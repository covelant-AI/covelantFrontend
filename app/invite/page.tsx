'use client';
import NavBar from "@/components/nav/Navbar"
import Image from 'next/image'
import { useState} from 'react'
import { useAuth } from '@/app/context/AuthContext';
import ListAllAthletes from '@/components/InvitePage/ListAllAthletes'
import ListAllCoaches from '@/components/InvitePage/ListAllCoaches'
import PlayerSelector from '@/components/InvitePage/PlayerSelector'
import RadialBlurBg from "@/components/UI/RadialBlur";
import {PlayerData} from "@/util/interfaces"
import {inviteUrl} from "@/util/default"
import { toast } from 'react-toastify';
import {Msg} from '@/components/UI/ToastTypes';
import * as Sentry from "@sentry/nextjs";

export default function InvitePage() {
    const [playerOne, setPlayerOne] = useState<PlayerData | null>(null)
    const [copied, setCopied] = useState(false)
    const [invited, setInvited] = useState(false)
    const {profile} = useAuth(); 

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(inviteUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000) 
      } catch (err) {
        toast.error(Msg, {
          data: {
            title: 'Failed to copy link',
            message: 'There was an error copying the invite link. Please copy it here at https://www.covelant.com/sign-up',
          },
          position: 'bottom-right',
        })
        Sentry.captureException(err);
      }
    }

    const handleInvite = async () =>{
      try{
        setInvited(true)
        setTimeout(() => setInvited(false), 2000)
      }
      catch(err){
        toast.error(Msg, {
          data: {
            title: 'Failed to Invite user',
            message: 'There was an error inviting the user. You can invite them manually here at https://www.covelant.com/sign-up',
          },
          position: 'bottom-right',
        })
        Sentry.captureException(err);
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
          
          if (!res.ok){
            toast.error(Msg, {
            data: {
              title: 'Failed to Invite user',
              message: 'There was a server error while inviting the user. You can invite them manually here at https://www.covelant.com/sign-up',
            },
            position: 'bottom-right',
          })
          }
          
          toast.success("Player added successfully!", {
          position: 'bottom-right',})

        } catch (error) {
          toast.error(Msg, {
            data: {
              title: 'Failed to Invite user',
              message: 'There was a server error while inviting the user. You can invite them manually here at https://www.covelant.com/sign-up',
            },
            position: 'bottom-right',
          })
          Sentry.captureException(error);
        }
    }
    
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
              <Image src="https://firebasestorage.googleapis.com/v0/b/fir-auth-f8ffb.firebasestorage.app/o/images%2FLink.png?alt=media&token=6468552d-40fd-4027-99b7-90846d406851" alt="Link" width={24} height={24} className="pr-2" />
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
        </div>

        <div className="flex items-center text-gray-400 font-semibold py-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-xl font-bold">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <PlayerSelector
         onSelect={(user) => {
          if (typeof user === 'function' || !user) return;
          const pd: PlayerData = {
            id: user.id,
            avatar: user.avatar ?? "",
            age: user.age ?? 0,
            dominantHand: user.dominantHand ?? "",
            email: user.email ?? "",
            firstName: user.firstName ?? "",
            lastName: user.lastName ?? "",
          };
          setPlayerOne(pd);
        }}
        />

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
        {profile?.type == 'coach'? <ListAllAthletes/>:<ListAllCoaches/>}
      </div>
    </>
  )
}
