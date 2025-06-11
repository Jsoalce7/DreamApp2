import type { User } from './user';

export type BattleStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Declined' | 'Requested';
export type BattleMode = '1v1 Duel' | 'Team Clash' | 'Fun Mode';

export interface Battle {
  id: string;
  opponentA: User;
  opponentB: User;
  dateTime: string; // ISO string for date and time
  mode: BattleMode;
  status: BattleStatus;
  requestedByUserId?: string; 
  requestedToUserId?: string; 
  // winnerId?: string; // Optional: ID of the winning user or team
}
