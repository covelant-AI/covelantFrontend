'use client';
import SignUpPage from './sign-up/page';
import { useAuth } from './context/AuthContext';
import { useEffect, useState } from 'react';
import NavBar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'

export default function Home() {
  const { user, logOut } = useAuth();
  const [userData, setUserData] = useState<any>(null);

  const getUserData = async () => {
    try {
      const email =  user.email
      
      const response = await fetch(`/api/getUser?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
      });
      
      const data = await response.json();

      if (data.data) {
        setUserData(data); 
      } else {
        console.log('No data found for this user');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    if (user) {
      getUserData();
    }
  }, [user]);

  if (!user) {
    return <SignUpPage />;
  }

  return (
    <>
      <NavBar/>
      <HeroSection/>
      <button onClick={logOut}>Sign out</button>
    </>
  );
}
