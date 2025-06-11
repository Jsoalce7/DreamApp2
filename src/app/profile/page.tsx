
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit3, Mail, Phone, UserCircle2, Gem } from "lucide-react"; // Added Gem
import { Textarea } from "@/components/ui/textarea";


export default function ProfilePage() {
  // Placeholder user data
  const user = {
    name: "ClashMaster Flex",
    email: "flex@clashsync.lite",
    tiktokId: "clashmasterflex",
    avatarUrl: "https://placehold.co/128x128.png?text=CF",
    bio: "Livestream battle enthusiast. Ready to take on any challenge!",
    battlesWon: 42,
    battlesLost: 10,
    diamonds: 750, // Added diamonds
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary">Your Profile</h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          Manage your account details and view your battle stats.
        </p>
      </header>

      <Card className="shadow-xl">
        <CardHeader className="flex flex-col items-center text-center">
          <Avatar className="w-24 h-24 sm:w-32 sm:h-32 mb-4 border-4 border-primary shadow-lg">
            <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="profile avatar large"/>
            <AvatarFallback className="text-3xl sm:text-4xl">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl sm:text-3xl font-headline">{user.name}</CardTitle>
          {user.tiktokId && <CardDescription className="text-accent">@{user.tiktokId} on TikTok</CardDescription>}
          <p className="text-muted-foreground mt-2 max-w-md">{user.bio}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Display Name</Label>
              <div className="relative flex items-center">
                <UserCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <Input id="name" defaultValue={user.name} className="pl-10" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <Input id="email" type="email" defaultValue={user.email} className="pl-10" />
              </div>
            </div>
            <div>
              <Label htmlFor="tiktokId">TikTok ID</Label>
              <div className="relative flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none"><path d="M21 8H3V6h18v2zm-2 6H5v-2h14v2zm-2 6H7v-2h10v2zM12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/></svg>
                <Input id="tiktokId" defaultValue={user.tiktokId || ""} placeholder="Your TikTok username" className="pl-10" />
              </div>
            </div>
             <div>
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <div className="relative flex items-center">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <Input id="phone" type="tel" placeholder="Your phone number" className="pl-10" />
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" defaultValue={user.bio} placeholder="Tell us about yourself..." className="min-h-[100px]" />
          </div>

          <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t">
            <div>
              <p className="text-xl sm:text-2xl font-bold text-green-500">{user.battlesWon}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Battles Won</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-red-500">{user.battlesLost}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Battles Lost</p>
            </div>
            <div>
              <div className="flex items-center justify-center">
                <Gem className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 mr-1" />
                <p className="text-xl sm:text-2xl font-bold text-blue-500">{(user.diamonds || 0).toLocaleString()}</p>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Diamonds</p>
            </div>
          </div>

          <Button className="w-full bg-primary hover:bg-primary/90">
            <Edit3 className="mr-2 h-4 w-4" /> Update Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
