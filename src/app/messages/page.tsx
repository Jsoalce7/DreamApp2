
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatWindow } from "./components/ChatWindow";
import { CommunityChat } from "./components/CommunityChat";
import { MessageCircle, Users } from "lucide-react";
import { MessageBottomNav } from "./components/MessageBottomNav"; 

type MessageTabValue = "direct-messages" | "community-chat";

const messageTabItems: { value: MessageTabValue; label: string; icon: React.ElementType }[] = [
  { value: "direct-messages", label: "Direct", icon: MessageCircle }, 
  { value: "community-chat", label: "Community", icon: Users }, 
];

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<MessageTabValue>("direct-messages");

  return (
    <div className="flex flex-col h-full"> {/* Changed to flex flex-col h-full */}
      <header className="mb-4 shrink-0"> {/* Adjusted margin bottom as content is removed */}
        {/* h1 and p tags removed as per request */}
      </header>

      {/* Desktop Tabs */}
      <div className="hidden lg:block flex-grow"> {/* Added flex-grow */}
        <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as MessageTabValue)} className="w-full h-full flex flex-col"> {/* Added h-full flex flex-col */}
          <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex mb-6 shrink-0"> {/* Added shrink-0 */}
            <TabsTrigger value="direct-messages" className="text-sm md:text-base">
              <MessageCircle className="mr-2 h-5 w-5" />
              Direct Messages
            </TabsTrigger>
            <TabsTrigger value="community-chat" className="text-sm md:text-base">
              <Users className="mr-2 h-5 w-5" />
              Community Chat
            </TabsTrigger>
          </TabsList>
          <TabsContent value="direct-messages" forceMount={true} hidden={activeTab !== "direct-messages"} className="flex-grow mt-0"> {/* Added flex-grow mt-0 */}
            <ChatWindow />
          </TabsContent>
          <TabsContent value="community-chat" forceMount={true} hidden={activeTab !== "community-chat"} className="flex-grow mt-0"> {/* Added flex-grow mt-0 */}
            <CommunityChat />
          </TabsContent>
        </Tabs>
      </div>

      {/* Mobile/Tablet Content Area */}
      <div className="lg:hidden flex-grow"> {/* Added flex-grow */}
        {activeTab === "direct-messages" && <ChatWindow />}
        {activeTab === "community-chat" && <CommunityChat />}
      </div>

      {/* Mobile/Tablet Bottom Navigation */}
      <div className="lg:hidden shrink-0"> {/* Added shrink-0 */}
        <MessageBottomNav activeTab={activeTab} setActiveTab={setActiveTab} navItems={messageTabItems} />
      </div>
    </div>
  );
}

