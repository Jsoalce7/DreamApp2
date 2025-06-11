export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  tiktokId?: string; // Optional, if signing in via TikTok
}
