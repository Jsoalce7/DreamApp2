
"use client"; // Required for usePathname

import type React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMessagesPage = pathname === '/messages';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main
        className={cn(
          "flex-grow flex flex-col", // Common classes, flex-col ensures children can use h-full
          !isMessagesPage && "container mx-auto px-4" // Conditionally apply container/padding
        )}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
