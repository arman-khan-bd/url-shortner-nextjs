'use client';
import { BarChart, Link as LinkIcon, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Url } from '@/lib/types';
import { useMemo } from 'react';

// Define a simple User type for the admin page context
type User = {
    id: string;
    email: string;
    role: 'user' | 'admin';
    createdAt: any;
};

export default function AdminOverviewPage() {
    const db = useFirestore();

    const urlsQuery = useMemo(() => db ? query(collection(db, 'urls')) : null, [db]);
    const { data: urls, loading: urlsLoading } = useCollection<Url>(urlsQuery);

    const usersQuery = useMemo(() => db ? query(collection(db, 'users')) : null, [db]);
    const { data: users, loading: usersLoading } = useCollection<User>(usersQuery);

    const loading = urlsLoading || usersLoading;

    const totalUrls = urls?.length ?? 0;
    const totalClicks = urls?.reduce((sum, url) => sum + url.clicks, 0) ?? 0;
    const totalUsers = users?.length ?? 0;

  return (
    <div className="space-y-6">
        <h1 className="text-2xl font-bold">Admin Overview</h1>
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
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{loading ? '...' : totalUsers}</div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
