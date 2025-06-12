
"use client";

import type React from 'react';
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
import { useUserProfilePopup } from '@/contexts/UserProfilePopupContext';

const mockCurrentUser: User = { id: "currentUser", name: "You", avatarUrl: "https://placehold.co/40x40.png?text=ME", diamonds: 750, battleStyle: "Comedy Roasts"};

const mockUsers: User[] = [
  { id: "user1", name: "StreamerX", avatarUrl: "https://placehold.co/40x40.png?text=SX", diamonds: 120, battleStyle: "Comedy Roasts" },
  { id: "user2", name: "GamerPro", avatarUrl: "https://placehold.co/40x40.png?text=GP", diamonds: 250, battleStyle: "Speedruns" },
  { id: "user3", name: "CreativeCat", avatarUrl: "https://placehold.co/40x40.png?text=CC", diamonds: 50, battleStyle: "Art Streams" },
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

interface ChatMessagesProps {
  messages: Message[];
  currentUserId: string;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  openProfilePopup: (user: User) => void;
}

function ChatMessages({ messages, currentUserId, messagesEndRef, openProfilePopup }: ChatMessagesProps) {
  return (
    <>
      {messages.map(msg => (
        <div
          key={msg.id}
          className={`flex ${msg.sender.id === currentUserId ? "justify-end" : "justify-start"}`}
        >
          <div className={`flex items-end gap-2 max-w-[70%] ${msg.sender.id === currentUserId ? "flex-row-reverse" : "flex-row"}`}>
            <Avatar 
              className="h-8 w-8 cursor-pointer"
              onClick={() => openProfilePopup(msg.sender)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openProfilePopup(msg.sender)}
              role="button"
              tabIndex={0}
            >
                <AvatarImage src={msg.sender.avatarUrl} alt={msg.sender.name} data-ai-hint="profile avatar"/>
                <AvatarFallback>{msg.sender.name.substring(0,1)}</AvatarFallback>
            </Avatar>
            <div
                className={`p-3 rounded-lg shadow ${
                msg.sender.id === currentUserId
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-card text-card-foreground rounded-bl-none border"
                }`}
            >
                <p className="text-sm">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.sender.id === currentUserId ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                {format(parseISO(msg.timestamp), "p")}
                </p>
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </>
  );
}

interface MobileChatWindowLayoutProps {
  activeMobileView: MobileChatView;
  activeThread: DirectMessageThread | undefined;
  otherParticipant: User | null;
  threads: DirectMessageThread[];
  newMessage: string;
  setNewMessage: (value: string) => void;
  handleSendMessage: () => void;
  handleThreadSelect: (threadId: string) => void;
  handleBackToList: () => void;
  getOtherParticipant: (thread: DirectMessageThread) => User | undefined;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  openProfilePopup: (user: User) => void;
}

function MobileChatWindowLayout({
  activeMobileView,
  activeThread,
  otherParticipant,
  threads,
  newMessage,
  setNewMessage,
  handleSendMessage,
  handleThreadSelect,
  handleBackToList,
  getOtherParticipant,
  messagesEndRef,
  openProfilePopup,
}: MobileChatWindowLayoutProps) {
  
  useEffect(() => {
    if (activeMobileView === 'chat' && activeThread?.messages.length) {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
    }
  }, [activeThread?.messages, activeMobileView, messagesEndRef]);

  if (activeMobileView === 'list') {
    return (
      <div className="flex flex-col bg-card h-full w-full">
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
                variant="ghost"
                className="w-full justify-start p-4 h-auto rounded-none border-b"
                onClick={() => handleThreadSelect(thread.id)}
              >
                <Avatar 
                  className="h-10 w-10 mr-3 cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); openProfilePopup(otherUser); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); openProfilePopup(otherUser); }}}
                  role="button"
                  tabIndex={0}
                >
                  <AvatarImage src={otherUser.avatarUrl} alt={otherUser.name} data-ai-hint="profile avatar"/>
                  <AvatarFallback>{otherUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-grow text-left">
                  <p 
                    className="font-semibold cursor-pointer hover:underline"
                    onClick={(e) => { e.stopPropagation(); openProfilePopup(otherUser); }}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); openProfilePopup(otherUser); }}}
                    role="button"
                    tabIndex={0}
                  >{otherUser.name}</p>
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
  }

  if (!activeThread || !otherParticipant) {
    return (
      <div className="flex flex-col w-full h-full items-center justify-center text-muted-foreground p-4 bg-background">
        <MessageSquare className="h-16 w-16 mb-4" />
        <p className="text-xl">Chat not found.</p>
        <Button onClick={handleBackToList} className="mt-4">Back to List</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full fixed left-0 right-0 top-[56px] bottom-0 bg-background">
      <div className="flex items-center p-3 border-b bg-card shrink-0 shadow-sm">
        <Button variant="ghost" size="icon" className="mr-2 shrink-0" onClick={handleBackToList}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar 
            className="h-8 w-8 mr-3 shrink-0 cursor-pointer"
            onClick={() => openProfilePopup(otherParticipant)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openProfilePopup(otherParticipant)}
            role="button"
            tabIndex={0}
        >
          <AvatarImage src={otherParticipant?.avatarUrl} alt={otherParticipant?.name} data-ai-hint="profile avatar"/>
          <AvatarFallback>{otherParticipant?.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <h2 
            className="text-lg font-semibold truncate flex-grow cursor-pointer hover:underline"
            onClick={() => openProfilePopup(otherParticipant)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openProfilePopup(otherParticipant)}
            role="button"
            tabIndex={0}
        >{otherParticipant?.name || "Chat"}</h2>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4">
         <ChatMessages messages={activeThread.messages} currentUserId={mockCurrentUser.id} messagesEndRef={messagesEndRef} openProfilePopup={openProfilePopup} />
      </div>

      <div className="p-4 border-t bg-card shrink-0">
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
      </div>
    </div>
  );
}

interface DesktopChatWindowLayoutProps {
  activeThreadId: string | null;
  activeThread: DirectMessageThread | undefined;
  otherParticipant: User | null;
  threads: DirectMessageThread[];
  newMessage: string;
  setNewMessage: (value: string) => void;
  handleSendMessage: () => void;
  handleThreadSelect: (threadId: string) => void;
  getOtherParticipant: (thread: DirectMessageThread) => User | undefined;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  openProfilePopup: (user: User) => void;
}

function DesktopChatWindowLayout({
  activeThreadId,
  activeThread,
  otherParticipant,
  threads,
  newMessage,
  setNewMessage,
  handleSendMessage,
  handleThreadSelect,
  getOtherParticipant,
  messagesEndRef,
  openProfilePopup,
}: DesktopChatWindowLayoutProps) {

  useEffect(() => {
    if (activeThread?.messages.length) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeThread?.messages, messagesEndRef]);
  
  return (
    <Card className="h-full flex flex-row shadow-xl">
      <div className="flex flex-col bg-card w-1/3 border-r h-full">
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
                variant={activeThreadId === thread.id ? "secondary" : "ghost"} 
                className="w-full justify-start p-4 h-auto rounded-none border-b"
                onClick={() => handleThreadSelect(thread.id)}
              >
                <Avatar 
                  className="h-10 w-10 mr-3 cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); openProfilePopup(otherUser); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); openProfilePopup(otherUser); }}}
                  role="button"
                  tabIndex={0}
                >
                  <AvatarImage src={otherUser.avatarUrl} alt={otherUser.name} data-ai-hint="profile avatar"/>
                  <AvatarFallback>{otherUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-grow text-left">
                  <p 
                    className="font-semibold cursor-pointer hover:underline"
                    onClick={(e) => { e.stopPropagation(); openProfilePopup(otherUser); }}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); openProfilePopup(otherUser); }}}
                    role="button"
                    tabIndex={0}
                  >{otherUser.name}</p>
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

      <div className="flex flex-col bg-background w-2/3 h-full">
        {!activeThread || !otherParticipant ? (
          <div className="flex-grow flex flex-col items-center justify-center text-muted-foreground p-4 h-full">
            <MessageSquare className="h-16 w-16 mb-4" />
            <p className="text-xl">Select a chat to start messaging</p>
          </div>
        ) : (
          <>
            <CardHeader className="p-4 border-b bg-card flex-row items-center shrink-0">
              <Avatar 
                className="h-8 w-8 mr-2 shrink-0 cursor-pointer"
                onClick={() => openProfilePopup(otherParticipant)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openProfilePopup(otherParticipant)}
                role="button"
                tabIndex={0}
              >
                <AvatarImage src={otherParticipant?.avatarUrl} alt={otherParticipant?.name} data-ai-hint="profile avatar"/>
                <AvatarFallback>{otherParticipant?.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <CardTitle 
                className="text-lg truncate cursor-pointer hover:underline"
                onClick={() => openProfilePopup(otherParticipant)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openProfilePopup(otherParticipant)}
                role="button"
                tabIndex={0}
              >
                {otherParticipant?.name || "Chat"}
              </CardTitle>
            </CardHeader>
            
            <div className="flex-grow h-0 overflow-y-auto p-4 space-y-4">
              <ChatMessages messages={activeThread.messages} currentUserId={mockCurrentUser.id} messagesEndRef={messagesEndRef} openProfilePopup={openProfilePopup}/>
            </div>

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
          </>
        )}
      </div>
    </Card>
  );
}

export function ChatWindow({ onMobileViewChange }: ChatWindowProps) {
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [threads, setThreads] = useState<DirectMessageThread[]>(mockThreads);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [activeMobileView, setActiveMobileView] = useState<MobileChatView>('list');
  const { openPopup } = useUserProfilePopup();

  const getOtherParticipant = (thread: DirectMessageThread): User | undefined => {
    return thread.participants.find(p => p.id !== mockCurrentUser.id);
  };

  const activeThread = threads.find(t => t.id === activeThreadId);
  const otherParticipant = activeThread ? getOtherParticipant(activeThread) : null;

  useEffect(() => {
     if (isMobile) {
      if (!activeThreadId) { 
        setActiveMobileView('list');
        onMobileViewChange?.('list');
      } else { 
        setActiveMobileView('chat');
        onMobileViewChange?.('chat');
      }
    } else { 
      onMobileViewChange?.(activeThreadId ? 'chat' : 'list'); 
    }
  }, [isMobile, activeThreadId, onMobileViewChange]);

  useEffect(() => {
    if (isMobile && activeMobileView === 'chat' && !activeThreadId) {
      setActiveMobileView('list');
      onMobileViewChange?.('list');
    }
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
  
  const handleThreadSelect = (threadId: string) => {
    setActiveThreadId(threadId);
  };

  const handleBackToList = () => {
    setActiveThreadId(null); 
    if (isMobile) {
      setActiveMobileView('list'); 
      onMobileViewChange?.('list');
    }
  };

  if (isMobile === undefined) { 
    return <div className="w-full h-full flex items-center justify-center"><p>Loading...</p></div>;
  }

  if (isMobile) {
    return (
      <div className="w-full h-screen flex flex-col">
        <MobileChatWindowLayout
          activeMobileView={activeMobileView}
          activeThread={activeThread}
          otherParticipant={otherParticipant}
          threads={threads}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSendMessage={handleSendMessage}
          handleThreadSelect={handleThreadSelect}
          handleBackToList={handleBackToList}
          getOtherParticipant={getOtherParticipant}
          messagesEndRef={messagesEndRef}
          openProfilePopup={openPopup}
        />
      </div>
    );
  }

  return (
    <DesktopChatWindowLayout
      activeThreadId={activeThreadId}
      activeThread={activeThread}
      otherParticipant={otherParticipant}
      threads={threads}
      newMessage={newMessage}
      setNewMessage={setNewMessage}
      handleSendMessage={handleSendMessage}
      handleThreadSelect={handleThreadSelect}
      getOtherParticipant={getOtherParticipant}
      messagesEndRef={messagesEndRef}
      openProfilePopup={openPopup}
    />
  );
}
