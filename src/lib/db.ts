interface UrlMapping {
  id: number;
  longUrl: string;
  shortCode: string;
}

// In-memory store. In a real application, you would use a persistent database like Firestore, Redis, or PostgreSQL.
const urlMappings = new Map<string, UrlMapping>();
let urlCounter = 10000; // Start with a value to get multi-character short codes

export async function getNextId(): Promise<number> {
  urlCounter++;
  return urlCounter;
}

export async function saveUrlMapping(longUrl: string, shortCode: string): Promise<UrlMapping> {
  const newMapping: UrlMapping = {
    id: urlCounter,
    longUrl,
    shortCode,
  };
  urlMappings.set(shortCode, newMapping);
  return newMapping;
}

export async function findLongUrl(shortCode: string): Promise<string | null> {
  const mapping = urlMappings.get(shortCode);
  return mapping ? mapping.longUrl : null;
}

export async function shortCodeExists(shortCode: string): Promise<boolean> {
    return urlMappings.has(shortCode);
}
