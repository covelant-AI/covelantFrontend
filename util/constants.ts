//////////////////////////////////////////////////////////////////////////// CONSTANTS //////////////////////////////////////////////////////////////////////////
// Default Values and Constants
import { UserData, Player } from './types';

export const defaultUserData: UserData = {
  id: 0,
  firstName: "Jhon",
  lastName: "Doe",
  email: "TeamCovelant@covelant.com",
  avatar: "/images/default-avatar.png",
  age: 21,
  dominantHand: "Right Handed",
};

export const defaultPlayer1 = {
  id: 1,
  firstName: 'No Player',
  lastName: 'Selected',
  email: 'john.doe@example.com',
  winRate: 0.5,
  avatar: '/images/default-avatar.png',
  age: 25,
  dominantHand: 'right',
  height: 180,
};

export const defaultPlayer: Player = {
  id: 0,
  firstName: null,
  lastName: null,
  email: '',
  avatar: null,
  age: null,
  dominantHand: 'Right Handed',
  height: 180,
  winRate: 1,
  stats: [],
  playerMatchesFirst: [],
  playerMatchesSecond: [],
  coaches: [],
  overallStats: null,
  scorePoints: [],
  matchMetrics: [],
};
