import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-card border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 md:px-8 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          AB Stock
        </Link>
        <Button variant="outline" asChild>
          <a href="https://abinterior.vercel.app/" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            View Bills
          </a>
        </Button>
      </div>
    </header>
  );
}
