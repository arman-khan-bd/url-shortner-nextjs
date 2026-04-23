import { collection, doc, getDoc, setDoc, runTransaction, increment, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/firebase/config';
import type { Url } from '@/lib/types';

const urlsCollection = collection(db, 'urls');
const countersCollection = collection(db, 'counters');
const usersCollection = collection(db, 'users');

export async function getNextId(): Promise<number> {
  const counterRef = doc(countersCollection, 'url_counter');
  
  try {
      const newId = await runTransaction(db, async (transaction) => {
          const counterDoc = await transaction.get(counterRef);
          if (!counterDoc.exists()) {
              transaction.set(counterRef, { count: 10000 });
              return 10000;
          }
          const newCount = counterDoc.data().count + 1;
          transaction.update(counterRef, { count: newCount });
          return newCount;
      });
      return newId;
  } catch (e) {
      console.error("Transaction failed to get next ID: ", e);
      throw new Error("Could not generate a new ID.");
  }
}

export async function saveUrlMapping(longUrl: string, shortCode: string, userId: string | null): Promise<void> {
    const urlDoc = doc(urlsCollection, shortCode);
    const data: Url = {
        longUrl,
        shortCode,
        createdAt: new Date(),
        clicks: 0,
        userId: userId || null
    };
    await setDoc(urlDoc, data);
}

export async function findLongUrl(shortCode: string): Promise<string | null> {
    const urlDocRef = doc(urlsCollection, shortCode);
    
    try {
        let longUrl: string | null = null;
        await runTransaction(db, async (transaction) => {
            const urlDoc = await transaction.get(urlDocRef);
            if (urlDoc.exists()) {
                transaction.update(urlDocRef, { clicks: increment(1) });
                longUrl = urlDoc.data().longUrl;
            }
        });
        return longUrl;
    } catch (error) {
        console.error("Error finding long URL and incrementing clicks:", error);
        const urlDoc = await getDoc(urlDocRef);
        if (urlDoc.exists()) {
            return urlDoc.data().longUrl;
        }
        return null;
    }
}

export async function shortCodeExists(shortCode: string): Promise<boolean> {
    const urlDoc = await getDoc(doc(urlsCollection, shortCode));
    return urlDoc.exists();
}

export async function createUser(uid: string, email: string): Promise<void> {
    const userDoc = doc(usersCollection, uid);
    await setDoc(userDoc, {
        email,
        role: 'user', // Default role
        createdAt: new Date(),
    });
}

export async function getUrlsForUser(userId: string): Promise<Url[]> {
    const q = query(urlsCollection, where("userId", "==", userId), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Url);
}

export async function getDashboardStats(userId: string) {
    const urlsQuery = query(urlsCollection, where("userId", "==", userId));
    const urlsSnapshot = await getDocs(urlsQuery);
    
    const totalUrls = urlsSnapshot.size;
    const totalClicks = urlsSnapshot.docs.reduce((sum, doc) => sum + (doc.data().clicks || 0), 0);

    // For simplicity, we get a total user count. In a real app, this should be admin-only.
    const usersSnapshot = await getDocs(collection(db, "users"));
    const totalUsers = usersSnapshot.size;

    const recentUrlsQuery = query(urlsCollection, where("userId", "==", userId), orderBy("createdAt", "desc"), limit(5));
    const recentUrlsSnapshot = await getDocs(recentUrlsQuery);
    const latestUrls = recentUrlsSnapshot.docs.map(doc => doc.data() as Url);

    return {
        totalUrls,
        totalClicks,
        totalUsers,
        latestUrls
    };
}
