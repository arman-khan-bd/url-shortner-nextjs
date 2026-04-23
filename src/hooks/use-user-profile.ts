'use client';
import { useUser, useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useMemo } from 'react';

interface UserProfile {
  id: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: any;
}

export function useUserProfile() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();

  const userDocRef = useMemo(() => {
    if (!user || !db) return null;
    return doc(db, 'users', user.uid);
  }, [user, db]);

  const { data: userProfile, loading: profileLoading, error } = useDoc<UserProfile>(userDocRef);
  
  const loading = userLoading || profileLoading;

  return { user, userProfile, loading, error };
}
