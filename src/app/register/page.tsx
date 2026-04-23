'use client';
import { RegisterForm } from '@/components/register-form';
import { useUser } from '@/firebase';
import { redirect } from 'next/navigation';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function RegisterPage() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="container flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader className="text-center">
              <Skeleton className="h-8 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="container flex-grow flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
  );
}
