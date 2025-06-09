'use client';
import { useState, useEffect } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config'; 
import { useRouter } from 'next/navigation';

export default function SignInPage(){
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState<string>('');
  const [signIn, user, loading]   = useSignInWithEmailAndPassword(auth);
  const router                   = useRouter();

  // whenever `user` becomes non-null, store email & navigate:
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    sessionStorage.setItem('email', email);
    e.preventDefault();
    setError('');
    signIn(email, password)
    .then((res) => {
      if(!res) setError('Incorrect email or password');
    })
    .catch(() => {
      setError('Incorrect email or password');
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8" style={{ backgroundImage: "url('/images/bg-signIn.png')", backgroundSize: 'cover', backgroundPosition: 'center'}}> 
      <div className="bg-[#F9F9F9] p-8 rounded-3xl shadow-lg w-full max-w-md">
        <img src="/icons/signUp.svg" alt="Sign Up Icon" className="mx-auto h-20" />
        <h2 className="text-3xl font-semibold text-center text-gray-900 mb-6">Sign In</h2>

        <form onSubmit={handleSubmit} className='py-3'>
          <div className={`mb-6 flex items-center bg-[#F0F0F0] rounded-xl ${
                  error ? 'border-red-500 border-1' : ''}`}
          >
            <img src="/icons/mail.svg" alt="Email Icon" className="w-6 h-6 mx-3 opacity-80 " />
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border-0 focus:outline-none text-black font-semibold"
              placeholder="E-mail"
              required
            />
          </div>

          <div className={`my-4 flex items-center bg-[#F0F0F0] rounded-xl ${
                  error ? 'border-red-500 border-1' : ''}`}>
            <img src="/icons/lock.svg" alt="Password Icon" className="w-6 h-6 mx-3 opacity-35"/>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border-0 focus:outline-none text-black  font-semibold"
              placeholder="Password"
              required
            />
          </div>

          {/* Error message */}
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}


          <p className="text-center text-gray-500 my-4">
            don't have an account?{' '}
            <a href="/sign-up" className="text-teal-500 font-normal hover:underline">
              Sign Up
            </a>
          </p>

          <button
            type="submit"
            className="w-full py-3 bg-[#42B6B1] text-white text-xl font-normal rounded-xl hover:bg-teal-600 cursor-pointer active:scale-[0.9]">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};


