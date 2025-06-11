
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, MessageSquare, ShieldCheck, Users, Trophy } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="text-center py-12 bg-gradient-to-r from-primary to-accent rounded-lg shadow-xl">
        <h1 className="text-5xl font-headline font-bold text-primary-foreground mb-4">
          Welcome to ClashSync Lite!
        </h1>
        <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
          Schedule epic livestream battles, chat with fellow creators, and conquer the leaderboard.
        </p>
        <div className="space-x-4">
          <Button size="lg" asChild className="bg-background text-foreground hover:bg-background/90 transition-transform hover:scale-105">
            <Link href="/battles">
              Explore Battles <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 transition-transform hover:scale-105">
            <Link href="/leaderboard">
              View Leaderboard <Trophy className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-headline">
              <ShieldCheck className="mr-3 h-8 w-8 text-primary" />
              Schedule Battles
            </CardTitle>
            <CardDescription>
              Easily set up and manage your upcoming livestream battles with other creators.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Define battle modes, dates, and times. Send requests and get ready to clash!
            </p>
            <Button variant="link" asChild className="text-primary p-0">
              <Link href="/battles">
                Go to Battle Scheduler <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-headline">
              <MessageSquare className="mr-3 h-8 w-8 text-accent" />
              Direct Messaging
            </CardTitle>
            <CardDescription>
              Connect privately with other users for 1-on-1 conversations and battle planning.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Secure and private chats to discuss strategies or just hang out.
            </p>
            <Button variant="link" asChild className="text-accent p-0">
              <Link href="/messages">
                Start Messaging <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-headline">
              <Users className="mr-3 h-8 w-8 text-primary" />
              Community Channels
            </CardTitle>
            <CardDescription>
              Join public channels to discuss, find opponents, and stay updated.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Engage with the community in moderated channels like #general and #battle-requests.
            </p>
            <Button variant="link" asChild className="text-primary p-0">
              <Link href="/messages#community">
                Join Channels <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-headline">
              <Trophy className="mr-3 h-8 w-8 text-yellow-500" />
              Leaderboard
            </CardTitle>
            <CardDescription>
              Climb the ranks and show off your diamond collection.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Compete with other creators and see who's at the top of their game.
            </p>
            <Button variant="link" asChild className="text-yellow-500 p-0">
              <Link href="/leaderboard">
                View Leaderboard <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
