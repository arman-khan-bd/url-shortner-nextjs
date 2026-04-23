'use client';

import { useEffect, useState } from 'react';
import {
  onSnapshot,
  Query,
  DocumentData,
  QuerySnapshot,
} from 'firebase/firestore';

// A type guard to check if a value is a Firestore Timestamp
function isTimestamp(value: any): value is { toDate: () => Date } {
  return value && typeof value.toDate === 'function';
}

export function useCollection<T>(query: Query<DocumentData> | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (query) {
      setLoading(true);
      const unsubscribe = onSnapshot(
        query,
        (snapshot: QuerySnapshot) => {
          const docs = snapshot.docs.map((doc) => {
            const docData = doc.data();
            // Convert Firestore Timestamps to JS Dates
            if (isTimestamp(docData.createdAt)) {
              docData.createdAt = docData.createdAt.toDate();
            }
            return {
              id: doc.id,
              ...docData,
            } as T;
          });
          setData(docs);
          setError(null);
          setLoading(false);
        },
        (err) => {
          console.error("useCollection Error:", err);
          setError(err);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } else {
      setData(null);
      setLoading(false);
    }
  }, [JSON.stringify(query)]); // Serialize query to handle object changes

  return { data, loading, error };
}
