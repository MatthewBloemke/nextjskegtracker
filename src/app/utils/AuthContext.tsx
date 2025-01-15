'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { auth } from '@/firebase/client'; // Adjust the path based on your setup
import {
  User,
  onAuthStateChanged,
  getIdTokenResult,
  signOut,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        const tokenResult = await getIdTokenResult(firebaseUser);
        setUser(firebaseUser);
        setIsAdmin(tokenResult.claims.admin === true);
      } else {
        setUser(null);
        setIsAdmin(false);
        router.push('/signin'); // Redirect to sign-in page if not authenticated
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Sign-out function
  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAdmin(false);
      router.push('/signin'); // Redirect to the sign-in page after logging out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error('useAuth must be used within AuthProvider');
  return context;
};
