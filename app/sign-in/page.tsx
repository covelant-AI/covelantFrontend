'use client';
import { useState } from 'react';
import {  useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config'; 
import { useRouter } from 'next/navigation';

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await signInWithEmailAndPassword(email, password);
      sessionStorage.setItem('user', true as unknown as string);
      if(res) {
        setEmail('');
        setPassword('');
        router.push('/'); 
      }
      else{
        setError('Incorrect email or password');
      }
    } catch (error: any) { 
      setError('Something went wrong, please try again later');
    }
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

export default SignInPage;

