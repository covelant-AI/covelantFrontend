"use client";
import { useEffect, useState, MouseEvent, useRef } from 'react'
import { useAuth } from '@/app/context/AuthContext';
import { MatchDisplay, Match, Props, Player, PlayerMatch } from '@/util/interfaces';
import Image from 'next/image'
import Link from 'next/link'
import * as Sentry from "@sentry/nextjs";

export default function VideoDashboard({ activePlayer, setActivePlayer }: Props) {
    const { profile } = useAuth();
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [players, setPlayers] = useState<Player[]>([]); 
    const [matches, setMatches] = useState<MatchDisplay[]>([]);
    const menuRef = useRef<HTMLDivElement>(null);
    const toggleMenu = () => { setShowMenu((prev) => !prev); };


    useEffect(() => {
        const storedPlayer = sessionStorage.getItem("selectedPlayer");
        if (storedPlayer) {
            const player = JSON.parse(storedPlayer);
            setActivePlayer(player);
        }
    }, [setActivePlayer]);

    useEffect(() => {
        if (!profile?.email) return;

        const getUserData = async () => {
            try {
                const res = await fetch(
                    `/api/getConnection?email=${encodeURIComponent(profile.email)}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                        },
                    }
                );
                const result = await res.json();
                if (result.error) {
                    Sentry.captureException(result.error);
                    return;
                }
                setPlayers(result.connection); 

                // Only set activePlayer to the first player from the database if no player was retrieved from sessionStorage
                if (!sessionStorage.getItem("selectedPlayer") && result.connection.length > 0) {
                    setActivePlayer(result.connection[0]);
                    sessionStorage.setItem("selectedPlayer", JSON.stringify(result.connection[0]));  
                }
            } catch (err) {
                Sentry.captureException(err);
            }
        };

        getUserData();
    }, [profile, setActivePlayer]);

    useEffect(() => {
        if (!activePlayer?.id) {
            return;
        }

        (async () => {
            try {
                const res = await fetch(`/api/getMatches?playerId=${activePlayer.id}`);
                const data = await res.json();
                const live: MatchDisplay[] = data.matches.map((m: Match) => {
                const selfEntry = m.playerMatches.find((pm: PlayerMatch) => pm.playerId === activePlayer.id);
                let opponentName = 'Unknown';

                if (selfEntry?.opponent) {
                    opponentName = `${selfEntry.opponent.firstName} ${selfEntry.opponent.lastName}`;
                } else if (selfEntry?.playerTwo) {
                    opponentName = `${selfEntry.playerTwo.firstName} ${selfEntry.playerTwo.lastName}`;
                }

                return {
                    id: m.id,
                    title: `${activePlayer.firstName} ${activePlayer.lastName} vs ${opponentName}`,
                    imageUrl: m.imageUrl,
                };
                });
                setMatches(live);
            } catch (err) {
                Sentry.captureException(err);
            }
        })();
    }, [activePlayer]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent | MouseEvent & { target: Node }) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside as unknown as EventListener);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside as unknown as EventListener);
        };
    }, []);

    return (
    <div className="col-span-1 lg:col-span-9 rounded-3xl shadow p-1 flex flex-col gap-2 bg-[#F8F8F8] justify-center z-1">

        {/* Filters / controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-4">
            {/* Player selector */}
            <div className="relative" ref={menuRef}>
                {profile?.type === "player" ? (<></>) : (
                    <button
                        onClick={toggleMenu}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-2xl text-lg cursor-pointer hover:bg-gray-200">
                        <Image
                            src={activePlayer?.avatar ?? '/images/default-avatar.png'}
                            alt="Avatar"
                            width={28}
                            height={28}
                            className="w-7 h-7 rounded-full object-cover"/>
                        <span className="text-gray-700">
                            {activePlayer?.firstName} {activePlayer?.lastName}
                        </span>
                        <span className="text-gray-500">▼</span>
                    </button>
                )}
                {showMenu && (
                    <div className="absolute bottom-full mb-2 w-64 bg-white border border-gray-300 rounded-2xl shadow-lg">
                        <div className="px-4 py-2 font-bold text-gray-700 text-xl">Select a Player</div>
                        <div className="flex items-center text-gray-400 font-semibold">
                          <div className="flex-grow border-t border-gray-300"></div>
                        </div>
                        <ul className=" text-sm text-gray-600">
                            {players.map((player) => ( 
                                <li
                                    key={player.id}
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                    onClick={() => {
                                        setActivePlayer(player);
                                        sessionStorage.setItem("selectedPlayer", JSON.stringify(player));  
                                        setShowMenu(false);
                                    }}
                                >
                                    <Image
                                        src={player?.avatar ?? '/images/default-avatar.png'}
                                        alt="Avatar"
                                        width={32}
                                        height={32}
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
                <div className="flex items-baseline gap-2 bg-white border border-gray-300 rounded-xl px-4 py-1">
                    <span className="text-lg text-gray-600">Win Rate</span>
                    <span className="text-lg font-bold text-green-600">
                        {activePlayer && activePlayer.winRate != null ? `${Math.trunc(activePlayer.winRate * 100)}%` : '100%'}
                    </span>
                </div>
            </div>
        </div>

        {/* Matches grid */}
        <div className="p-4 bg-[#FFFFFF] rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-2 max-h-[450px] overflow-y-auto h-110">
            {matches.length === 0 ? (
                <>
                    <div className='max-md:hidden'></div>
                    <div className="flex flex-col items-center justify-center h-100 bg-[#FFFFFF] rounded-lg">
                        <Image
                            src="/images/noMatches.png"
                            alt="No matches"
                            width={500}
                            height={300}
                            className="max-w-full max-h-full object-contain"
                        />
                        <h3 className='text-black text-xl font-bold text-center'>No analysis available, upload a match!</h3>
                        <p className='text-gray-400 font-semibold text-center'>List of analyzed videos will appear here</p>
                    </div>
                </>
            ) : (
                matches.map((m) => (
                    <div
                        key={m.id}
                        className="relative rounded-2xl overflow-hidden h-50 bg-[#F8F8F8] border-2 border-[#F8F8F8] 
                                   hover:scale-[1.03] transition duration-100 active:scale-[0.99]">
                        <Link key={m.id} href={`/matches/${m.id}`}>
                            <Image
                                src={m.imageUrl}
                                alt={m.title}
                                width={500}
                                height={300}
                                className="w-full h-full object-cover"
                            />
                        </Link>
                        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black to-transparent pointer-events-none" />
                        <div className="absolute bottom-2 left-2 text-gray-300 text-xs font-semibold px-2 py-1 rounded">
                            {m.title}
                        </div>
                    </div>
                ))
            )}
        </div>

    </div>)
}

