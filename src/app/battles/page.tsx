import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BattleList } from "./components/BattleList";
import { RequestBattleForm } from "./components/RequestBattleForm";
import { ShieldCheck, PlusCircle } from "lucide-react";

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
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex mb-6">
          <TabsTrigger value="upcoming-battles" className="text-sm md:text-base">
            <ShieldCheck className="mr-2 h-5 w-5" />
            Upcoming Battles
          </TabsTrigger>
          <TabsTrigger value="request-battle" className="text-sm md:text-base">
            <PlusCircle className="mr-2 h-5 w-5" />
            Request a Battle
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming-battles">
          <BattleList />
        </TabsContent>
        <TabsContent value="request-battle">
          <RequestBattleForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
