
"use client";

import { useState, useEffect, useRef } from "react";
import type { Message, User, DirectMessageThread } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, MessageSquare, Search, ArrowLeft } from "lucide-react";
import { format, parseISO } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from "@/lib/utils";

const mockCurrentUser: User = { id: "currentUser", name: "You", avatarUrl: "https://placehold.co/40x40.png?text=ME", diamonds: 750 };

const mockUsers: User[] = [
  { id: "user1", name: "StreamerX", avatarUrl: "https://placehold.co/40x40.png?text=SX", diamonds: 120 },
  { id: "user2", name: "GamerPro", avatarUrl: "https://placehold.co/40x40.png?text=GP", diamonds: 250 },
  { id: "user3", name: "CreativeCat", avatarUrl: "https://placehold.co/40x40.png?text=CC", diamonds: 50 },
];

const mockThreads: DirectMessageThread[] = [
  {
    id: "thread1",
    participants: [mockCurrentUser, mockUsers[0]],
    messages: [
      { id: "msg1", sender: mockUsers[0], text: "Hey! Ready for our battle on Friday?", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
      { id: "msg2", sender: mockCurrentUser, text: "You know it! Been practicing.", timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString() },
    ],
    lastMessage: { id: "msg2", sender: mockCurrentUser, text: "You know it! Been practicing.", timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString() },
    unreadCount: { [mockCurrentUser.id]: 0, [mockUsers[0].id]: 1 },
  },
  {
    id: "thread2",
    participants: [mockCurrentUser, mockUsers[1]],
    messages: [
      { id: "msg3", sender: mockUsers[1], text: "GG last night!", timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
    ],
    lastMessage: { id: "msg3", sender: mockUsers[1], text: "GG last night!", timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
    unreadCount: { [mockCurrentUser.id]: 1, [mockUsers[1].id]: 0 },
  },
];

type MobileChatView = "list" | "chat";

interface ChatWindowProps {
  onMobileViewChange?: (view: MobileChatView) => void;
}

export function ChatWindow({ onMobileViewChange }: ChatWindowProps) {
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [threads, setThreads] = useState<DirectMessageThread[]>(mockThreads);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [activeMobileView, setActiveMobileView] = useState<MobileChatView>('list');

  const activeThread = threads.find(t => t.id === activeThreadId);

  useEffect(() => {
    // Initialize view based on mobile status
     if (isMobile) {
      setActiveMobileView('list');
      onMobileViewChange?.('list');
    } else if (activeThreadId) { // if not mobile and a thread is active, ensure chat view
      setActiveMobileView('chat'); 
      onMobileViewChange?.('chat');
    } else { // if not mobile and no thread active, can be list or imply select
      setActiveMobileView('list'); // Default to list if no active thread on desktop
      onMobileViewChange?.('list');
    }
  }, [isMobile]);


  useEffect(() => {
    if (activeMobileView === 'chat' || !isMobile) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeThread?.messages, activeMobileView, isMobile]);

  useEffect(() => {
    if (isMobile && activeMobileView === 'chat' && !activeThreadId) {
      // If mobile, in chat view, but no thread selected (e.g. after deleting a thread), go back to list.
      setActiveMobileView('list');
      onMobileViewChange?.('list');
    }
    // If switching from mobile to desktop, or vice-versa, onMobileViewChange should be called by the primary useEffect.
  }, [isMobile, activeMobileView, activeThreadId, onMobileViewChange]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeThread) return;
    const message: Message = {
      id: `msg${Date.now()}`,
      sender: mockCurrentUser,
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    setThreads(prevThreads => 
      prevThreads.map(thread => 
        thread.id === activeThreadId 
          ? { ...thread, messages: [...thread.messages, message], lastMessage: message } 
          : thread
      )
    );
    setNewMessage("");
  };
  
  const getOtherParticipant = (thread: DirectMessageThread): User | undefined => {
    return thread.participants.find(p => p.id !== mockCurrentUser.id);
  };

  const handleThreadSelect = (threadId: string) => {
    setActiveThreadId(threadId);
    // Always switch to chat view when a thread is selected, regardless of mobile status initially.
    // The parent component (MessagesPage) and the useEffect hooks here will manage fullscreen/bottom nav visibility.
    setActiveMobileView('chat'); 
    onMobileViewChange?.('chat');
  };

  const handleBackToList = () => {
    setActiveMobileView('list');
    onMobileViewChange?.('list'); 
  };

  const SidebarView = () => (
    <div className={cn(
      "flex flex-col bg-card h-full", 
      isMobile ? "w-full" : "w-full md:w-1/3 border-r"
    )}>
      <CardHeader className="p-4 border-b shrink-0">
        <Input placeholder="Search DMs..." icon={<Search className="h-4 w-4 text-muted-foreground" />} />
      </CardHeader>
      <ScrollArea className="flex-grow">
        {threads.map(thread => {
          const otherUser = getOtherParticipant(thread);
          if (!otherUser) return null;
          const unread = thread.unreadCount?.[mockCurrentUser.id] || 0;
          return (
            <Button
              key={thread.id}
              variant={activeThreadId === thread.id && !isMobile ? "secondary" : "ghost"} 
              className="w-full justify-start p-4 h-auto rounded-none border-b"
              onClick={() => handleThreadSelect(thread.id)}
            >
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={otherUser.avatarUrl} alt={otherUser.name} data-ai-hint="profile avatar"/>
                <AvatarFallback>{otherUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-grow text-left">
                <p className="font-semibold">{otherUser.name}</p>
                <p className="text-xs text-muted-foreground truncate max-w-[150px] sm:max-w-[200px]">
                  {thread.lastMessage?.text || "No messages yet"}
                </p>
              </div>
              {unread > 0 && (
                <span className="ml-auto bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {unread}
                </span>
              )}
            </Button>
          );
        })}
      </ScrollArea>
    </div>
  );

  const ChatAreaView = () => {
    const otherParticipant = activeThread ? getOtherParticipant(activeThread) : null;

    if (!activeThread || !otherParticipant) { 
      if (isMobile && activeMobileView === 'chat') { // Only show this specific message if trying to view chat on mobile without selection
        return (
          <div className="flex-grow flex flex-col items-center justify-center text-muted-foreground p-4 h-full">
            <MessageSquare className="h-16 w-16 mb-4" />
            <p className="text-xl">Chat not found or selected.</p>
            <Button onClick={handleBackToList} className="mt-4">Back to List</Button>
          </div>
        );
      }
      // For desktop, or mobile in list view when no chat is active (which shouldn't happen if list view is active)
      return (
        <div className="flex-grow hidden md:flex flex-col items-center justify-center text-muted-foreground p-4 h-full">
          <MessageSquare className="h-16 w-16 mb-4" />
          <p className="text-xl">Select a chat to start messaging</p>
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
            <Avatar className="h-8 w-8 mr-3 shrink-0">
              <AvatarImage src={otherParticipant?.avatarUrl} alt={otherParticipant?.name} data-ai-hint="profile avatar"/>
              <AvatarFallback>{otherParticipant?.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <h2 className="text-lg font-semibold truncate flex-grow">{otherParticipant?.name || "Chat"}</h2>
          </div>
        )}

        <CardHeader className={cn(
            "p-4 border-b bg-card flex-row items-center shrink-0",
            (isMobile && activeMobileView === 'chat') ? "hidden" : "flex" 
        )}>
          <Avatar className="h-8 w-8 mr-2 shrink-0">
            <AvatarImage src={otherParticipant?.avatarUrl} alt={otherParticipant?.name} data-ai-hint="profile avatar"/>
            <AvatarFallback>{otherParticipant?.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-lg truncate">
            {otherParticipant?.name || "Chat"}
          </CardTitle>
        </CardHeader>
        
        <ScrollArea className="flex-grow p-4 space-y-4">
          {activeThread!.messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.sender.id === mockCurrentUser.id ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex items-end gap-2 max-w-[70%] ${msg.sender.id === mockCurrentUser.id ? "flex-row-reverse" : "flex-row"}`}>
                <Avatar className="h-8 w-8">
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
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender.id === mockCurrentUser.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {format(parseISO(msg.timestamp), "p")}
                    </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>
        <CardFooter className="p-4 border-t bg-card shrink-0">
          <div className="flex w-full space-x-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
              className="flex-grow"
            />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()} className="bg-accent hover:bg-accent/90">
              <Send className="h-5 w-5" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </CardFooter>
      </div>
    );
  };

  if (isMobile) {
    return (
      <div className="w-full h-full flex flex-col"> {/* This div must be h-full for ChatAreaView to fill */}
        {activeMobileView === 'list' && <SidebarView />}
        {activeMobileView === 'chat' && activeThreadId && <ChatAreaView />}
        {activeMobileView === 'chat' && !activeThreadId && ( 
           <div className="flex-grow flex flex-col h-full items-center justify-center text-muted-foreground p-4"> {/* Ensure this placeholder also fills height or grows */}
            <MessageSquare className="h-16 w-16 mb-4" />
            <p className="text-xl">No chat selected.</p>
            <Button onClick={handleBackToList} className="mt-4">Back to List</Button>
          </div>
        )}
      </div>
    );
  }

  // Desktop view
  return (
    <Card className="h-[calc(100vh-10rem)] md:h-[70vh] flex flex-row shadow-xl">
      <SidebarView />
      <ChatAreaView />
    </Card>
  );
}

    