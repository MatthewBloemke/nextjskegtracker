'use client';

import { auth, googleProvider } from '@/firebase/client';
import { signInWithPopup, getIdTokenResult } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent } from '@mui/material';
import LoonJuice from '@/../public/loonjuice.jpg';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { useSnackbar } from '../utils/SnackbarContext';

export default function SignInPage() {
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      // Sign in with Google
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Attempt to get custom claims
      let tokenResult;
      try {
        tokenResult = await getIdTokenResult(user, true); // Force token refresh
      } catch (claimError) {
        console.error('Error fetching custom claims:', claimError);
        showSnackbar(
          'Failed to retrieve user claims. Please contact support.',
          'error'
        );
        await auth.signOut();
        return;
      }

      const hasCustomClaims = Object.keys(tokenResult.claims).length > 0;
      const isAllowed = tokenResult.claims.allowed === true;

      if (!hasCustomClaims) {
        showSnackbar(
          'Your account needs approval from an admin. Please wait for access.',
          'error'
        );
        await auth.signOut();
        return;
      }

      if (isAllowed) {
        router.push('/');
      } else {
        await auth.signOut();
        showSnackbar(
          'Your account needs permission to access this site. Please contact an admin.',
          'error'
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        showSnackbar(error.message, 'error');
      } else {
        console.error(error);
        showSnackbar('An unexpected error occurred', 'error');
      }
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-[#1976D2] h-screen">
      <Card elevation={3} className="mx-3 md:mx-0">
        <CardContent sx={{ padding: 5 }}>
          <Image src={LoonJuice} alt="Loon Juice logo" />
          <div className="mt-5 flex justify-center">
            <Button
              onClick={handleGoogleSignIn}
              variant="outlined"
              color="primary"
              size="large"
            >
              <FcGoogle size={24} />
              <span className="ml-3 mt-1">Sign in with Google</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
