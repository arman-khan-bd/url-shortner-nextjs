'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { createUser as createUserInDb } from '@/lib/db';

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user) {
        await createUserInDb(user.uid, email);
      }
      router.push('/dashboard');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already in use.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        console.error("Registration Error:", error);
        setError('An unexpected error occurred. Please try again.');
      }
      setIsLoading(false);
    }
  };


  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create an Account</CardTitle>
        <CardDescription>Join to start shortening your links</CardDescription>
      </CardHeader>
      <form onSubmit={handleRegister}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
           {error && (
            <p className="mt-2 text-sm text-destructive text-center">{error}</p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
           <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Already have an account? <Link href="/login" className="text-primary hover:underline">Login</Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
