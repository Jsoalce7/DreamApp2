
"use client";

import { useState, useEffect } from "react";
import { ChatWindow } from "./components/ChatWindow";
import { CommunityChat } from "./components/CommunityChat";
import { Button } from "@/components/ui/button";
import { MessageCircle, Users } from "lucide-react";
import { MessageBottomNav } from "./components/MessageBottomNav";
import { useIsMobile } from '@/hooks/use-mobile'; // Corrected import path
import { cn } from "@/lib/utils";

type MessageTabValue = "direct-messages" | "community-chat";
type MobileChatView = "list" | "chat"; // "list" for thread/channel list, "chat" for active chat view

const messageTabItems: { value: MessageTabValue; label: string; icon: React.ElementType; fullLabel: string; }[] = [
  { value: "direct-messages", label: "Direct", icon: MessageCircle, fullLabel: "Direct Messages" },
  { value: "community-chat", label: "Community", icon: Users, fullLabel: "Community Chat" },
];

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<MessageTabValue>("direct-messages");
  // This state will track if a mobile chat view (DM or Community) is in "fullscreen" (individual chat active)
  const [isMobileChatFullscreen, setIsMobileChatFullscreen] = useState(false);
  const isMobile = useIsMobile();

  // Callback for ChatWindow and CommunityChat to inform MessagesPage if their mobile view is "chat" or "list"
  const handleMobileViewChange = (view: MobileChatView) => {
    if (isMobile) {
      setIsMobileChatFullscreen(view === 'chat');
    }
  };

  // Reset fullscreen state if switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMobileChatFullscreen(false);
    }
  }, [isMobile]);


  return (
    <div className="flex flex-col flex-grow"> {/* Root container for MessagesPage, takes available height */}
      <header className="mb-1 lg:mb-2 shrink-0">
        {/* Header content can be added here if needed, currently placeholder */}
        {/* For example, page title for desktop, hidden on mobile if using bottom nav */}
      </header>

      {/* Main content area: takes up remaining space, lays out sidebar and chat side-by-side */}
      <div className="flex-grow flex flex-row min-h-0"> {/* min-h-0 is important for flex children with overflow */}

        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col w-60 bg-card border-r p-3 space-y-1.5 shrink-0">
          {messageTabItems.map(item => {
            const IconComponent = item.icon;
            return (
              <Button
                key={item.value}
                variant={activeTab === item.value ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start text-sm h-10 px-3",
                  activeTab === item.value ? "font-semibold" : "font-normal"
                )}
                onClick={() => setActiveTab(item.value)}
              >
                <IconComponent className={cn(
                  "mr-2.5 h-5 w-5",
                  activeTab === item.value ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )} />
                {item.fullLabel}
              </Button>
            );
          })}
        </aside>

        {/* Chat Content Area (for both desktop and mobile inside this div) */}
        {/* On desktop, this div takes remaining width. On mobile, it takes full width as sidebar is hidden. */}
        {/* Removing h-full here to let it stretch, ChatWindow/CommunityChat will use h-full internally */}
        <div className="flex-grow w-full lg:w-auto">
          {/* ChatWindow and CommunityChat are designed to take h-full/w-full of their container */}
          {/* They also handle their own mobile fullscreen logic which overlays everything *except* the App Header */}
          {activeTab === "direct-messages" && <ChatWindow onMobileViewChange={handleMobileViewChange} />}
          {activeTab === "community-chat" && <CommunityChat onMobileViewChange={handleMobileViewChange} />}
        </div>

      </div> {/* End of flex-grow main content area */}

      {/* Mobile/Tablet Bottom Navigation */}
      {/* This is rendered conditionally and positioned by its own CSS (fixed bottom) */}
      {/* It should only be visible if not in a fullscreen mobile chat view */}
      {isMobile && !isMobileChatFullscreen && (
         <MessageBottomNav activeTab={activeTab} setActiveTab={setActiveTab} navItems={messageTabItems} />
      )}
    </div>
  );
}
