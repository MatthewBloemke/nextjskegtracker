'use client';
import { useAuth } from '@/app/utils/AuthContext';

export default function Home() {
  const { signOutUser } = useAuth();

  return (
    <div>
      <button onClick={signOutUser}>Sign Out</button>
      <h1>KegTracker</h1>
    </div>
  );
}
