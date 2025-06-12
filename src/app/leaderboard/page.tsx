
"use client"; // Required for useUserProfilePopup hook

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { User } from "@/types";
import { Gem, Trophy } from "lucide-react";
import { useUserProfilePopup } from '@/contexts/UserProfilePopupContext';

// Mock data for leaderboard users
const mockLeaderboardUsers: User[] = [
  { id: "user1", name: "DiamondKing", avatarUrl: "https://placehold.co/40x40.png?text=DK", diamonds: 1500, battleStyle: "High Stakes" },
  { id: "user2", name: "GemQueen", avatarUrl: "https://placehold.co/40x40.png?text=GQ", diamonds: 1350, battleStyle: "Strategic Plays" },
  { id: "user3", name: "SparkleLord", avatarUrl: "https://placehold.co/40x40.png?text=SL", diamonds: 1200, battleStyle: "Creative Builds" },
  { id: "user4", name: "CrystalClear", avatarUrl: "https://placehold.co/40x40.png?text=CC", diamonds: 1050, battleStyle: "Puzzle Solving" },
  { id: "user5", name: "ShineBright", avatarUrl: "https://placehold.co/40x40.png?text=SB", diamonds: 900, battleStyle: "Speedruns" },
  { id: "currentUser", name: "You", avatarUrl: "https://placehold.co/40x40.png?text=ME", diamonds: 750, battleStyle: "Comedy Roasts" },
  { id: "user6", name: "RockSolid", avatarUrl: "https://placehold.co/40x40.png?text=RS", diamonds: 600, battleStyle: "Defense Master" },
  { id: "user7", name: "GlimmerKid", avatarUrl: "https://placehold.co/40x40.png?text=GK", diamonds: 450, battleStyle: "Art Battles" },
  { id: "user8", name: "JewelMaster", avatarUrl: "https://placehold.co/40x40.png?text=JM", diamonds: 300, battleStyle: "Trivia Expert" },
  { id: "user9", name: "CoinCollector", avatarUrl: "https://placehold.co/40x40.png?text=CO", diamonds: 150, battleStyle: "Retro Gaming" },
];

export default function LeaderboardPage() {
  const { openPopup } = useUserProfilePopup();
  const sortedUsers = [...mockLeaderboardUsers].sort((a, b) => (b.diamonds || 0) - (a.diamonds || 0));

  const handleUserClick = (user: User) => {
    // The openPopup function in the context already checks for 'currentUser'
    openPopup(user);
  };

  return (
    <div className="space-y-8 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary flex items-center justify-center">
          <Trophy className="mr-3 h-8 w-8 sm:h-10 sm:w-10 text-yellow-500" />
          Leaderboard
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          See who's shining brightest with the most diamonds!
        </p>
      </header>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Top Diamond Holders</CardTitle>
          <CardDescription>Users are ranked by their total diamond count.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] text-center">Rank</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead className="text-right">Diamonds</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedUsers.map((user, index) => (
                  <TableRow key={user.id} className={user.id === "currentUser" ? "bg-primary/10" : ""}>
                    <TableCell className="font-medium text-center text-lg">
                      {index === 0 ? <Trophy className="h-6 w-6 text-yellow-400 inline-block" /> :
                       index === 1 ? <Trophy className="h-6 w-6 text-gray-400 inline-block" /> :
                       index === 2 ? <Trophy className="h-6 w-6 text-yellow-600 inline-block" /> : 
                       index + 1}
                    </TableCell>
                    <TableCell>
                      <div 
                        className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleUserClick(user)}
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleUserClick(user)}
                        role="button"
                        tabIndex={0}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="profile avatar" />
                          <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Gem className="h-4 w-4 text-blue-500" />
                        <span className="font-semibold">{(user.diamonds || 0).toLocaleString()}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
