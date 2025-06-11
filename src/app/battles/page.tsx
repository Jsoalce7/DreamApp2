
"use client"; // Required for useState

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BattleList } from "./components/BattleList";
import { RequestBattleForm } from "./components/RequestBattleForm";
import { CommunityBattleList } from "./components/CommunityBattleList";
import { BattleRequestInbox } from "./components/BattleRequestInbox";
import { ShieldCheck, PlusCircle, Users2, Inbox } from "lucide-react";
import { BattleBottomNav } from "./components/BattleBottomNav"; // New import

type TabValue = "upcoming-battles" | "request-inbox" | "request-battle" | "community-battles";

const tabItems: { value: TabValue; label: string; icon: React.ElementType }[] = [
  { value: "upcoming-battles", label: "Upcoming", icon: ShieldCheck },
  { value: "request-inbox", label: "Inbox", icon: Inbox },
  { value: "request-battle", label: "Request", icon: PlusCircle },
  { value: "community-battles", label: "Community", icon: Users2 },
];

export default function BattlesPage() {
  const [activeTab, setActiveTab] = useState<TabValue>("upcoming-battles");

  return (
    <div className="space-y-8 pb-20 lg:pb-0"> {/* Added padding-bottom for bottom nav space on mobile */}
      <header className="mb-8">
        <h1 className="text-4xl font-headline font-bold text-primary">Battle Arena</h1>
        <p className="text-lg text-muted-foreground">
          View upcoming battles, manage your requests, and challenge other creators.
        </p>
      </header>

      {/* Desktop Tabs */}
      <div className="hidden lg:block">
        <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)} className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
            {tabItems.map(item => (
              <TabsTrigger key={item.value} value={item.value} className="text-sm md:text-base">
                <item.icon className="mr-2 h-5 w-5" />
                {/* Full label for desktop */}
                {item.value === "upcoming-battles" && "Upcoming Battles"}
                {item.value === "request-inbox" && "Request Inbox"}
                {item.value === "request-battle" && "Request a Battle"}
                {item.value === "community-battles" && "Community Battles"}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="upcoming-battles" forceMount={true} hidden={activeTab !== "upcoming-battles"}>
            <BattleList />
          </TabsContent>
          <TabsContent value="request-inbox" forceMount={true} hidden={activeTab !== "request-inbox"}>
            <BattleRequestInbox />
          </TabsContent>
          <TabsContent value="request-battle" forceMount={true} hidden={activeTab !== "request-battle"}>
            <RequestBattleForm />
          </TabsContent>
          <TabsContent value="community-battles" forceMount={true} hidden={activeTab !== "community-battles"}>
            <CommunityBattleList />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Mobile/Tablet Content Area (TabsContent equivalent) */}
      <div className="lg:hidden">
        {activeTab === "upcoming-battles" && <BattleList />}
        {activeTab === "request-inbox" && <BattleRequestInbox />}
        {activeTab === "request-battle" && <RequestBattleForm />}
        {activeTab === "community-battles" && <CommunityBattleList />}
      </div>

      {/* Mobile/Tablet Bottom Navigation */}
      <div className="lg:hidden">
        <BattleBottomNav activeTab={activeTab} setActiveTab={setActiveTab} navItems={tabItems} />
      </div>
    </div>
  );
}
