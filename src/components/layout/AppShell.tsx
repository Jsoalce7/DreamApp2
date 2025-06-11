import type React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4">
        {children}
      </main>
      <Footer />
    </div>
  );
}
