
"use client";

import type React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MessageTabValue = "direct-messages" | "community-chat";

interface NavItem {
  value: MessageTabValue;
  label: string; // Short label for bottom nav
  icon: React.ElementType;
}

interface MessageBottomNavProps {
  activeTab: MessageTabValue;
  setActiveTab: (value: MessageTabValue) => void;
  navItems: NavItem[];
}

export function MessageBottomNav({ activeTab, setActiveTab, navItems }: MessageBottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
      <nav className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Button
              key={item.value}
              variant="ghost"
              className={cn(
                "flex flex-col items-center justify-center h-full w-full rounded-none px-2 py-1 text-xs",
                activeTab === item.value ? "text-primary" : "text-muted-foreground"
              )}
              onClick={() => setActiveTab(item.value)}
            >
              <IconComponent className={cn("h-5 w-5 mb-0.5", activeTab === item.value ? "text-primary" : "")} />
              {item.label}
            </Button>
          );
        })}
      </nav>
    </div>
  );
}
