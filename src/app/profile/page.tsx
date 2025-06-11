
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit3, Mail, Phone, UserCircle2, Gem } from "lucide-react"; // Added Gem

// Minimal Textarea component for profile page, or import if available globally
const Textarea = ({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);


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
    <div className="space-y-8 max-w-3xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-headline font-bold text-primary">Your Profile</h1>
        <p className="text-lg text-muted-foreground">
          Manage your account details and view your battle stats.
        </p>
      </header>

      <Card className="shadow-xl">
        <CardHeader className="flex flex-col items-center text-center">
          <Avatar className="w-32 h-32 mb-4 border-4 border-primary shadow-lg">
            <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="profile avatar large"/>
            <AvatarFallback className="text-4xl">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-headline">{user.name}</CardTitle>
          {user.tiktokId && <CardDescription className="text-accent">@{user.tiktokId} on TikTok</CardDescription>}
          <p className="text-muted-foreground mt-2 max-w-md">{user.bio}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Display Name</Label>
              <Input id="name" defaultValue={user.name} icon={<UserCircle2 className="h-4 w-4 text-muted-foreground" />} />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue={user.email} icon={<Mail className="h-4 w-4 text-muted-foreground" />} />
            </div>
            <div>
              <Label htmlFor="tiktokId">TikTok ID</Label>
              <Input id="tiktokId" defaultValue={user.tiktokId || ""} placeholder="Your TikTok username" icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M21 8H3V6h18v2zm-2 6H5v-2h14v2zm-2 6H7v-2h10v2zM12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/></svg>} />
            </div>
             <div>
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input id="phone" type="tel" placeholder="Your phone number" icon={<Phone className="h-4 w-4 text-muted-foreground" />} />
            </div>
          </div>
          
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" defaultValue={user.bio} placeholder="Tell us about yourself..." className="min-h-[100px]" />
          </div>

          <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t">
            <div>
              <p className="text-2xl font-bold text-green-500">{user.battlesWon}</p>
              <p className="text-sm text-muted-foreground">Battles Won</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-500">{user.battlesLost}</p>
              <p className="text-sm text-muted-foreground">Battles Lost</p>
            </div>
            <div>
              <div className="flex items-center justify-center">
                <Gem className="h-6 w-6 text-blue-500 mr-1" />
                <p className="text-2xl font-bold text-blue-500">{(user.diamonds || 0).toLocaleString()}</p>
              </div>
              <p className="text-sm text-muted-foreground">Diamonds</p>
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
