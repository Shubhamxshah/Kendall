import { Button } from '@repo/ui/components/base/button';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold gradient-text">Kendall</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-foreground/80 hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/" className="text-foreground/80 hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="/" className="text-foreground/80 hover:text-foreground transition-colors">
            How it works
          </Link>
          <Link href="/" className="text-foreground/80 hover:text-foreground transition-colors">
            Community
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="hidden sm:flex">
            {' '}
            Log In{' '}
          </Button>
          <Button> Sign up </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
