'use client';

import { useFormStatus } from 'react-dom';
import { useActionState, useEffect, useRef, useState } from 'react';
import { shortenUrl, type ShortenUrlState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Copy, Link as LinkIcon, Check } from 'lucide-react';
import { useUser } from '@/firebase';

const initialState: ShortenUrlState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto shrink-0">
      {pending ? 'Shortening...' : <>Shorten It! <ArrowRight /></>}
    </Button>
  );
}

export function UrlShortenerForm() {
  const { user } = useUser();
  const [state, formAction] = useActionState(shortenUrl, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [copied, setCopied] = useState(false);
  const [fullShortUrl, setFullShortUrl] = useState<string | null>(null);

  useEffect(() => {
    if (state.shortCode && state.longUrl) {
      const newShortUrl = `${window.location.origin}/${state.shortCode}`;
      setFullShortUrl(newShortUrl);
      formRef.current?.reset();
    }
  }, [state.shortCode, state.longUrl]);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = () => {
    if (fullShortUrl) {
      navigator.clipboard.writeText(fullShortUrl);
      setCopied(true);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden shadow-lg">
        <CardHeader>
            <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                    <LinkIcon className="w-8 h-8 text-primary" />
                </div>
                <div>
                    <CardTitle className="text-3xl font-headline">UrlHum</CardTitle>
                    <CardDescription className="mt-1">
                        Enter a long URL to make it short and sweet.
                    </CardDescription>
                </div>
            </div>
        </CardHeader>
        <form action={formAction} ref={formRef}>
          <input type="hidden" name="userId" value={user?.uid || ''} />
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center gap-2 relative">
              <Input
                type="url"
                name="longUrl"
                aria-label="URL to shorten"
                placeholder="https://example.com/very/long/url/to/shorten"
                required
                className="pl-4 text-base"
              />
              <SubmitButton />
            </div>
            {state.error && (
              <p className="mt-2 text-sm text-destructive">{state.error}</p>
            )}
          </CardContent>
        </form>
      </Card>

      {fullShortUrl && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card>
                <CardHeader>
                    <CardTitle>Your short link is ready!</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-lg bg-muted p-4">
                        <a 
                            href={fullShortUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary font-medium hover:underline truncate"
                        >
                            {fullShortUrl}
                        </a>
                        <Button variant="ghost" size="icon" onClick={handleCopy}>
                            {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                            <span className="sr-only">Copy to clipboard</span>
                        </Button>
                    </div>
                </CardContent>
                <CardFooter>
                     <p className="text-sm text-muted-foreground truncate">
                        Redirects to: {state.longUrl}
                    </p>
                </CardFooter>
            </Card>
        </div>
      )}
    </div>
  );
}
