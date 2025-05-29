'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, updatePassword, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../firebase/config';

interface AuthContextType {
  user: FirebaseUser | null;
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
  const [loading, setLoading] = useState(true);

  async function fetchUserType(email: string): Promise<string | undefined> {
    try {
      const res = await fetch(`/api/getUser?email=${encodeURIComponent(email)}`, {
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      });
      const result = await res.json();

      sessionStorage.setItem('firstName', result.data.firstName);
      sessionStorage.setItem('lastName', result.data.lastName);
      sessionStorage.setItem('avatar', result.data.avatar);

      if (result.message === 'Player Data') {
        sessionStorage.setItem('type', 'player');
        return 'player';
      }
      if (result.message === 'Coach Data') {
        sessionStorage.setItem('type', 'coach');
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
        setLoading(false);
      } else {
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('firstName');
        sessionStorage.removeItem('lastName');
        sessionStorage.removeItem('avatar');
        sessionStorage.removeItem('type');
        setUser(null);
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
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  const logOut = async () => {
    try {
      sessionStorage.removeItem('userEmail');
      sessionStorage.removeItem('firstName');
      sessionStorage.removeItem('lastName');
      sessionStorage.removeItem('avatar');
      sessionStorage.removeItem('type');
      setUser(null);
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };


  return (
    <AuthContext.Provider value={{
        user,
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


