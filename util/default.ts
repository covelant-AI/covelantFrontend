import { UserData } from './interfaces'

////////////////////////////////////////////////////////////////////////////// DEFAULTS //////////////////////////////////////////////////////////////////

export const defaultUserData: UserData = {
  id: 0,
  firstName: '',
  lastName: '',
  email: '',
  avatar: '/images/default-avatar.png',
  age: 0,
  dominantHand: '',
};

export const defaultPlayer = {
  id: 0,                    
  firstName: "John",         
  lastName: "Doe",           
  email: "example@example.com", 
  avatar: "/images/default-avatar.png", 
  age: 25,                   
  dominantHand: "Right Handed", 
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

export const DEFAULT_STATS = [
  { subject: "SRV", A: 0, color: "#42B6B1" },
  { subject: "RSV", A: 0, color: "#42B6B1" },
  { subject: "FRH", A: 0, color: "#F24B3E" },
  { subject: "BRH", A: 0, color: "#F08C2B" },
  { subject: "RLY", A: 0, color: "#42B6B1" },
];

export const defaultDisplayedMatches = [
  { id: 1, title: 'Loading Data...', imageUrl: '/images/whiteBackground.png' },
  { id: 2, title: 'Loading Data...',   imageUrl: '/images/whiteBackground.png' },
  { id: 3, title: 'Loading Data...',  imageUrl: '/images/whiteBackground.png' },
  { id: 4, title: 'Loading Data...',imageUrl: '/images/whiteBackground.png' },
  { id: 5, title: 'Loading Data...',    imageUrl: '/images/whiteBackground.png' },
  { id: 6, title: 'Loading Data...',    imageUrl: '/images/whiteBackground.png' },
];

export const inviteUrl = 'https://www.covelant.com/sign-up'
