
"use client"; // Required for useState

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BattleList } from "./components/BattleList";
import { RequestBattleForm } from "./components/RequestBattleForm";
import { CommunityBattleList } from "./components/CommunityBattleList";
import { BattleRequestInbox } from "./components/BattleRequestInbox";
import { ShieldCheck, PlusCircle, Users2, Inbox } from "lucide-react";
import { BattleBottomNav } from "./components/BattleBottomNav"; // New import
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from "@/lib/utils";

type TabValue = "upcoming-battles" | "request-inbox" | "request-battle" | "community-battles";
type MobileChatView = "list" | "chat"; // "list" for thread/channel list, "chat" for active chat view


const tabItems: { value: TabValue; label: string; icon: React.ElementType; fullLabelDesktop: string; }[] = [
  { value: "upcoming-battles", label: "Upcoming", icon: ShieldCheck, fullLabelDesktop: "Upcoming Battles" },
  { value: "request-inbox", label: "Inbox", icon: Inbox, fullLabelDesktop: "Request Inbox" },
  { value: "request-battle", label: "Request", icon: PlusCircle, fullLabelDesktop: "Request a Battle" },
  { value: "community-battles", label: "Community", icon: Users2, fullLabelDesktop: "Community Battles" },
];

export default function BattlesPage() {
  const [activeTab, setActiveTab] = useState<TabValue>("upcoming-battles");
  const isMobile = useIsMobile();
  const [isMobileContentFullscreen, setIsMobileContentFullscreen] = useState(false);

  useEffect(() => {
    if (activeTab === 'community-battles' && isMobile) {
      setIsMobileContentFullscreen(true);
    } else {
      setIsMobileContentFullscreen(false);
    }
  }, [activeTab, isMobile]);


  return (
    <div className={cn(
      "flex flex-col",
      isMobileContentFullscreen ? "h-full" : "pb-16 lg:pb-0" // Full height for community calendar on mobile, padding for others
    )}>
      {/* Desktop Tabs */}
      <div className={cn(
        "hidden lg:flex flex-col flex-grow overflow-hidden",
        isMobileContentFullscreen && "lg:hidden" // Hide desktop tabs if mobile fullscreen is active (for consistency, though CommunityBattleList handles its own mobile view)
      )}>
        <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)} className="w-full flex flex-col flex-grow">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-6 shrink-0">
            {tabItems.map(item => (
              <TabsTrigger key={item.value} value={item.value} className="text-sm md:text-base">
                <item.icon className="mr-2 h-5 w-5" />
                {item.fullLabelDesktop}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="upcoming-battles" forceMount={true} hidden={activeTab !== "upcoming-battles"} className={cn(activeTab === "upcoming-battles" && "flex-grow overflow-y-auto p-1")}>
            <BattleList />
          </TabsContent>
          <TabsContent value="request-inbox" forceMount={true} hidden={activeTab !== "request-inbox"} className={cn(activeTab === "request-inbox" && "flex-grow overflow-y-auto p-1")}>
            <BattleRequestInbox />
          </TabsContent>
          <TabsContent value="request-battle" forceMount={true} hidden={activeTab !== "request-battle"} className={cn(activeTab === "request-battle" && "flex-grow overflow-y-auto p-1")}>
            <RequestBattleForm />
          </TabsContent>
          <TabsContent value="community-battles" forceMount={true} hidden={activeTab !== "community-battles"} className={cn(activeTab === "community-battles" && "flex-grow overflow-hidden")}>
            {/* CommunityBattleList will handle its own h-full and scrolling */}
            <CommunityBattleList />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Mobile/Tablet Content Area */}
      <div className={cn("lg:hidden", isMobileContentFullscreen ? "flex-grow flex flex-col overflow-hidden" : "overflow-y-auto h-full p-4 pb-20")}>
        {activeTab === "upcoming-battles" && <BattleList />}
        {activeTab === "request-inbox" && <BattleRequestInbox />}
        {activeTab === "request-battle" && <RequestBattleForm />}
        {activeTab === "community-battles" && <CommunityBattleList />}
      </div>

      {/* Mobile/Tablet Bottom Navigation */}
      <div className="lg:hidden shrink-0">
        <BattleBottomNav activeTab={activeTab} setActiveTab={setActiveTab} navItems={tabItems} />
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
