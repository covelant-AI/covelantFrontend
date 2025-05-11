'use client';
import SignUpPage from './sign-up/page';
import { useAuth } from './context/AuthContext';

export default function Home() {
    const { user, logOut } = useAuth();

  if (!user) {
    return <SignUpPage />;
  }
  return (
    <>
        <div>
          <h1 className="text-3xl font-bold text-center mt-10">Welcome to the Home Page</h1>
          <button onClick={logOut}>Sign out</button>
        <div >
        <p>
          Get started by editing&nbsp;
        </p>
        </div>
          <p className="text-center mt-5">This is a protected route. You are logged in!</p>
        </div>
    </>
  );
}
