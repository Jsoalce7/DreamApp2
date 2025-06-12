import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

const navItems = [
  { href: '/battles', label: 'Battles' },
  { href: '/messages', label: 'Messages' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/profile', label: 'Profile' },
];

export function Header() {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16"> {/* Container for padding and max-width */}
        <div className="grid grid-cols-[auto_1fr_auto] items-center h-full">

          {/* Left Column (Hamburger on mobile) */}
          <div className="flex justify-start items-center">
            <div className="md:hidden"> {/* Hamburger Menu for mobile */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
                  <nav className="flex flex-col space-y-4 mt-8">
                    {navItems.map((item) => (
                      <Button key={item.href} variant="ghost" asChild className="w-full justify-start text-lg">
                        <Link href={item.href}>{item.label}</Link>
                      </Button>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
             {/* Optional: Add a placeholder div here for desktop if needed for specific visual balancing, e.g., <div className="hidden md:block w-10"></div> */}
          </div>

          {/* Center Column (Logo and Title) */}
          <div className="flex justify-center items-center">
            <Link href="/" className="flex items-center gap-2">
              <Logo />
              <span className="font-headline font-semibold text-xl text-primary">ClashSync Lite</span>
            </Link>
          </div>

          {/* Right Column (Desktop Navigation and Avatar) */}
          <div className="flex justify-end items-center gap-2">
            <nav className="hidden md:flex items-center space-x-2"> {/* Desktop navigation items */}
              {navItems.map((item) => (
                <Button key={item.href} variant="ghost" asChild>
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              ))}
            </nav>
            <Avatar> {/* User avatar */}
              <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="profile avatar" />
              <AvatarFallback>CS</AvatarFallback>
            </Avatar>
          </div>

        </div>
      </div>
    </header>
  );
}
