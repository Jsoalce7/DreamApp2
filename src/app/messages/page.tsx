import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatWindow } from "./components/ChatWindow";
import { CommunityChat } from "./components/CommunityChat";
import { MessageCircle, Users } from "lucide-react";

export default function MessagesPage() {
  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h1 className="text-4xl font-headline font-bold text-primary">Messages & Community</h1>
        <p className="text-lg text-muted-foreground">
          Connect with others via direct messages or join community channels.
        </p>
      </header>

      <Tabs defaultValue="direct-messages" className="w-full">
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
        <TabsContent value="direct-messages">
          <ChatWindow />
        </TabsContent>
        <TabsContent value="community-chat">
          <CommunityChat />
        </TabsContent>
      </Tabs>
    </div>
  );
}
