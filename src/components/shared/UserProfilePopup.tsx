
"use client";

import type { User } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Gem, MessageCircle, ShieldAlert, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserProfilePopupProps {
  user: User;
  trigger: React.ReactNode; // The element that triggers the dialog
}

export function UserProfilePopup({ user, trigger }: UserProfilePopupProps) {
  const router = useRouter();

  // In a real app, if only userId was passed, you'd fetch user details here:
  // const [userDetails, setUserDetails] = useState<User | null>(null);
  // useEffect(() => {
  //   if (user && user.id && !user.name) { 
  //     // fetchUserFromFirestore(user.id).then(setUserDetails);
  //   } else {
  //     setUserDetails(user);
  //   }
  // }, [user]);
  // if (!userDetails) return <>{trigger}</>; 

  const handleChallenge = () => {
    console.log(`Challenge user: ${user.name}`);
    router.push(`/battles?tab=request-battle&opponentId=${user.id}&opponentName=${encodeURIComponent(user.name)}`);
  };

  const handleSendMessage = () => {
    console.log(`Send message to user: ${user.name}`);
    router.push(`/messages?dmWith=${user.id}`);
  };


  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center space-y-3 pt-4">
          <Avatar className="w-24 h-24 border-4 border-primary shadow-lg">
            <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="profile avatar large" />
            <AvatarFallback className="text-3xl">{user.name?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <DialogTitle className="text-2xl font-headline">{user.name}</DialogTitle>
          {user.tiktokId && (
            <DialogDescription className="text-accent flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5 h-4 w-4"><path d="M21 8H3V6h18v2zm-2 6H5v-2h14v2zm-2 6H7v-2h10v2zM12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/></svg>
              @{user.tiktokId}
            </DialogDescription>
          )}
          {user.battleStyle && (
            <div className="text-sm text-muted-foreground flex items-center justify-center">
              <Sparkles className="mr-1.5 h-4 w-4 text-yellow-500" />
              Battle Style: {user.battleStyle}
            </div>
          )}
           {user.diamonds !== undefined && (
             <div className="text-sm text-muted-foreground flex items-center justify-center">
                <Gem className="mr-1.5 h-4 w-4 text-blue-500" />
                Diamonds: {user.diamonds.toLocaleString()}
            </div>
           )}
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2 pt-4">
          <Button onClick={handleChallenge} className="w-full sm:w-auto">
            <ShieldAlert className="mr-2 h-4 w-4" /> Challenge
          </Button>
          <Button onClick={handleSendMessage} variant="outline" className="w-full sm:w-auto">
            <MessageCircle className="mr-2 h-4 w-4" /> Send Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
