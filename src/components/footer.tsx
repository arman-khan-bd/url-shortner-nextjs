import { Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
            <LinkIcon className="h-6 w-6 text-primary" />
            <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} UrlHum. All rights reserved.
            </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary">Privacy</Link>
            <Link href="#" className="hover:text-primary">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
