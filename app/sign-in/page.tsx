'use client';
import { useState, useEffect } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config'; 
import { useRouter } from 'next/navigation';
import { useMouseLoading } from '@/hooks/useMouseLoading';
import {resetMouseLoading} from "@/util/services"
import Image from "next/image";
import { toast } from 'react-toastify';
import {Msg} from '@/components/UI/ToastTypes';
import * as Sentry from "@sentry/nextjs";


export default function SignInPage(){
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState<string>('');
  const [signIn, user]   = useSignInWithEmailAndPassword(auth);
  const router                   = useRouter();
  const [loading, setLoading] = useState(false);
  useMouseLoading(loading); 
  

  const handleSubmit = (e: React.FormEvent) => {
    const normalizedEmail = email.toLowerCase();
    sessionStorage.setItem('email', normalizedEmail);
    e.preventDefault();
    setError('');
    setLoading(true);
    signIn(normalizedEmail, password)
    .then((res) => {
      if(!res){
        return toast.error(Msg, {
          data: {
            title: 'Incorrect Email or Password',
            message: 'Please check your credentials and try again.',
          },
          position: 'bottom-right',
        })
      }
      toast.success("Sign in successful, ready for take off", {
        position: 'bottom-right',
      });
    })
    .catch((error) => {
      Sentry.captureException(error);
      setError('Incorrect email or password');
    }).finally(() => {
      resetMouseLoading()
      setLoading(false);
    });
  };

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8" 
    style={{ backgroundImage: "url('/images/bg-signIn.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}> 
      <div className="bg-[#F9F9F9] p-8 rounded-3xl shadow-lg w-full max-w-md">
        <div className="relative mx-auto w-20 h-20">
          <Image
            src="/icons/signUp.svg"
            alt="Sign Up Icon"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
        <h2 className="text-3xl font-semibold text-center text-gray-900 mb-6">Sign In</h2>

        <form onSubmit={handleSubmit} className='py-3'>
          <div className={`mb-6 flex items-center bg-[#F0F0F0] rounded-xl ${
                  error ? 'border-red-500 border-1' : ''}`}
          > 
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/fir-auth-f8ffb.firebasestorage.app/o/images%2Ficons%2FMail.svg?alt=media&token=25782677-5e2a-40a6-8c7f-20b67cb9c742"
              alt="Email Icon"
              width={24}
              height={24}
              className="mx-3 opacity-80"
            />
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
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/fir-auth-f8ffb.firebasestorage.app/o/images%2Ficons%2Flock.svg?alt=media&token=b9ab81a5-f4d4-4e51-8de9-ad93c30ced5c"
              alt="Password Icon"
              width={24}
              height={24}
              className="mx-3 opacity-35"
            />
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
            don&apos;t have an account?{' '}
            <a href="/sign-up" className="text-teal-500 font-normal hover:underline">
              Sign Up
            </a>
          </p>

          <button
            type="submit"
            onClick={(e) => {
              document.body.style.cursor = 'wait';
              e.currentTarget.style.cursor = 'wait';
            }}
            className="w-full py-3 bg-[#42B6B1] text-white text-xl font-normal rounded-xl hover:bg-teal-600 cursor-pointer active:scale-[0.9]">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};


