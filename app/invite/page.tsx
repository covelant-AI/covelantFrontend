'use client';
import Image from 'next/image'
import { useState} from 'react'
import { useAuth } from '@/app/context/AuthContext';
import { DotBackground} from '@/components/UI/DotBackground';
import SearchUser from '@/components/UI/SearchUser'
import RadialBlurBg from "@/components/UI/RadialBlur";
import {PlayerData} from "@/util/interfaces"
import {inviteUrl} from "@/util/default"
import { toast } from 'react-toastify';
import {Msg} from '@/components/UI/ToastTypes';
import ProfileInfo from "@/components/UI/ProfileInfo"
import * as Sentry from "@sentry/nextjs";

export default function InvitePage() {
    const [selectedUser, setSelectedUser] = useState<PlayerData | null>(null)
    const [copied, setCopied] = useState(false)
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
            message: 'There was an error copying the invite link. Please copy it here at https://www.app.covelant.com/sign-up',
          },
          position: 'bottom-right',
        })
        Sentry.captureException(err);
      }
    }

    async function handleOnSubmit() {
        if (!selectedUser) return 
        try {
          const res = await fetch('/api/addPlayer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ player: selectedUser, email: profile?.email }),
          })
          
          if (!res.ok){
            toast.error(Msg, {
            data: {
              title: 'Failed to Invite user',
              message: 'There was a server error while inviting the user. You can invite them manually here at https://www.app.covelant.com/sign-up',
            },
            position: 'bottom-right',
          })
          }
          setSelectedUser(null)
          toast.success("Player added successfully!", {
          position: 'bottom-right',})

        } catch (error) {
          toast.error(Msg, {
            data: {
              title: 'Failed to Invite user',
              message: 'There was a server error while inviting the user. You can invite them manually here at https://www.app.covelant.com/sign-up',
            },
            position: 'bottom-right',
          })
          Sentry.captureException(error);
        }
    }
    
  return (
    <>
    <RadialBlurBg 
        background={'radial-gradient(50% 30% at 50% 40%,rgba(8, 113, 151, 0.09) 27%,rgba(0, 180, 174, 0.13) 38%,rgba(176, 198, 255, 0) 100%)'}
        width={"auto"} 
        height={"500"} 
        rotate={"0deg"} 
        top={'10vh'} 
        left={'5vh'}
        />
    <div className="pt-40 min-h-screen bg-gray-100 flex flex-col items-center pt-24 space-y-10 px-4 z-10">
      {/* Title */}
      <div className="text-4xl font-bold text-gray-900">Invite & Connect</div> 
      
      {/* Invitation Section */}
      <div className='flex flex-col md:flex-row md:space-x-2 space-y-6 justify-center max-md:items-center w-4/5 xl:w-3/4'>
      <div className='w-2/5 min-w-[400] z-10'>
        <div className="bg-white rounded-xl shadow-md px-6 py-5 items-center  max-w-md">
          {/* Left side: Invite manually */}
            <div className="flex flex-row justify-between ">
                <span className="flex flex-col">
                    <label className="text-gray-600 text-xl font-semibold">Signup Link</label>
                    <span className="text-sm text-gray-400 flex-wrap">Share with your Coaches or Players</span>
                </span>
                <button
                  onClick={handleCopy}
                  className="border border-[#9ED8D5] rounded-lg px-6 text-black font-semibold hover:bg-teal-50 
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

            <SearchUser
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
                setSelectedUser(pd);
              }}
              />
          </div>
            <div className='flex flex-row w-full space-x-4 z-11 pt-4'>
              <Image
                src="/icons/info.svg"
                alt="Information icon"
                width={8}
                height={8}
                className="object-fill h-8 w-8 w-1/6"
                />
              <h3 className='w-5/6 text-gray-400 text-sm'>
              If the player doesn’t have an account yet, use the manual invite option to generate a link you can share with them.<br/>
              If the player is already registered, just search for their name and add them directly.
              </h3>
            </div>
        </div>


          {selectedUser ? 
          <div className='relative w-4/6 bg-white rounded-xl h-full shadow-md px-6 py-5 items-center z-10'>
            <div className='relative flex flex-col bg-white border border-[1px] rounded-lg shadow-xs h-50 w-20 z-10 w-full'>
              <div className='flex flex-row justify-between'>
                <div className='flex flex-row space-x-4 p-4'>
                  <ProfileInfo avatarSrc={selectedUser?.avatar} firstName={selectedUser?.firstName} lastName={selectedUser?.lastName} />
                </div>
                <div>
                  <button onClick={() => setSelectedUser(null)} className="text-red hover:text-red-300 text-2xl cursor-pointer p-8 active:scale-[0.9]">
                    ×
                  </button>
                </div>
              </div>
              <div className="flex-row border-t border-gray-300 opacity-60 p-2"></div>
                <div className='flex flex-row justify-around'>
                  <div className='flex flex-col justify-center items-center'>
                    <h3 className='font-semibold italic text-[#68C5C1]'>AGE</h3>
                    <h3>{selectedUser?.age || "Private"}</h3>
                  </div>
                  <div className='flex flex-col justify-center items-center'>
                    <h3 className='font-semibold italic text-[#68C5C1]'>HAND STYLE</h3>
                    <h3>{selectedUser?.dominantHand || "Right-handed"}</h3>
                  </div>
                </div>
            </div>
            <div className="flex flex-row justify-center mt-6">
              <button onClick={() => {
                  handleOnSubmit()
                }}
                className='bg-[#68C5C1] text-black  px-10 py-2 rounded-lg hover:bg-teal-500 cursor-pointer text-white font-bold z-11'
              >
                  Send Request
            </button>
          </div> 
            <DotBackground BackgroundType={"opacity-50"}/>
          </div>
          : 
          <></>
          }
        </div>
      </div>
    </>
  )
}
