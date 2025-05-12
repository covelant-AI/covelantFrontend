'use client';
import React, { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSubmit = async (formData: React.FormEvent) => {
    formData.preventDefault();
    
    try {
      const userCredential = await createUserWithEmailAndPassword(email, password);
      if (!userCredential) {
        throw new Error('Failed to create user.');
      }

      const response = await fetch('/api/createUser', {
        method: 'POST',
        headers: new Headers( {
          'Content-Type': 'application/json',
          Accept: 'application/json', 
      }),
        body: JSON.stringify({ email, role }),
      });

      const data = await response.json();

    if (data.message === 'Player created' || data.message === 'Coach created') {
      sessionStorage.setItem('user', 'true');
      setEmail('');
      setPassword('');
      setRole('');
      router.push('/');
    } else {
      throw new Error('Oops! Something went wrong.');
    }
    } catch (error) {
      throw new Error('Oops! Something went wrong.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center text-gray-900 mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-black font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-black font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-black font-medium mb-2">I am a:</label>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="player"
                  name="role"
                  value="player"
                  checked={role === 'player'}
                  onChange={(e) => setRole(e.target.value)}
                  className="h-5 w-5 text-blue-500 border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="player" className="ml-2 text-black">Player</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="coach"
                  name="role"
                  value="coach"
                  checked={role === 'coach'}
                  onChange={(e) => setRole(e.target.value)}
                  className="h-5 w-5 text-blue-500 border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="coach" className="ml-2 text-black">Coach</label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-gray-500 mt-4">
          Already have an account?{' '}
          <a href="/sign-in" className="text-blue-500 hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
