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
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      let tokenResult;
      try {
        tokenResult = await getIdTokenResult(user, true);
      } catch (claimError) {
        console.error('Error fetching custom claims:', claimError);
        showSnackbar(
          'Failed to retrieve user claims. Please contact support.',
          'error'
        );
        await auth.signOut();
        return;
      }

      const customClaims = ['admin', 'allowed', 'distributor'];
      let hasCustomClaims = customClaims.some(
        (claim) => claim in tokenResult.claims
      );

      console.log(tokenResult.claims);
      let isAllowed = tokenResult.claims.allowed === true;
      console.log(hasCustomClaims);
      if (!hasCustomClaims) {
        await fetch('/api/update-custom-claims', {
          method: 'POST',
          body: JSON.stringify({ email: user.email }),
          headers: { 'Content-Type': 'application/json' },
        });

        await user.getIdToken(true);
        const updatedTokenResult = await user.getIdTokenResult();
        hasCustomClaims = customClaims.some(
          (claim) => claim in updatedTokenResult.claims
        );
        isAllowed = updatedTokenResult.claims.allowed === true;
      }

      if (isAllowed && hasCustomClaims) {
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
