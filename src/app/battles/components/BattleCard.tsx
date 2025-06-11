
"use client";

import type { Battle, User } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock3, CheckCircle2, XCircle, Archive, Swords, Users2, Sparkles, MailQuestion } from "lucide-react";
import { format, parseISO } from 'date-fns';

interface BattleCardProps {
  battle: Battle;
  currentUserId?: string; // Optional: to show/hide accept/decline buttons
  onStatusUpdate: (battleId: string, newStatus: Battle["status"]) => void;
}

const getStatusIcon = (status: Battle["status"]) => {
  switch (status) {
    case "Pending": return <Clock3 className="h-5 w-5 text-yellow-500" />;
    case "Confirmed": return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case "Completed": return <Archive className="h-5 w-5 text-gray-500" />;
    case "Declined": return <XCircle className="h-5 w-5 text-red-500" />;
    case "Requested": return <MailQuestion className="h-5 w-5 text-blue-500" />;
    default: return <Clock3 className="h-5 w-5 text-gray-400" />;
  }
};

const getModeIcon = (mode: Battle["mode"]) => {
  switch (mode) {
    case "1v1 Duel": return <Swords className="h-5 w-5 text-primary" />;
    case "Team Clash": return <Users2 className="h-5 w-5 text-primary" />;
    case "Fun Mode": return <Sparkles className="h-5 w-5 text-accent" />;
    default: return null;
  }
};

const UserDisplay = ({ user }: { user: User }) => (
  <div className="flex flex-col items-center space-y-1 sm:flex-row sm:space-y-0 sm:space-x-2">
    <Avatar className="h-8 w-8">
      <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="profile avatar" />
      <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
    <span className="font-medium text-center sm:text-left">{user.name}</span>
  </div>
);

export function BattleCard({ battle, currentUserId, onStatusUpdate }: BattleCardProps) {
  const canTakeAction = battle.status === "Pending" && battle.requestedToUserId === currentUserId;
  
  let formattedDateTime = "Date TBD";
  try {
    if (battle.dateTime) {
      const date = parseISO(battle.dateTime);
      formattedDateTime = format(date, "PPpp 'UTC'"); // e.g., Jun 20, 2024, 2:30:00 PM UTC
    }
  } catch (error) {
    console.error("Error parsing date:", battle.dateTime, error);
  }


  return (
    <Card className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xl font-headline">
          <span>{battle.mode}</span>
          {getModeIcon(battle.mode)}
        </CardTitle>
        <CardDescription className="flex items-center space-x-2">
          {getStatusIcon(battle.status)}
          <Badge variant={
            battle.status === "Confirmed" ? "default" :
            battle.status === "Pending" || battle.status === "Requested" ? "secondary" :
            battle.status === "Declined" ? "destructive" : "outline"
          }>
            {battle.status}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center space-y-2 text-center">
          <UserDisplay user={battle.opponentA} />
          <span className="text-muted-foreground font-bold">VS</span>
          <UserDisplay user={battle.opponentB} />
        </div>
        <div className="text-sm text-muted-foreground">
          <Clock3 className="inline-block mr-2 h-4 w-4" />
          {formattedDateTime}
        </div>
      </CardContent>
      {canTakeAction && (
        <CardFooter className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" size="sm" onClick={() => onStatusUpdate(battle.id, "Declined")}>
            <XCircle className="mr-2 h-4 w-4" /> Decline
          </Button>
          <Button size="sm" onClick={() => onStatusUpdate(battle.id, "Confirmed")} className="bg-green-500 hover:bg-green-600">
            <CheckCircle2 className="mr-2 h-4 w-4" /> Accept
          </Button>
        </CardFooter>
      )}
       {battle.status === "Requested" && battle.requestedByUserId === currentUserId && (
        <CardFooter className="pt-4">
            <p className="text-sm text-muted-foreground w-full text-center">Awaiting opponent's response.</p>
        </CardFooter>
      )}
    </Card>
  );
}
