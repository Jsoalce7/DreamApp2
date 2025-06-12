
"use client";

import { useState, useEffect, useRef } from "react";
import type { Message, User, CommunityChannel } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, ShieldAlert, ShieldCheck, Users, ArrowLeft, MessageCircle } from "lucide-react"; 
import { moderateCommunityChatMessage, type ModerateCommunityChatMessageOutput } from "@/ai/flows/community-moderator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from "@/lib/utils";

const mockCurrentUser: User = { id: "currentUser", name: "You", avatarUrl: "https://placehold.co/40x40.png?text=ME", diamonds: 750 };
const mockOtherUser: User = { id: "otherUser", name: "ModeratorBot", avatarUrl: "https://placehold.co/40x40.png?text=MB", diamonds: 0 };

const initialChannels: CommunityChannel[] = [
  {
    id: "general",
    name: "#general",
    description: "General chat and announcements",
    messages: [
      { id: "msg1", sender: mockOtherUser, text: "Welcome to the #general channel! Please be respectful.", timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: "battle-scheduler",
    name: "#battle-scheduler",
    description: "Find opponents and schedule battles",
    messages: []
  }
];

type MobileChatView = "list" | "chat";

interface CommunityChatProps {
  onMobileViewChange?: (view: MobileChatView) => void;
}

export function CommunityChat({ onMobileViewChange }: CommunityChatProps) {
  const [channels, setChannels] = useState<CommunityChannel[]>(initialChannels);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isModerating, setIsModerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeMobileView, setActiveMobileView] = useState<MobileChatView>('list');

  const activeChannel = channels.find(c => c.id === activeChannelId);

 useEffect(() => {
    if (isMobile) {
      if (!activeChannelId) { 
        setActiveMobileView('list');
        onMobileViewChange?.('list');
      } else { 
        setActiveMobileView('chat');
        onMobileViewChange?.('chat');
      }
    } else { 
      onMobileViewChange?.(activeChannelId ? 'chat' : 'list'); 
    }
  }, [isMobile, activeChannelId, onMobileViewChange]);


  useEffect(() => {
    if (activeMobileView === 'chat' || !isMobile) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeChannel?.messages, activeMobileView, isMobile]);
  
  useEffect(() => {
    if (isMobile && activeMobileView === 'chat' && !activeChannelId) {
      setActiveMobileView('list');
      onMobileViewChange?.('list');
    }
  }, [isMobile, activeMobileView, activeChannelId, onMobileViewChange]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChannel) return;
    setIsModerating(true);

    const tempMessageId = `temp-${Date.now()}`;
    const optimisticMessage: Message = {
      id: tempMessageId,
      sender: mockCurrentUser,
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    setChannels(prevChannels =>
      prevChannels.map(channel =>
        channel.id === activeChannelId
          ? { ...channel, messages: [...channel.messages, optimisticMessage] }
          : channel
      )
    );
    const currentMessageText = newMessage;
    setNewMessage("");

    try {
      const moderationResult: ModerateCommunityChatMessageOutput = await moderateCommunityChatMessage({ message: currentMessageText });
      
      const finalMessage: Message = {
        ...optimisticMessage,
        id: `msg-${Date.now()}`, 
        isFlagged: moderationResult.isFlagged,
        flagReason: moderationResult.reason,
      };

      setChannels(prevChannels =>
        prevChannels.map(channel =>
          channel.id === activeChannelId
            ? { ...channel, messages: channel.messages.map(m => m.id === tempMessageId ? finalMessage : m) }
            : channel
        )
      );

      if (moderationResult.isFlagged) {
        toast({
          title: "Message Flagged",
          description: `Your message was flagged: ${moderationResult.reason}`,
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error("Error moderating message:", error);
      toast({
        title: "Error",
        description: "Could not send or moderate message.",
        variant: "destructive",
      });
       setChannels(prevChannels =>
        prevChannels.map(channel =>
          channel.id === activeChannelId
            ? { ...channel, messages: channel.messages.filter(m => m.id !== tempMessageId) } 
            : channel
        )
      );
    } finally {
      setIsModerating(false);
    }
  };

  const handleChannelSelect = (channelId: string) => {
    setActiveChannelId(channelId);
    if (isMobile) {
      setActiveMobileView('chat'); 
      onMobileViewChange?.('chat');
    } else {
      onMobileViewChange?.('chat');
    }
  };

  const handleBackToList = () => {
    setActiveChannelId(null); 
    setActiveMobileView('list');
    onMobileViewChange?.('list'); 
  };

  const ChannelListView = () => (
    <div className={cn(
      "flex flex-col bg-card h-full", 
      isMobile ? "w-full" : "w-full md:w-1/3 border-r"
    )}>
      <CardHeader className="p-4 border-b shrink-0">
        <CardTitle className="text-lg flex items-center">
          <Users className="mr-2 h-5 w-5 text-primary" /> Community Channels
        </CardTitle>
      </CardHeader>
      <ScrollArea className="flex-grow">
        {channels.map(channel => (
          <Button
            key={channel.id}
            variant={activeChannelId === channel.id && !isMobile ? "secondary" : "ghost"} 
            className="w-full justify-start p-4 h-auto rounded-none border-b"
            onClick={() => handleChannelSelect(channel.id)}
          >
            <div className="flex-grow text-left">
              <p className="font-semibold">{channel.name}</p>
              {channel.description && <p className="text-xs text-muted-foreground truncate max-w-[200px]">{channel.description}</p>}
            </div>
          </Button>
        ))}
      </ScrollArea>
    </div>
  );

  const ChannelChatView = () => {
     if (!activeChannel) { 
        if (isMobile && activeMobileView === 'chat') {
            return (
              <div className="flex-grow flex flex-col h-full items-center justify-center text-muted-foreground p-4">
                <MessageCircle className="h-16 w-16 mb-4" />
                <p className="text-xl">Channel not found or selected.</p>
                <Button onClick={handleBackToList} className="mt-4">Back to List</Button>
              </div>
            );
        }
        return (
            <div className="flex-grow hidden md:flex flex-col items-center justify-center text-muted-foreground p-4 h-full">
            <MessageCircle className="h-16 w-16 mb-4" />
            <p className="text-xl">Select a channel to start chatting</p>
            </div>
        );
    }

    return (
      <div className={cn(
        "flex flex-col bg-background h-full", 
        isMobile && activeMobileView === 'chat' ? "w-full" : "w-full md:w-2/3" 
      )}>
        {isMobile && activeMobileView === 'chat' && (
           <div className="w-full p-3 border-b bg-card flex items-center shrink-0 shadow-sm">
            <Button variant="ghost" size="icon" className="mr-2 shrink-0" onClick={handleBackToList}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Users className="h-6 w-6 mr-3 text-primary shrink-0" /> 
            <h2 className="text-lg font-semibold truncate flex-grow">{activeChannel?.name || "Channel"}</h2>
          </div>
        )}
        
        <CardHeader className={cn(
            "p-4 border-b bg-card flex-row items-center shrink-0",
             (isMobile && activeMobileView === 'chat') ? "hidden" : "flex" 
        )}>
          <div className="flex-grow truncate">
            <CardTitle className="text-lg truncate"> 
              {activeChannel!.name}
            </CardTitle>
            {activeChannel!.description && <p className="text-sm text-muted-foreground truncate">{activeChannel!.description}</p>}
          </div>
        </CardHeader>
        <ScrollArea className="flex-grow h-0">
          <div className="p-4 space-y-4"> {/* Padding applied to inner content */}
            {activeChannel!.messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.sender.id === mockCurrentUser.id ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex items-start gap-2 max-w-[80%] ${msg.sender.id === mockCurrentUser.id ? "flex-row-reverse" : "flex-row"}`}>
                    <Avatar className="h-8 w-8 shrink-0 mt-1">
                      <AvatarImage src={msg.sender.avatarUrl} alt={msg.sender.name} data-ai-hint="profile avatar"/>
                      <AvatarFallback>{msg.sender.name.substring(0,1)}</AvatarFallback>
                  </Avatar>
                  <div
                      className={`p-3 rounded-lg shadow ${
                      msg.sender.id === mockCurrentUser.id
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-card text-card-foreground rounded-bl-none border"
                      }`}
                  >
                      <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold">{msg.sender.name}</span>
                            {msg.isFlagged !== undefined && (
                              <Badge variant={msg.isFlagged ? "destructive" : "default"} className="ml-2 text-xs px-1.5 py-0.5">
                              {msg.isFlagged ? <ShieldAlert className="h-3 w-3 mr-1" /> : <ShieldCheck className="h-3 w-3 mr-1" />}
                              {msg.isFlagged ? 'Flagged' : 'Safe'}
                              </Badge>
                          )}
                      </div>
                      <p className="text-sm">{msg.text}</p>
                      {msg.isFlagged && msg.flagReason && (
                          <p className="text-xs mt-1 opacity-80">Reason: {msg.flagReason}</p>
                      )}
                      <p className={`text-xs mt-1 text-right ${msg.sender.id === mockCurrentUser.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                          {format(parseISO(msg.timestamp), "p")}
                      </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <CardFooter className="p-4 border-t bg-card shrink-0">
          <div className="flex w-full space-x-2">
            <Textarea
              placeholder={`Message ${activeChannel!.name}...`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-grow resize-none min-h-[40px]"
              rows={1}
            />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim() || isModerating} className="bg-accent hover:bg-accent/90 self-end">
              {isModerating ? "Sending..." : <Send className="h-5 w-5" />}
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </CardFooter>
      </div>
    );
  };


  if (isMobile) {
    return (
       <div className="w-full h-full flex flex-col bg-background">
        {activeMobileView === 'list' && <ChannelListView />}
        {activeMobileView === 'chat' && activeChannelId && <ChannelChatView />}
         {activeMobileView === 'chat' && !activeChannelId && ( 
           <div className="flex-grow flex flex-col h-full items-center justify-center text-muted-foreground p-4">
            <MessageCircle className="h-16 w-16 mb-4" />
            <p className="text-xl">No channel selected.</p>
            <Button onClick={handleBackToList} className="mt-4">Back to List</Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className="h-full flex flex-row shadow-xl">
      <ChannelListView />
      <ChannelChatView />
    </Card>
  );
}

