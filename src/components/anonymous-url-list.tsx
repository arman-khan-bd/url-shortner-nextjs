'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Url } from '@/lib/types';
import { Button } from './ui/button';
import { Copy, Check } from 'lucide-react';

interface AnonymousUrl {
    shortUrl: string;
    longUrl: string;
    shortCode: string;
}

export function AnonymousUrlList() {
    const [anonymousUrls, setAnonymousUrls] = useState<AnonymousUrl[]>([]);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const db = useFirestore();

    useEffect(() => {
        const handleUrlsUpdate = () => {
            const storedUrls = JSON.parse(localStorage.getItem('anonymousUrls') || '[]');
            setAnonymousUrls(storedUrls);
        }

        window.addEventListener('anonymousUrlsUpdated', handleUrlsUpdate);
        handleUrlsUpdate(); // initial load

        return () => {
            window.removeEventListener('anonymousUrlsUpdated', handleUrlsUpdate);
        }
    }, []);

    const shortCodes = useMemo(() => anonymousUrls.map(url => url.shortCode), [anonymousUrls]);

    const urlsQuery = useMemo(() => {
        if (!db || shortCodes.length === 0) return null;
        // Firestore 'in' queries are limited to 30 elements.
        return query(collection(db, 'urls'), where('shortCode', 'in', shortCodes.slice(0, 30)));
    }, [db, shortCodes]);

    const { data: urls, loading } = useCollection<Url>(urlsQuery);

    const handleCopy = (shortCode: string) => {
        const url = `${window.location.origin}/${shortCode}`;
        navigator.clipboard.writeText(url);
        setCopiedCode(shortCode);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    // Create a map for quick lookup
    const urlDataMap = useMemo(() => {
        if (!urls) return new Map();
        return new Map(urls.map(url => [url.shortCode, url]));
    }, [urls]);


    if (anonymousUrls.length === 0) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Recent Links</CardTitle>
                <CardDescription>These links are stored in your browser. Clear your cache and they will be gone!</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Short URL</TableHead>
                            <TableHead className="hidden sm:table-cell">Long URL</TableHead>
                            <TableHead className="text-right">Clicks</TableHead>
                            <TableHead className="text-right">Copy</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {anonymousUrls.map((anonUrl) => {
                            const urlData = urlDataMap.get(anonUrl.shortCode);
                            return (
                                <TableRow key={anonUrl.shortCode}>
                                    <TableCell>
                                        <a href={anonUrl.shortUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{anonUrl.shortUrl.replace(/https?:\/\//, '')}</a>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell max-w-xs truncate">{anonUrl.longUrl}</TableCell>
                                    <TableCell className="text-right">{loading ? '...' : (urlData?.clicks ?? 0)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleCopy(anonUrl.shortCode)}>
                                            {copiedCode === anonUrl.shortCode ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
