import type { User } from './user';

export interface Message {
  id: string;
  sender: User;
  text: string;
  timestamp: string; // ISO string for date and time
  isFlagged?: boolean;
  flagReason?: string;
}

export interface DirectMessageThread {
  id: string;
  participants: [User, User]; // Tuple for exactly two users
  messages: Message[];
  lastMessage?: Message;
  unreadCount?: { [userId: string]: number }; // Unread count for each participant
}

export interface CommunityChannel {
  id: string;
  name: string; // e.g., "#general", "#battle-scheduler"
  description?: string;
  messages: Message[];
}
