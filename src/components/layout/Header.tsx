
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navItems = [
  { href: '/battles', label: 'Battles' },
  { href: '/messages', label: 'Messages' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/profile', label: 'Profile' },
];

export function Header() {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="font-headline font-semibold text-xl text-primary">ClashSync Lite</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-2">
          {navItems.map((item) => (
            <Button key={item.href} variant="ghost" asChild>
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
           <Avatar>
            <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="profile avatar" />
            <AvatarFallback>CS</AvatarFallback>
          </Avatar>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
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
        </div>
      </div>
    </header>
  );
}
