'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { Url } from '@/lib/types';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function AdminLinksPage() {
    const db = useFirestore();

    const urlsQuery = useMemo(() => db ? query(collection(db, 'urls'), orderBy('createdAt', 'desc')) : null, [db]);
    const { data: urls, loading } = useCollection<Url>(urlsQuery);

    const handleDelete = async (shortCode: string) => {
        if (!db) return;
        await deleteDoc(doc(db, 'urls', shortCode));
    };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage All Links</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Short URL</TableHead>
              <TableHead>Long URL</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Clicks</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                        Loading links...
                    </TableCell>
                </TableRow>
            )}
            {urls?.map((url) => (
              <TableRow key={url.shortCode}>
                <TableCell>
                  <a href={`/${url.shortCode}`} target="_blank" className="text-primary hover:underline">{url.shortCode}</a>
                </TableCell>
                <TableCell className="max-w-xs truncate">{url.longUrl}</TableCell>
                <TableCell className="max-w-[100px] truncate font-mono text-xs">{url.userId || 'Anonymous'}</TableCell>
                <TableCell>{format(new Date(url.createdAt as any), 'MMM d, yyyy')}</TableCell>
                <TableCell className="text-right">{url.clicks}</TableCell>
                <TableCell className="text-right">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this short URL.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(url.shortCode)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
