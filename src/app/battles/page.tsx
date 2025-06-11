
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BattleList } from "./components/BattleList";
import { RequestBattleForm } from "./components/RequestBattleForm";
import { CommunityBattleList } from "./components/CommunityBattleList"; // New import
import { ShieldCheck, PlusCircle, Users2 } from "lucide-react"; // Added Users2

export default function BattlesPage() {
  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h1 className="text-4xl font-headline font-bold text-primary">Battle Arena</h1>
        <p className="text-lg text-muted-foreground">
          View upcoming battles, manage your requests, and challenge other creators.
        </p>
      </header>

      <Tabs defaultValue="upcoming-battles" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 md:w-auto md:inline-flex mb-6">
          <TabsTrigger value="upcoming-battles" className="text-sm md:text-base">
            <ShieldCheck className="mr-2 h-5 w-5" />
            Upcoming Battles
          </TabsTrigger>
          <TabsTrigger value="request-battle" className="text-sm md:text-base">
            <PlusCircle className="mr-2 h-5 w-5" />
            Request a Battle
          </TabsTrigger>
          <TabsTrigger value="community-battles" className="text-sm md:text-base">
            <Users2 className="mr-2 h-5 w-5" />
            Community Battles
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming-battles">
          <BattleList />
        </TabsContent>
        <TabsContent value="request-battle">
          <RequestBattleForm />
        </TabsContent>
        <TabsContent value="community-battles">
          <CommunityBattleList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
