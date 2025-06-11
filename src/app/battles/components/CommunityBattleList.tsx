
"use client";

import { useState } from 'react';
import type { Battle, User } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Users2, CalendarDays, Info, Swords, Sparkles } from "lucide-react"; // Users2 might be aliased with another name
import { format, parseISO, isSameDay } from 'date-fns';

// Mock users for community battles
const mockCommunityUsers: User[] = [
  { id: "commUser1", name: "CommunityStar", avatarUrl: "https://placehold.co/40x40.png?text=CS", diamonds: 100 },
  { id: "commUser2", name: "CasualPlayer", avatarUrl: "https://placehold.co/40x40.png?text=CP", diamonds: 20 },
  { id: "commUser3", name: "EventOrganizer", avatarUrl: "https://placehold.co/40x40.png?text=EO", diamonds: 50 },
  { id: "commUser4", name: "NewChallenger", avatarUrl: "https://placehold.co/40x40.png?text=NC", diamonds: 5 },
];

// Mock community battle data
const mockCommunityBattles: Battle[] = [
  {
    id: "comm1",
    opponentA: mockCommunityUsers[0],
    opponentB: mockCommunityUsers[1],
    dateTime: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(), // 3 days from now
    mode: "Team Clash",
    status: "Confirmed",
  },
  {
    id: "comm2",
    opponentA: mockCommunityUsers[1],
    opponentB: mockCommunityUsers[2],
    dateTime: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(), // 7 days from now
    mode: "Fun Mode",
    status: "Confirmed",
  },
  {
    id: "comm3",
    opponentA: mockCommunityUsers[0],
    opponentB: mockCommunityUsers[2],
    dateTime: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(), // Another battle on the same day
    mode: "1v1 Duel",
    status: "Confirmed",
  },
  {
    id: "comm4",
    opponentA: mockCommunityUsers[2],
    opponentB: mockCommunityUsers[3],
    dateTime: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), // 2 days ago (past event)
    mode: "1v1 Duel",
    status: "Completed",
  },
   {
    id: "comm5",
    opponentA: mockCommunityUsers[0],
    opponentB: mockCommunityUsers[3],
    dateTime: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), // Tomorrow
    mode: "Fun Mode",
    status: "Confirmed",
  },
  {
    id: "comm6",
    opponentA: mockCommunityUsers[1],
    opponentB: mockCommunityUsers[3],
    dateTime: new Date(new Date().setMonth(new Date().getMonth() + 1, 10)).toISOString(), // Next month
    mode: "Team Clash",
    status: "Confirmed",
  }
];

const getModeIcon = (mode: Battle["mode"]) => {
  switch (mode) {
    case "1v1 Duel": return <Swords className="h-4 w-4 text-primary inline-block mr-1" />;
    case "Team Clash": return <Users2 className="h-4 w-4 text-primary inline-block mr-1" />;
    case "Fun Mode": return <Sparkles className="h-4 w-4 text-accent inline-block mr-1" />;
    default: return null;
  }
};

export function CommunityBattleList() {
  const [battles] = useState<Battle[]>(mockCommunityBattles);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const battleDays = battles.map(battle => parseISO(battle.dateTime));

  const modifiers = {
    battleDay: battleDays,
    // You can add more modifiers, e.g., for today:
    // today: new Date(), 
  };
  const modifiersClassNames = {
    battleDay: "bg-primary/20 text-primary font-medium border border-primary/50 rounded-md",
    // today: "bg-accent/20 text-accent font-bold rounded-md",
  };

  const battlesForSelectedDate = selectedDate
    ? battles.filter(battle => isSameDay(parseISO(battle.dateTime), selectedDate))
    : [];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-headline">
          <Users2 className="mr-3 h-7 w-7 text-primary" />
          Community Battle Calendar
        </CardTitle>
        <CardDescription>
          View community-scheduled battles. Click a date to see details. Days with battles are highlighted.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:gap-8">
          <div className="w-full lg:w-auto lg:max-w-md mx-auto flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              className="rounded-md border shadow-sm p-3 bg-card" 
              initialFocus
            />
          </div>

          <div className="mt-6 lg:mt-0 lg:flex-1 w-full">
            {selectedDate ? (
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center border-b pb-2">
                  <CalendarDays className="mr-2 h-5 w-5 text-muted-foreground" />
                  Battles on {format(selectedDate, "PPP")}
                </h3>
                {battlesForSelectedDate.length > 0 ? (
                  <ul className="space-y-4">
                    {battlesForSelectedDate.map(battle => (
                      <li key={battle.id} className="p-4 border rounded-lg bg-background shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center mb-1">
                          {getModeIcon(battle.mode)}
                          <p className="font-semibold text-lg">{battle.mode}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {battle.opponentA.name} vs {battle.opponentB.name}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Scheduled Time: <span className="font-medium text-foreground">{format(parseISO(battle.dateTime), "p")}</span>
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-10 px-4 border border-dashed rounded-lg bg-muted/30">
                    <Info className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                    <p className="text-lg text-muted-foreground">No community battles scheduled for this day.</p>
                    <p className="text-sm text-muted-foreground mt-1">Check other dates or propose a new battle!</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10 px-4 border border-dashed rounded-lg bg-muted/30 h-full flex flex-col justify-center items-center min-h-[200px] lg:min-h-full">
                 <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">Select a date on the calendar</p>
                <p className="text-sm text-muted-foreground mt-1">to view community battles scheduled for that day.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

