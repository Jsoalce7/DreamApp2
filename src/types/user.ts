
export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  tiktokId?: string; // Optional, if signing in via TikTok
  diamonds?: number; // Added for leaderboard
  battleStyle?: string; // Added for profile and popup
}

