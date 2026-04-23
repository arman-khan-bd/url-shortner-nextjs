
'use client';
import { BarChart, Briefcase, Link as LinkIcon, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useUser, useCollection } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Url } from '@/lib/types';
import { format } from 'date-fns';
import { UrlShortenerForm } from '@/components/url-shortener-form';
import { useMemo } from 'react';

export default function DashboardPage() {
    const { user } = useUser();
    const db = useFirestore();

    const urlsQuery = useMemo(() => user ? query(
        collection(db, 'urls'),
        where('userId', '==', user.uid)
    ) : null, [db, user]);
    
    const { data: urls, loading } = useCollection<Url>(urlsQuery);
    
    const sortedUrls = useMemo(() => {
        if (!urls) return [];
        return [...urls].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [urls]);

    const latestUrls = sortedUrls.slice(0, 5);

    const totalUrls = urls?.length || 0;
    const totalClicks = urls?.reduce((sum, url) => sum + (url.clicks || 0), 0) || 0;

  return (
    <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Links</CardTitle>
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{loading ? '...' : totalUrls}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{loading ? '...' : totalClicks}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Plan</CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">Free</div>
                </CardContent>
            </Card>
        </div>

        <UrlShortenerForm />
        
        <Card>
            <CardHeader>
                <CardTitle>Latest URLs</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Short URL</TableHead>
                            <TableHead className="hidden sm:table-cell">Long URL</TableHead>
                            <TableHead className="hidden sm:table-cell">Created</TableHead>
                            <TableHead className="text-right">Clicks</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                         {loading && Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell colSpan={4} className="h-12 text-center">Loading...</TableCell>
                             </TableRow>
                         ))}
                        {latestUrls.map((url) => (
                            <TableRow key={url.shortCode}>
                                <TableCell>
                                    <a href={`/${url.shortCode}`} target="_blank" className="text-primary hover:underline">{url.shortCode}</a>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell max-w-xs truncate">{url.longUrl}</TableCell>
                                <TableCell className="hidden sm:table-cell">{format(new Date(url.createdAt as any), 'MMM d, yyyy')}</TableCell>
                                <TableCell className="text-right">{url.clicks}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
