'use client';
import React, { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { useMouseLoading } from '@/hooks/useMouseLoading';
import {resetMouseLoading} from "@/util/services"
import Image from 'next/image'
import * as Sentry from "@sentry/nextjs";

export default function SignUpPage(){
  const [email, setEmail] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  useMouseLoading(loading);

  const handleSubmit = async (formData: React.FormEvent) => {
    formData.preventDefault();
    
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }
    
    if(password !== passwordConfirm){
      setErrorMessage('Your password & confirm password do not match');
      return;
    }

    if(!role){
      setErrorMessage('please select either Player or Coache');
      return;
    }

    const normalizedEmail = email.toLowerCase();

    setErrorMessage('');
    setLoading(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(normalizedEmail, password);
      if (!userCredential) {
        setLoading(false);
        resetMouseLoading()
        document.body.style.cursor = 'default';
        const button = document.querySelector('button[type="submit"]');
        if (button) (button as HTMLButtonElement).style.cursor = 'pointer';
        return setErrorMessage('Sorry this email is already in use, try another email');
      }
      const avatar = '/images/default-avatar.png'; 
      const response = await fetch('/api/createUser', {
        method: 'POST',
        headers: new Headers( {
          'Content-Type': 'application/json',
          Accept: 'application/json', 
      }),
        body: JSON.stringify({ normalizedEmail, role, firstName, lastName, avatar }),
      });

      const data = await response.json();

      if(data.message == "Player already exists") {
        setLoading(false);
        resetMouseLoading()
        document.body.style.cursor = 'default';
        const button = document.querySelector('button[type="submit"]');
        if (button) (button as HTMLButtonElement).style.cursor = 'pointer';
        return setErrorMessage('Sorry this email is already in use, try another email');
      }

    if (data.message === 'Player created' || data.message === 'Coach created') {
      sessionStorage.setItem('user', 'true');
      sessionStorage.setItem('email', normalizedEmail);
      sessionStorage.setItem('firstName', firstName);
      sessionStorage.setItem('lastName', lastName);
      sessionStorage.setItem('avatar', avatar);
      sessionStorage.setItem('type', role);
      setEmail('');
      setPassword('');
      setRole('');
      setFirstName('');
      setLastName('');
      setLoading(false);
      resetMouseLoading()
      const waitUntilProfileIsReady = async () => {
      let attempts = 0;
      while (attempts < 20) { 
        const storedEmail = sessionStorage.getItem('email');
        if (storedEmail) {
          break;
        }
        await new Promise(res => setTimeout(res, 100));
        attempts++;
      }
      router.push('/');
    };
    
    waitUntilProfileIsReady();
    } else {
      setErrorMessage('Oops! Something went wrong on our end');
      setLoading(false);
    }
    } catch (error) {
      Sentry.captureException(error);
      setErrorMessage('Looks like password is too easy to guess, try a more complex password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8" style={{ backgroundImage: "url('/images/bg-signIn.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
  <div className="bg-[#F9F9F9] p-8 rounded-3xl shadow-lg w-full max-w-md">
    <Image
      src="/icons/signUp.svg"
      alt="Sign Up Icon"
      width={80}
      height={80}
      className="mx-auto"
    />
    <h2 className="text-3xl font-semibold text-center text-gray-900 my-4">Sign Up</h2>
    {/* Error message */}
        {errorMessage && <div className="text-red-500 text-center mb-4">{errorMessage}</div>}
    <form onSubmit={handleSubmit} className='py-3'>
      <span className="flex flex-row gap-4">
        <div className="mb-6 flex items-center bg-[#F0F0F0] rounded-xl">
          <input
          type="firstName"
          id="firstName"
          name="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full p-3 border-0 focus:outline-none text-black  font-semibold"
          placeholder="first Name"
          required
        />
        </div>
        <div className="mb-6 flex items-center bg-[#F0F0F0] rounded-xl">
          <input
          type="lastName"
          id="lastName"
          name="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full p-3 border-0 focus:outline-none text-black  font-semibold"
          placeholder="last Name"
          required
        />
        </div>
      </span>
      <div className="mb-6 flex items-center bg-[#F0F0F0] rounded-xl">
        <Image
          src="/icons/mail.svg"
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
          className="w-full p-3 border-0 focus:outline-none text-black  font-semibold"
          placeholder="E-mail"
          required
        />
      </div>

      <div className="my-4 flex items-center bg-[#F0F0F0] rounded-xl">
        <Image
          src="/icons/lock.svg"
          alt="Email Icon"
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

      <div className="mb-6 flex items-center bg-[#F0F0F0] rounded-xl">
        <Image
          src="/icons/lock.svg"
          alt="Password Icon"
          width={24}
          height={24}
          className="mx-3 opacity-35"
        />
        <input
          type="password"
          id="password2"
          name="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          className="w-full p-3 border-0 focus:outline-none text-black font-semibold"
          placeholder="Confirm password"
          required
        />
      </div>

      <div className="pt-2 pb-8 ">
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <input
              type="radio"
              id="player"
              name="role"
              value="player"
              checked={role === 'player'}
              onChange={(e) => setRole(e.target.value)}
              className="h-5 w-5 text-gray-500 border-gray-300 "
            />
            <label htmlFor="player" className="ml-2 text-sm text-black font-semibold">I am a Player</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="coach"
              name="role"
              value="coach"
              checked={role === 'coach'}
              onChange={(e) => setRole(e.target.value)}
              className="h-5 w-5 text-blue-500 border-gray-300"
            />
            <label htmlFor="coach" className="ml-2 text-sm text-black font-semibold">I am a Coach</label>
          </div>
        </div>
      </div>

      <p className="text-center text-gray-500 my-4">
        Already have an account?{' '}
        <a href="/sign-in" className="text-teal-500 font-normal hover:underline">
          Log In
        </a>
      </p>

      <button
        type="submit"
          onClick={(e) => {
            document.body.style.cursor = 'wait';
            e.currentTarget.style.cursor = 'wait';
          }}
        className="w-full py-3 bg-[#42B6B1] text-white text-xl font-normal rounded-xl hover:bg-teal-600  cursor-pointer active:scale-[0.9]">
        Sign Up
      </button>
    </form>
  </div>
</div>
  );
};

