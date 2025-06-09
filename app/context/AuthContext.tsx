'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../firebase/config';

// --- Types
export interface Profile {
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  type: string;
}

export interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  profile: Profile | null;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

// --- Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Provider
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  const fetchUserType = useCallback(async (email: string) => {
    try {
      const res = await fetch(`/api/getUser?email=${encodeURIComponent(email)}`);
      const result = await res.json();

      const { firstName, lastName, avatar } = result.data;
      sessionStorage.setItem('email', email);
      sessionStorage.setItem('firstName', firstName);
      sessionStorage.setItem('lastName', lastName);
      sessionStorage.setItem('avatar', avatar);

      let type = '';
      if (result.message === 'Player Data') {
        type = 'player';
      } else if (result.message === 'Coach Data') {
        type = 'coach';
      }
      sessionStorage.setItem('type', type);
      return { firstName, lastName, avatar, type };
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        let email = currentUser.email;
        if(!email) email = "Coach@covelant.com"  
        setUser(currentUser);

        const fetched = await fetchUserType(email);
        if (fetched) {
          setProfile({ email, ...fetched });
        }
      } else {
        sessionStorage.clear();
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [fetchUserType]);

  const signIn = useCallback(async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const currentUser = result.user;
      const email = currentUser.email ?? '';
      sessionStorage.setItem('email', email);

      const fetched = await fetchUserType(email);
      if (fetched) {
        setProfile({ email, ...fetched });
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  }, [fetchUserType]);

  const logOut = useCallback(async () => {
    try {
      sessionStorage.clear();
      setUser(null);
      setProfile(null);
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, profile, signIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// --- Hook
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

