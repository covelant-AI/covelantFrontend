'use client';
import { useAuth } from '@/app/context/AuthContext';
import CoachesPlayers from "./CoachesPlayers";
import PlayersCoaches from "./PlayersCoaches";

export default function ConnectionBox(){
    const {type} = useAuth();

    return (
        <div className="flex flex-col z-10">
            <div className="pb-2 items-start">
                {type == "player" ? <p className="font-semibold text-[#3E3E3E] text-md pl-2">Your Coach</p> 
                : <p className="font-semibold text-[#3E3E3E] text-md pl-2">Your Players</p>}
            </div>
            {type == "player" ? <PlayersCoaches/> : <CoachesPlayers/>}   
        </div>  
    )
}