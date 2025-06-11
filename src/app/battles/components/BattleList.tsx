
"use client";

import type { Battle } from "@/types";
import { BattleCard } from "./BattleCard";
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ListFilter, Search } from "lucide-react";

const mockBattles: Battle[] = [
  {
    id: "1",
    opponentA: { id: "user1", name: "StreamerX", avatarUrl: "https://placehold.co/40x40.png?text=SX", diamonds: 120 },
    opponentB: { id: "user2", name: "GamerPro", avatarUrl: "https://placehold.co/40x40.png?text=GP", diamonds: 250 },
    dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    mode: "1v1 Duel",
    status: "Confirmed",
  },
  {
    id: "2",
    opponentA: { id: "user3", name: "CreativeCat", avatarUrl: "https://placehold.co/40x40.png?text=CC", diamonds: 50 },
    opponentB: { id: "user4", name: "ArtisticAnt", avatarUrl: "https://placehold.co/40x40.png?text=AA", diamonds: 300 },
    dateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    mode: "Team Clash",
    status: "Pending",
    requestedToUserId: "user4", // Assume current user is user4 for testing accept/decline
  },
  {
    id: "3",
    opponentA: { id: "user5", name: "SpeedRunner", avatarUrl: "https://placehold.co/40x40.png?text=SR", diamonds: 500 },
    opponentB: { id: "user6", name: "ChillVibes", avatarUrl: "https://placehold.co/40x40.png?text=CV", diamonds: 80 },
    dateTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    mode: "Fun Mode",
    status: "Completed",
  },
  {
    id: "4",
    opponentA: { id: "user1", name: "StreamerX", diamonds: 120 },
    opponentB: { id: "user5", name: "SpeedRunner", diamonds: 500 },
    dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    mode: "1v1 Duel",
    status: "Declined",
  },
  {
    id: "5",
    opponentA: { id: "userCurrentUser", name: "You" , avatarUrl: "https://placehold.co/40x40.png?text=ME", diamonds: 750}, // Example for current user
    opponentB: { id: "user7", name: "ProPlayer7", avatarUrl: "https://placehold.co/40x40.png?text=P7", diamonds: 1000 },
    dateTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    mode: "1v1 Duel",
    status: "Requested",
    requestedByUserId: "userCurrentUser",
    requestedToUserId: "user7",
  },
];

// Assume current user for accept/decline logic
const currentUserId = "user4"; 

export function BattleList() {
  const [battles, setBattles] = useState<Battle[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterMode, setFilterMode] = useState<string>("all");

  useEffect(() => {
    // In a real app, fetch battles from Firebase here
    setBattles(mockBattles);
  }, []);

  const handleStatusUpdate = (battleId: string, newStatus: Battle["status"]) => {
    setBattles(prevBattles => 
      prevBattles.map(b => b.id === battleId ? { ...b, status: newStatus } : b)
    );
    // TODO: Update in Firebase
    console.log(`Battle ${battleId} status updated to ${newStatus}`);
  };

  const filteredBattles = battles
    .filter(battle => 
      (battle.opponentA.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       battle.opponentB.name.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(battle => filterStatus === "all" || battle.status === filterStatus)
    .filter(battle => filterMode === "all" || battle.mode === filterMode);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-card">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search by opponent name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full md:w-[180px]">
            <ListFilter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Confirmed">Confirmed</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Declined">Declined</SelectItem>
            <SelectItem value="Requested">Requested</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterMode} onValueChange={setFilterMode}>
          <SelectTrigger className="w-full md:w-[180px]">
            <ListFilter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modes</SelectItem>
            <SelectItem value="1v1 Duel">1v1 Duel</SelectItem>
            <SelectItem value="Team Clash">Team Clash</SelectItem>
            <SelectItem value="Fun Mode">Fun Mode</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredBattles.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBattles.map((battle) => (
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
          <p className="text-xl text-muted-foreground">No battles found matching your criteria.</p>
          <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or search term.</p>
        </div>
      )}
    </div>
  );
}
