import { collection, doc, getDoc, setDoc, runTransaction, increment } from 'firebase/firestore';
import { db } from '@/firebase/config';

const urlsCollection = collection(db, 'urls');
const countersCollection = collection(db, 'counters');

export async function getNextId(): Promise<number> {
  const counterRef = doc(countersCollection, 'url_counter');
  
  try {
      const newId = await runTransaction(db, async (transaction) => {
          const counterDoc = await transaction.get(counterRef);
          if (!counterDoc.exists()) {
              // Initialize the counter if it doesn't exist. Start with a value to get multi-character short codes.
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

export async function saveUrlMapping(longUrl: string, shortCode: string): Promise<void> {
    const urlDoc = doc(urlsCollection, shortCode);
    await setDoc(urlDoc, {
        longUrl,
        shortCode,
        createdAt: new Date(),
        clicks: 0
    });
}

export async function findLongUrl(shortCode: string): Promise<string | null> {
    const urlDocRef = doc(urlsCollection, shortCode);
    
    try {
        let longUrl: string | null = null;
        await runTransaction(db, async (transaction) => {
            const urlDoc = await transaction.get(urlDocRef);
            if (urlDoc.exists()) {
                // Atomically increment the click count
                transaction.update(urlDocRef, { clicks: increment(1) });
                longUrl = urlDoc.data().longUrl;
            }
        });
        return longUrl;
    } catch (error) {
        console.error("Error finding long URL and incrementing clicks:", error);
        // If transaction fails, just try to get the URL without incrementing.
        // This can happen on the very first click if the document isn't fully created yet.
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
