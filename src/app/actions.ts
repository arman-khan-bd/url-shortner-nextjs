'use server';

import { z } from 'zod';
import { getNextId, saveUrlMapping } from '@/lib/db';
import { toBase62 } from '@/lib/shortener';

export interface ShortenUrlState {
  shortUrl?: string;
  error?: string;
  longUrl?: string;
}

const UrlSchema = z.string().url({ message: 'Please enter a valid URL.' });

export async function shortenUrl(
  prevState: ShortenUrlState,
  formData: FormData
): Promise<ShortenUrlState> {
  const longUrl = formData.get('longUrl') as string;

  const validation = UrlSchema.safeParse(longUrl);

  if (!validation.success) {
    return { error: validation.error.errors[0].message };
  }

  try {
    const id = await getNextId();
    const shortCode = toBase62(id);
    
    await saveUrlMapping(validation.data, shortCode);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 9002}`;
    
    return {
        shortUrl: `${baseUrl}/${shortCode}`,
        longUrl: validation.data
    };
  } catch (e) {
    return { error: 'Failed to shorten URL. Please try again.' };
  }
}
