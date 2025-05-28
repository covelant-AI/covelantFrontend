import { useAuth } from '@/app/context/AuthContext';
import { Player } from '@/generated/prisma';
import { Props, defaultPlayer } from '@/util/interfaces';
import {Match} from '@/util/types';
import { useEffect, useState, MouseEvent, useRef } from 'react'

const matches: Match[] = [
  { id: 1, title: 'Alexis Lebrun vs Hugo Calderano', imageUrl: '/testImages/match.png' },
  { id: 2, title: 'Alexis Lebrun vs LIANG Jinkun',   imageUrl: '/testImages/match.png' },
  { id: 3, title: 'Alexis Lebrun vs Fan Zhendong',  imageUrl: '/testImages/match.png' },
  { id: 4, title: 'Alexis Lebrun vs Liam Pitchford',imageUrl: '/testImages/match.png' },
  { id: 5, title: 'Alexis Lebrun vs Xiang Peng',    imageUrl: '/testImages/match.png' },
]

export default function VideoDashboard({ activePlayer, setActivePlayer }: Props) {
    const { type, user } = useAuth();
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [selectedPlayer, setSelectedPlayer] = useState<Player[]>([defaultPlayer]);

    const getUserData = async (): Promise<void> => {
         try {
           const email = user.email;
  
           await fetch(`/api/getConnection?email=${encodeURIComponent(email)}`, {
             method: 'GET',
             headers: new Headers({
               'Content-Type': 'application/json',
               Accept: 'application/json',
             }),
           }).then((response) => response.json())
           .then((result)=> {
             if(result.error){
               console.error('Error fetching user data:', result.error);
             }
             setSelectedPlayer(() => result.connection);
             console.log('Selected players:', result.connection);
             setActivePlayer(result.connection[0]);
           })
         } catch (error) {
           console.error('Error fetching user data:', error);
         }
       };
       
       useEffect(() => {
          getUserData()
       }, [user, type])

        useEffect(() => {
           function handleClickOutside(event: MouseEvent | MouseEvent & { target: Node }) {
             if (
               menuRef.current &&
               !menuRef.current.contains(event.target as Node)
             ) {
               setShowMenu(false);
             }
           }
           document.addEventListener("mousedown", handleClickOutside as unknown as EventListener);
           return () => {
             document.removeEventListener(
               "mousedown",
               handleClickOutside as unknown as EventListener
             );
           };
         }, []);

        const toggleMenu = () => {setShowMenu((prev) => !prev);};
        
    
    return (
        <div className="col-span-1 lg:col-span-9 rounded-2xl shadow p-1 flex flex-col gap-2 bg-[#F8F8F8] my-5 justify-center">

        {/* Matches grid */}
        <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-2 bg-[#FFFFFF]  rounded-2xl">
          {matches.map(m => (
            <div key={m.id} className="relative rounded-lg overflow-hidden h-50 bg-[#F8F8F8] border-2 border-[#F8F8F8] 
                hover:scale-[1.05] transition duration-300">
              <img
                src={m.imageUrl}
                alt={m.title}
                className="w-full h-full object-cover"
              />

              {/* Black gradient fade at bottom */}
              <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black to-transparent pointer-events-none" />

              <div className="absolute bottom-2 left-2 text-gray-300 text-xs font-semibold px-2 py-1 rounded">
                {m.title}
              </div>
            </div>
          ))}
        </div>

        {/* Filters / controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-4">

         {/* Player selector */}
          <div className="relative" ref={menuRef}>
           {type === "coach" && (
             <button
               onClick={toggleMenu}
               className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full text-lg cursor-pointer hover:bg-gray-200"
             >
               <img
                 src={activePlayer?.avatar ?? '/images/default-avatar.png'}
                 alt="Avatar"
                 className="w-7 h-7 rounded-full object-cover"
               />
               <span className="text-gray-700">
                 {activePlayer?.firstName} {activePlayer?.lastName}
               </span>
               <span className="text-gray-500">▼</span>
             </button>
           )}
           {showMenu && (
             <div className="absolute bottom-full mb-2 z-10 w-64 bg-white border border-gray-300 rounded-lg shadow-lg">
               <div className="p-4 font-bold text-gray-700 text-xl">Players</div>
               <ul className=" text-sm text-gray-600">
                 {selectedPlayer.map((player) => (
                   <li
                     key={player.id}
                     className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 cursor-pointer"
                     onClick={() => {
                     setActivePlayer(player);
                     setShowMenu(false); 
                   }}
                   >
                     <img
                       src={player?.avatar ?? '/images/default-avatar.png'}
                       alt="Avatar"
                       className="w-8 h-8 rounded-full object-cover"
                     />
                     <span className='font-normal text-gray-700 text-md'>
                       {player.firstName} {player.lastName}
                     </span>
                   </li>
                 ))}
               </ul>
             </div>
           )}
         </div>

           {/* Filters Section*/}
          <div className='flex items-center gap-6'>
          {/* Win rate */}
          <div className="flex items-baseline gap-2 bg-white border border-gray-300 rounded-full px-4 py-1">
            <span className="text-lg text-gray-600">Win Rate</span>
            <span className="text-lg font-bold text-green-600">
              {activePlayer && activePlayer.winRate != null ? `${(activePlayer.winRate * 100)}%` : '100%'}
            </span>
          </div>

          {/* Sort
          <button className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded-full text-lg text-gray-700">
            Filter ↕
          </button>

          Time filter
          <button className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded-full text-lg text-gray-700">
            <span>Last month</span>
            <span className="text-gray-500">▼</span>
          </button> */}
          </div>
        </div>
      </div>
    )
}