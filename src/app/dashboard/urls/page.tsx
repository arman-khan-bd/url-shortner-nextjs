'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useUser, useCollection } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Url } from '@/lib/types';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Copy, Check, Trash2 } from 'lucide-react';
import { useState, useMemo } from 'react';

export default function UrlsPage() {
    const { user } = useUser();
    const db = useFirestore();

    const urlsQuery = useMemo(() => user ? query(
        collection(db, 'urls'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
    ) : null, [db, user]);
    
    const { data: urls, loading } = useCollection<Url>(urlsQuery);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const handleCopy = (shortCode: string) => {
        const url = `${window.location.origin}/${shortCode}`;
        navigator.clipboard.writeText(url);
        setCopiedCode(shortCode);
        setTimeout(() => setCopiedCode(null), 2000);
    };


  return (
    <Card>
      <CardHeader>
        <CardTitle>My URLs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Short URL</TableHead>
              <TableHead>Long URL</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Clicks</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        Loading...
                    </TableCell>
                </TableRow>
            )}
            {!loading && urls?.length === 0 && (
                 <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        You haven&apos;t created any URLs yet.
                    </TableCell>
                </TableRow>
            )}
            {urls?.map((url) => (
              <TableRow key={url.shortCode}>
                <TableCell>
                  <a href={`/${url.shortCode}`} target="_blank" className="text-primary hover:underline">{url.shortCode}</a>
                </TableCell>
                <TableCell className="max-w-xs truncate">{url.longUrl}</TableCell>
                <TableCell>{format(new Date(url.createdAt as any), 'MMM d, yyyy')}</TableCell>
                <TableCell className="text-right">{url.clicks}</TableCell>
                <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleCopy(url.shortCode)}>
                        {copiedCode === url.shortCode ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
