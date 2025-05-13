'use client';
import SignUpPage from './sign-up/page';
import { useAuth } from './context/AuthContext';
import { useEffect, useState } from 'react';

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
      <div>
        <h1 className="text-3xl font-bold text-center mt-10">Welcome to the Home Page</h1>
        <button onClick={logOut}>Sign out</button>
        <div>
          <p>User Data:</p>
        </div>
        <p className="text-center mt-5">This is a protected route. You are logged in!</p>
      </div>
    </>
  );
}
