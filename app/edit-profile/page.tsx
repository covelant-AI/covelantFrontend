'use client';
import { useState } from 'react'
import Sidebar from '@/components/EditPage/Sidebar'
import ProfileSettings from '@/components/EditPage/ProfileSettings'
import SecuritySettings from '@/components/EditPage/SecuritySettings'
import AccountPreferences from '@/components/EditPage/AccountPreferences'
import AccessSettings from '@/components/EditPage/AccessSettings'
import SubscriptionSettings from '@/components/EditPage/SubscriptionSettings'
import RadialBlurBg from '@/components/UI/RadialBlur'

export default function EditProfile(){
    const [activePage, setActivePage] = useState('Profile Settings')
    
    return(
        <>
        <div className="relative min-h-screen flex justify-center items-center bg-white px-4 overflow-hidden">
          <div className="flex max-md:flex-col max-md:justify-center max-md:items-center bg-white rounded-2xl shadow-lg max-w-4xl w-full min-h-[520px] z-10">
            <Sidebar activePage={activePage} setActivePage={setActivePage} />
            <main className="flex-1 p-10 max-md:w-full max-md:p-4">
              {activePage === 'Profile Settings' && <ProfileSettings />}
              {activePage === 'Security Settings' && <SecuritySettings />}
              {activePage === 'Account Preferences' && <AccountPreferences/>}
              {activePage === 'Role & Access' && <AccessSettings/>}
              {activePage === 'Subscription & Billing' && <SubscriptionSettings/>} 
            </main>
          </div>
            <RadialBlurBg 
            background={'radial-gradient(40% 40% at 50% 30%,rgba(8, 113, 151, 0.1) 61%,rgba(0, 180, 174, 0.12) 78%,rgba(176, 198, 255, 0) 100%)'}
            width={"auto"} 
            height={"auto"} 
            rotate={"-20deg"} 
            top={'35vh'} 
            left={'5vh'}
            />
        </div>
        </>
    )
}