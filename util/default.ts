import { UserData} from './interfaces'
import { CategoryKey } from '@/util/types';

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


export const tabs: CategoryKey[] = [
    "Match",
    "Tactic",
    "Fouls",
    "Physical",
    "Note",
  ];

export const COLOR_MAP: Record<string, string> = {
  MATCH:   "#FACC15",   // yellow
  TACTIC:  "#14B8A6",   // teal
  FOULS:   "#EF4444",   // red
  PHYSICAL:"#38BDF8",   // sky
  COMMENT: "#9CA3AF",   // gray
};
export const ICON_MAP: Record<string, string> = {
  MATCH:   "/images/lables/tag1.png",
  TACTIC:  "/images/lables/tag2.png",
  FOULS:   "/images/lables/tag3.png",
  PHYSICAL:"/images/lables/tag4.png",
  COMMENT: "/images/lables/tag5.png",
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


//////////////////////////////////////////////////////////////////// MAIN PREFORMANCE TRACKER SECTION ///////////////////////////////////////////////////////////

