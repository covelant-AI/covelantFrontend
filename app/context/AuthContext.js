'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, updatePassword } from 'firebase/auth';
import { auth } from '../firebase/config';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [type, setType] = useState(null);
  const [avatar, setAvatar] = useState("./images/default-avatar.png"); 
  const [firstName, setName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        sessionStorage.setItem('userEmail', user.email);
        setUser(user);
         setLoading(false)

        // Determine user type here:
        const userType = await fetchUserType(user.email);
        setType(userType);
        console.log(userType);
      } else {
        sessionStorage.removeItem('userEmail');
        setAvatar("./images/default-avatar.png");
        setUser(null);
        setType(null);
      }
    });
    return () => unsubscribe();
  }, []);

 
  async function fetchUserType(email) {
    try {
      const result = await fetch(`/api/getUser?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
      }).then((response) => response.json())
      .then((result)=> {
        if(result.message === 'Player Data'){
          setAvatar(result.data.avatar);
          setName(result.data.firstName);
          setLastName(result.data.lastName);
          return 'player';
        }
        setAvatar(result.data.avatar);
        setName(result.data.firstName);
        setLastName(result.data.lastName);
        return 'coach';
      })

      return result;
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  const signIn = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider).then(async (result) => {
      const user = result.user;
      sessionStorage.setItem('userEmail', user.email);
      setUser(user);

      const userType = await fetchUserType(user.email);
      setType(userType);
    });
  };


  const logOut = () => {
    sessionStorage.clear();
    setType(null);
    return signOut(auth);
  };

  const updateUserPassword = () => {
    const user = auth.currentUser;
    const newPassword = getASecureRandomPassword();

    const response = updatePassword(user, newPassword).then(() => {
      return "email updated Successfully"
    }).catch((error) => {
      return error
    });

    return response
  }
  return (
    <AuthContext.Provider value={{ user, type, avatar, signIn, logOut, firstName, lastName, loading, updateUserPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

