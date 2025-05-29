'use client';
import { useState } from 'react'
import NavBar from '@/components/nav/Navbar'
import Sidebar from '@/components/Sidebar'
import ProfileSettings from '@/components/ProfileSettings'
import SecuritySettings from '@/components/SecuritySettings'
import RadialBlurBg from '@/components/UI/RadialBlur'
import AccountPreferences from '@/components/AccountPreferences'
import SubscriptionSettings from '@/components/SubscriptionSettings'
import AccessSettings from '@/components/AccessSettings'

export default function EditProfile(){
    const [activePage, setActivePage] = useState('Profile Settings')
    
    return(
        <>
        <NavBar />
        <div className="relative min-h-screen flex justify-center items-center bg-white px-4 overflow-hidden">
          <div className="flex bg-white rounded-xl shadow-lg max-w-4xl w-full min-h-[520px] z-10">
            <Sidebar activePage={activePage} setActivePage={setActivePage} />
            <main className="flex-1 p-10">
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