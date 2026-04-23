'use server';

import { z } from 'zod';
import { getNextId, saveUrlMapping, createUser as createUserInDb, shortCodeExists } from '@/lib/db';
import { toBase62 } from '@/lib/shortener';
import { auth } from '@/firebase/config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { revalidatePath } from 'next/cache';

export interface ShortenUrlState {
  shortUrl?: string;
  error?: string;
  longUrl?: string;
  shortCode?: string;
}

const UrlSchema = z.string().url({ message: 'Please enter a valid URL.' });
const CustomCodeSchema = z.string()
  .min(3, { message: 'Custom alias must be at least 3 characters.' })
  .max(30, { message: 'Custom alias cannot be longer than 30 characters.' })
  .regex(/^[a-zA-Z0-9_-]+$/, { message: 'Alias can only contain letters, numbers, underscores, and hyphens.' });


export async function shortenUrl(
  prevState: ShortenUrlState,
  formData: FormData
): Promise<ShortenUrlState> {
  const longUrl = formData.get('longUrl') as string;
  const userId = formData.get('userId') as string;
  const customShortCode = formData.get('customShortCode') as string;

  const validation = UrlSchema.safeParse(longUrl);

  if (!validation.success) {
    return { error: validation.error.errors[0].message };
  }

  let shortCode: string;

  try {
    if (customShortCode) {
      const codeValidation = CustomCodeSchema.safeParse(customShortCode);
      if (!codeValidation.success) {
        return { error: codeValidation.error.errors[0].message };
      }
      
      const exists = await shortCodeExists(customShortCode);
      if (exists) {
        return { error: 'That custom alias is already in use. Please choose another.' };
      }
      shortCode = customShortCode;
    } else {
      const id = await getNextId();
      shortCode = toBase62(id);
    }
    
    await saveUrlMapping(validation.data, shortCode, userId || null);

    if (userId) {
        revalidatePath('/dashboard/urls');
    }
    return {
        longUrl: validation.data,
        shortCode: shortCode
    };
  } catch (e: any) {
    console.error("Error shortening URL:", e);
    return { error: 'Failed to shorten URL. Please try again.' };
  }
}


export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error: any) {
    if (error.code === 'auth/invalid-credential') {
      return { message: 'Invalid email or password.' };
    }
    return { message: 'An unexpected error occurred. Please try again.' };
  }
}

export async function register(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    if (user) {
      await createUserInDb(user.uid, email);
    }
    return { success: true };
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      return { message: 'This email is already in use.' };
    }
     if (error.code === 'auth/weak-password') {
      return { message: 'Password should be at least 6 characters.' };
    }
    return { message: 'An unexpected error occurred. Please try again.' };
  }
}
