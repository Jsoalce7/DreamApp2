
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatWindow } from "./components/ChatWindow";
import { CommunityChat } from "./components/CommunityChat";
import { MessageCircle, Users } from "lucide-react";
import { MessageBottomNav } from "./components/MessageBottomNav"; // New import

type MessageTabValue = "direct-messages" | "community-chat";

const messageTabItems: { value: MessageTabValue; label: string; icon: React.ElementType }[] = [
  { value: "direct-messages", label: "Direct", icon: MessageCircle }, // Shortened label for bottom nav
  { value: "community-chat", label: "Community", icon: Users }, // Shortened label for bottom nav
];

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<MessageTabValue>("direct-messages");

  return (
    <div className="space-y-8 pb-20 lg:pb-0"> {/* Added padding-bottom for bottom nav space on mobile */}
      <header className="mb-8">
        <h1 className="text-4xl font-headline font-bold text-primary">Messages & Community</h1>
        <p className="text-lg text-muted-foreground">
          Connect with others via direct messages or join community channels.
        </p>
      </header>

      {/* Desktop Tabs */}
      <div className="hidden lg:block">
        <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as MessageTabValue)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex mb-6">
            <TabsTrigger value="direct-messages" className="text-sm md:text-base">
              <MessageCircle className="mr-2 h-5 w-5" />
              Direct Messages
            </TabsTrigger>
            <TabsTrigger value="community-chat" className="text-sm md:text-base">
              <Users className="mr-2 h-5 w-5" />
              Community Chat
            </TabsTrigger>
          </TabsList>
          <TabsContent value="direct-messages" forceMount={true} hidden={activeTab !== "direct-messages"}>
            <ChatWindow />
          </TabsContent>
          <TabsContent value="community-chat" forceMount={true} hidden={activeTab !== "community-chat"}>
            <CommunityChat />
          </TabsContent>
        </Tabs>
      </div>

      {/* Mobile/Tablet Content Area */}
      <div className="lg:hidden">
        {activeTab === "direct-messages" && <ChatWindow />}
        {activeTab === "community-chat" && <CommunityChat />}
      </div>

      {/* Mobile/Tablet Bottom Navigation */}
      <div className="lg:hidden">
        <MessageBottomNav activeTab={activeTab} setActiveTab={setActiveTab} navItems={messageTabItems} />
      </div>
    </div>
  );
}
