'use client';

import { useEffect, useState } from 'react';
import {
  onSnapshot,
  DocumentReference,
  DocumentData,
  DocumentSnapshot,
} from 'firebase/firestore';

export function useDoc<T>(ref: DocumentReference<DocumentData> | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (ref) {
      setLoading(true);
      const unsubscribe = onSnapshot(
        ref,
        (snapshot: DocumentSnapshot) => {
          if (snapshot.exists()) {
            setData({ id: snapshot.id, ...snapshot.data() } as T);
          } else {
            setData(null);
          }
          setLoading(false);
        },
        (err) => {
          setError(err);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } else {
      setData(null);
      setLoading(false);
    }
  }, [ref]);

  return { data, loading, error };
}
