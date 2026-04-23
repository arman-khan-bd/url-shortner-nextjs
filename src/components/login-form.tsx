'use client';

import { useActionState, useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { login } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '@/firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Logging in...' : 'Login'}
    </Button>
  );
}

function GoogleIcon() {
    return (
        <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
            <path
            fill="currentColor"
            d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.62-4.55 1.62-3.87 0-7.02-3.15-7.02-7.02s3.15-7.02 7.02-7.02c2.2 0 3.68.86 4.5 1.62l2.85-2.85C19.3 1.05 16.35 0 12.48 0 5.88 0 .43 5.45.43 12.12s5.45 12.12 12.05 12.12c6.75 0 11.78-4.55 11.78-11.78 0-.78-.08-1.48-.2-2.16H12.48z"
            />
        </svg>
    );
}

export function LoginForm() {
  const [state, formAction] = useActionState(login, null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push('/dashboard');
    }
  }, [state, router]);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          createdAt: new Date(),
        });
      }
      router.push('/dashboard');
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      // You could set an error state here to show a message to the user
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome Back!</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          {state?.message && (
            <p className="mt-2 text-sm text-destructive text-center">{state.message}</p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <SubmitButton />
           <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                  </span>
              </div>
            </div>
            <Button variant="outline" type="button" className="w-full" onClick={handleGoogleSignIn} disabled={isGoogleLoading}>
                {isGoogleLoading ? (
                    'Signing in...'
                ) : (
                    <>
                        <GoogleIcon />
                        Sign in with Google
                    </>
                )}
            </Button>
          <p className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account? <Link href="/register" className="text-primary hover:underline">Register</Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
