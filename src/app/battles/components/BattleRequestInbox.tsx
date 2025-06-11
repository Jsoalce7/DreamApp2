
"use client";

import type { Battle } from "@/types";
import { BattleCard } from "./BattleCard";
import { useState, useEffect } from 'react';
import { Info, Inbox } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Standardized current user ID
const currentUserId = "currentUser"; 

// Mock data - in a real app, this would come from a dynamic source
const mockInboxBattles: Battle[] = [
  {
    id: "inbox_b1", // Example Confirmed battle, won't show in inbox
    opponentA: { id: "user1", name: "StreamerX", avatarUrl: "https://placehold.co/40x40.png?text=SX", diamonds: 120 },
    opponentB: { id: "currentUser", name: "You", avatarUrl: "https://placehold.co/40x40.png?text=ME", diamonds: 250 },
    dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    mode: "1v1 Duel",
    status: "Confirmed",
  },
  {
    id: "inbox_b2", // Pending request for currentUser
    opponentA: { id: "user3", name: "CreativeCat", avatarUrl: "https://placehold.co/40x40.png?text=CC", diamonds: 50 },
    opponentB: { id: "currentUser", name: "ArtisticAnt (You)", avatarUrl: "https://placehold.co/40x40.png?text=AA", diamonds: 300 },
    dateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    mode: "Team Clash",
    status: "Pending",
    requestedToUserId: "currentUser", 
  },
  {
    id: "inbox_b3", // Completed, won't show
    opponentA: { id: "user5", name: "SpeedRunner", avatarUrl: "https://placehold.co/40x40.png?text=SR", diamonds: 500 },
    opponentB: { id: "user6", name: "ChillVibes", avatarUrl: "https://placehold.co/40x40.png?text=CV", diamonds: 80 },
    dateTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    mode: "Fun Mode",
    status: "Completed",
  },
   {
    id: "inbox_b6", // New pending request for currentUser
    opponentA: { id: "user8", name: "StrategistSam", avatarUrl: "https://placehold.co/40x40.png?text=SS", diamonds: 600 },
    opponentB: { id: "currentUser", name: "TacticalTina (You)", avatarUrl: "https://placehold.co/40x40.png?text=TT", diamonds: 100 },
    dateTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    mode: "1v1 Duel",
    status: "Pending",
    requestedToUserId: "currentUser", 
  },
  {
    id: "inbox_b5", // Outgoing request from currentUser, won't show in *their* inbox
    opponentA: { id: "currentUser", name: "You" , avatarUrl: "https://placehold.co/40x40.png?text=ME", diamonds: 750},
    opponentB: { id: "user7", name: "ProPlayer7", avatarUrl: "https://placehold.co/40x40.png?text=P7", diamonds: 1000 },
    dateTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    mode: "1v1 Duel",
    status: "Requested", 
    requestedByUserId: "currentUser",
    requestedToUserId: "user7",
  },
];


export function BattleRequestInbox() {
  const [battles, setBattles] = useState<Battle[]>([]);
  
  useEffect(() => {
    const inboxRequests = mockInboxBattles.filter(
      (battle) => battle.status === "Pending" && battle.requestedToUserId === currentUserId
    );
    setBattles(inboxRequests);
  }, []);

  const handleStatusUpdate = (battleId: string, newStatus: Battle["status"]) => {
    setBattles(prevBattles => 
      prevBattles.map(b => b.id === battleId ? { ...b, status: newStatus } : b)
                   .filter(b => newStatus === "Declined" && b.id === battleId ? false : true) 
    );
    // TODO: Update in Firebase
    console.log(`Battle ${battleId} status updated to ${newStatus} from inbox`);
    // If accepted, it might move to "Upcoming Battles" (if current user is part of it and status is Confirmed).
    // This component doesn't need to manage that move; BattleList will pick it up if data source is shared/refreshed.
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-headline">
          <Inbox className="mr-3 h-7 w-7 text-primary" />
          Battle Request Inbox
        </CardTitle>
        <CardDescription>
          Review and respond to battle requests sent to you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {battles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {battles.map((battle) => (
              <BattleCard 
                key={battle.id} 
                battle={battle} 
                currentUserId={currentUserId} 
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Info className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">Your battle request inbox is empty.</p>
            <p className="text-sm text-muted-foreground mt-2">No pending requests at the moment.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
