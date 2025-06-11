
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription as BattleCardDescription } from "@/components/ui/card";
import type { Battle, User } from "@/types";
import { format, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock3, Swords, Users2, Sparkles, ListChecks, CheckCircle, AlertTriangle, Search, ListFilter } from "lucide-react";

// Mock current user - in a real app, this would come from auth context
const currentUserId = "currentUser";
const mockCurrentUser: User = { id: "currentUser", name: "MeTheChallenger", avatarUrl: "https://placehold.co/40x40.png?text=ME", diamonds: 750 };


// Mock data for open battles - in a real app, this would be fetched from Firestore
const initialMockOpenBattles: Battle[] = [
  {
    id: "open1",
    opponentA: { id: "user1", name: "ValiantVictor", avatarUrl: "https://placehold.co/40x40.png?text=VV", diamonds: 120 },
    dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    mode: "1v1 Duel",
    status: "Pending", 
    battleType: "open",
    requestedByUserId: "user1", 
  },
  {
    id: "open2",
    opponentA: { id: "user3", name: "CaptainCreative", avatarUrl: "https://placehold.co/40x40.png?text=CC", diamonds: 50 },
    dateTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    mode: "Team Clash",
    status: "Pending",
    battleType: "open",
    requestedByUserId: "user3",
  },
  {
    id: "open3",
    opponentA: { id: "user5", name: "FunkyFred", avatarUrl: "https://placehold.co/40x40.png?text=FF", diamonds: 500 },
    dateTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    mode: "Fun Mode",
    status: "Pending",
    battleType: "open",
    requestedByUserId: "user5",
  },
  {
    id: "open4",
    opponentA: { id: "user1", name: "ValiantVictor", avatarUrl: "https://placehold.co/40x40.png?text=VV", diamonds: 120 },
    dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    mode: "Team Clash",
    status: "Pending", 
    battleType: "open",
    requestedByUserId: "user1", 
  },
  {
    id: "open5",
    opponentA: { id: "user5", name: "FunkyFred", avatarUrl: "https://placehold.co/40x40.png?text=FF", diamonds: 500 },
    dateTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    mode: "1v1 Duel",
    status: "Pending",
    battleType: "open",
    requestedByUserId: "user5",
  },
];


const getModeIcon = (mode: Battle["mode"]) => {
  switch (mode) {
    case "1v1 Duel": return <Swords className="h-5 w-5 text-primary" />;
    case "Team Clash": return <Users2 className="h-5 w-5 text-primary" />;
    case "Fun Mode": return <Sparkles className="h-5 w-5 text-accent" />;
    default: return null;
  }
};

export function OpenBattlesDialog() {
  const { toast } = useToast();
  const [openBattles, setOpenBattles] = useState<Battle[]>(initialMockOpenBattles);
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedBattleForConfirmation, setSelectedBattleForConfirmation] = useState<Battle | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState<string>("all");


  const handleAcceptButtonClick = (battle: Battle) => {
    setSelectedBattleForConfirmation(battle);
    setIsConfirmDialogOpen(true);
  };

  const confirmAcceptBattle = () => {
    if (!selectedBattleForConfirmation) return;

    const battleToAccept = selectedBattleForConfirmation;

    setOpenBattles(prev => prev.filter(b => b.id !== battleToAccept.id));
    
    console.log(`Battle ${battleToAccept.id} accepted by ${mockCurrentUser.name}. Details:`, {
      ...battleToAccept,
      opponentB: mockCurrentUser,
      status: "Confirmed",
      requestedToUserId: mockCurrentUser.id, 
    });

    toast({
      title: "Battle Accepted!",
      description: `You have accepted the ${battleToAccept.mode} challenge from ${battleToAccept.opponentA.name}.`,
    });
    
    setIsConfirmDialogOpen(false); 
    setSelectedBattleForConfirmation(null); 
  };

  const filteredOpenBattles = openBattles
    .filter(battle =>
      battle.opponentA.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(battle => filterMode === "all" || battle.mode === filterMode);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <ListChecks className="mr-2 h-4 w-4" /> View Open Battles
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg md:max-w-xl lg:max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline">Open Battle Challenges</DialogTitle>
            <DialogDescription>
              Browse public battle challenges and accept one to join.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col md:flex-row gap-2 py-2 border-y my-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by challenger..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
            <Select value={filterMode} onValueChange={setFilterMode}>
              <SelectTrigger className="w-full md:w-[200px] h-9">
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

          <ScrollArea className="flex-grow pr-6 -mr-6">
            {filteredOpenBattles.length > 0 ? (
              <div className="space-y-4 py-4">
                {filteredOpenBattles.map((battle) => (
                  <Card key={battle.id} className="shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center text-xl">
                            {getModeIcon(battle.mode)}
                            <span className="ml-2">{battle.mode}</span>
                          </CardTitle>
                          <BattleCardDescription>
                            Challenger: 
                            <span className="font-medium ml-1">{battle.opponentA.name}</span>
                          </BattleCardDescription>
                        </div>
                         <Avatar className="h-10 w-10">
                            <AvatarImage src={battle.opponentA.avatarUrl} alt={battle.opponentA.name} data-ai-hint="profile avatar" />
                            <AvatarFallback>{battle.opponentA.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Clock3 className="inline-block mr-2 h-4 w-4" />
                        {format(parseISO(battle.dateTime), "PPpp 'UTC'")}
                      </div>
                    </CardContent>
                    <CardFooter>
                      {battle.opponentA.id !== currentUserId ? (
                         <Button 
                          className="w-full bg-green-500 hover:bg-green-600" 
                          onClick={() => handleAcceptButtonClick(battle)}
                        >
                          <CheckCircle className="mr-2 h-4 w-4"/> Accept Battle
                        </Button>
                      ) : (
                        <p className="text-sm text-muted-foreground w-full text-center">This is your open challenge.</p>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                <ListChecks className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-xl text-muted-foreground">No Open Battles Found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchTerm || filterMode !== "all" ? "Try adjusting your filters or " : "Check back later or "} create your own open challenge!
                </p>
              </div>
            )}
          </ScrollArea>
          <DialogFooter className="mt-4 sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedBattleForConfirmation && (
        <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center">
                <AlertTriangle className="h-6 w-6 mr-2 text-yellow-500" />
                Confirm Battle Acceptance
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to accept this {selectedBattleForConfirmation.mode} challenge from <span className="font-semibold">{selectedBattleForConfirmation.opponentA.name}</span> scheduled for <span className="font-semibold">{format(parseISO(selectedBattleForConfirmation.dateTime), "PPpp 'UTC'")}</span>?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelectedBattleForConfirmation(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmAcceptBattle}
                className="bg-green-500 hover:bg-green-600"
              >
                Confirm Accept
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
