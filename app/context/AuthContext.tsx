'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, updatePassword, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../firebase/config';

interface Profile {
  avatar: string;
  firstName: string | null;
  lastName: string | null;
}

interface AuthContextType {
  user: FirebaseUser | null;
  type: string | null;
  avatar: string;
  firstName: string | null;
  lastName: string | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile>({
    avatar: '/images/default-avatar.png',
    firstName: null,
    lastName: null,
  });
  const [loading, setLoading] = useState(true);

  async function fetchUserType(email: string): Promise<string | undefined> {
    try {
      const res = await fetch(`/api/getUser?email=${encodeURIComponent(email)}`, {
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      });
      const result = await res.json();

      if (result.message === 'Player Data') {
        setProfile({
          avatar: result.data.avatar || '/images/default-avatar.png',
          firstName: result.data.firstName,
          lastName: result.data.lastName,
        });
        return 'player';
      }
      if (result.message === 'Coach Data') {
        setProfile({
          avatar: result.data.avatar || '/images/default-avatar.png',
          firstName: result.data.firstName,
          lastName: result.data.lastName,
        });
        return 'coach';
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        sessionStorage.setItem('userEmail', currentUser.email ?? '');
        setUser(currentUser);
        setLoading(true);
        const userType = await fetchUserType(currentUser.email ?? '');
        setType(userType ?? null);
        setLoading(false);
      } else {
        sessionStorage.removeItem('userEmail');
        setProfile({ avatar: '/images/default-avatar.png', firstName: null, lastName: null });
        setUser(null);
        setType(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const currentUser = result.user;
      sessionStorage.setItem('userEmail', currentUser.email ?? '');
      setUser(currentUser);
      const userType = await fetchUserType(currentUser.email ?? '');
      setType(userType ?? null);
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  const logOut = async () => {
    try {
      sessionStorage.removeItem('userEmail');
      setType(null);
      setUser(null);
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };


  return (
    <AuthContext.Provider value={{
        user,
        type,
        avatar: profile.avatar,
        firstName: profile.firstName,
        lastName: profile.lastName,
        loading,
        signIn,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


