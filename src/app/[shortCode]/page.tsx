import { redirect, notFound } from 'next/navigation';
import { findLongUrl } from '@/lib/db';

type Props = {
  params: { shortCode: string };
};

export default async function ShortCodePage({ params }: Props) {
  const longUrl = await findLongUrl(params.shortCode);

  if (longUrl) {
    redirect(longUrl);
  } else {
    notFound();
  }
}
