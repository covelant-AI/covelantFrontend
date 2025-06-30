'use client';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { Profile } from '@/util/interfaces';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../firebase/config';

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  // fetches the DB row for this email, or null if none exists
  const fetchUserType = useCallback(async (email: string) => {
    try {
      const res = await fetch(`/api/getUser?email=${encodeURIComponent(email)}`);
      if (!res.ok) return null;
      const result = await res.json();
      if (!result.data) return null;

      const { firstName, lastName, avatar } = result.data;
      let type = '';
      if (result.message === 'Player Data') type = 'player';
      else if (result.message === 'Coach Data') type = 'coach';

      // stash in session for quick UI use
      sessionStorage.setItem('email', email);
      sessionStorage.setItem('firstName', firstName);
      sessionStorage.setItem('lastName', lastName);
      sessionStorage.setItem('avatar', avatar);
      sessionStorage.setItem('type', type);

      return { firstName, lastName, avatar, type };
    } catch (err) {
      console.error('Error fetching user data:', err);
      return null;
    }
  }, []);

  // when Firebase state changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);

      if (!currentUser) {
        sessionStorage.clear();
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      // logged in
      const email = currentUser.email ?? '';
      let fetched = await fetchUserType(email);
      setUser(currentUser);

      // if no DB row yet (new signup), create one
      if (!fetched) {
        // fall back to whatever data Firebase gives us
        const displayName = currentUser.displayName || '';
        const [firstName = '', lastName = ''] = displayName.split(' ');
        const avatar = currentUser.photoURL || '/images/default-avatar.png';
        const role = 'player'; // default—adjust as you like

        try {
          const createRes = await fetch('/api/createUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, role, firstName, lastName, avatar }),
          });
          if (!createRes.ok) throw new Error(`Status ${createRes.status}`);
          const createData = await createRes.json();
          if (
            createData.message === 'Player created' ||
            createData.message === 'Coach created'
          ) {
            // now fetch again
            fetched = await fetchUserType(email);
          }
        } catch (err) {
          console.error('Error creating user row after signup:', err);
        }
      }

      if (fetched) {
        setProfile({ email, ...fetched });
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return unsub;
  }, [fetchUserType]);

  // sign in with Google
  const signIn = useCallback(async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      // onAuthStateChanged handler above will now fire and handle DB creation/fetch
    } catch (err) {
      console.error('Google sign-in failed:', err);
    }
  }, []);

  const logOut = useCallback(async () => {
    sessionStorage.clear();
    localStorage.clear();

    document.cookie.split(';').forEach((c) => { document.cookie = c
    .replace(/^ +/, '')
    .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');});

    await signOut(auth);
    setUser(null);
    setProfile(null);
    window.location.href = '/sign-in';
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, profile, signIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}

