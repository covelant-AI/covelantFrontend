"use client";
import { useEffect, useState, MouseEvent, useRef } from 'react'
import { useAuth } from '@/app/context/AuthContext';
import { MatchDisplay, Match, Props, Player, PlayerMatch } from '@/util/interfaces';
import { Trash2, Check } from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link'
import * as Sentry from "@sentry/nextjs";

export default function VideoDashboard({ activePlayer, setActivePlayer }: Props) {
  const { profile } = useAuth();
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<MatchDisplay[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectionMode, setSelectionMode] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteBtnVisible, setDeleteBtnVisible] = useState<boolean>(false);
  const [fadingIds, setFadingIds] = useState<string[]>([]); // cards fading out
  const [showDeletePill, setShowDeletePill] = useState(false); // keep mounted for exit anim


  const menuRef = useRef<HTMLDivElement>(null);
  const toggleMenu = () => { setShowMenu((prev) => !prev); };

  const toggleSelectionMode = () => {
    setSelectionMode((prev) => {
      if (prev) setSelectedIds([]); // clear when leaving
      return !prev;
    });
  };

  useEffect(() => {
    // handle fade/slide-in of Delete pill
    if (selectionMode) {
      setDeleteBtnVisible(false);
      const id = requestAnimationFrame(() => setDeleteBtnVisible(true));
      return () => cancelAnimationFrame(id);
    } else {
      setDeleteBtnVisible(false);
    }
  }, [selectionMode]);

  const handleDeleteSelected = async () => {
    if (!selectionMode || selectedIds.length === 0 || isDeleting) return;
  
    setIsDeleting(true);
  
    // Pre-animate: fade selected cards
    const idsToFade = selectedIds.map(String);
    setFadingIds(idsToFade);
  
    // Wait for fade-out before removing from DOM
    await new Promise((r) => setTimeout(r, 250));
  
    // Optimistic removal
    const prevMatches = matches;
    const selectedSet = new Set(idsToFade);
    setMatches((prev) => prev.filter((m) => !selectedSet.has(String(m.id))));
  
    try {
      const res = await fetch("/api/deleteMatch", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedIds }),
      });
  
      if (!res.ok) {
        // Revert UI if server call fails
        setMatches(prevMatches);
        setFadingIds([]);
        throw new Error(`HTTP ${res.status}`);
      }
  
      // Success → clear selections and exit selection mode
      setSelectedIds([]);
      setSelectionMode(false);
      setFadingIds([]);
    } catch (err) {
      console.error("Failed to delete matches:", err);
      // Keep selection so the user can retry
    } finally {
      setIsDeleting(false);
    }
  };


  const handleToggleSelect = (id: string | number) => {
    if (!selectionMode) return;
    const key = String(id);
    setSelectedIds((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]
    );
  };

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
          { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } }
        );
        const result = await res.json();
        if (result.error) {
          Sentry.captureException(result.error);
          return;
        }
        setPlayers(result.connection);

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
    if (!activePlayer?.id) return;

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

  useEffect(() => {
  let timeout: NodeJS.Timeout | null = null;

  if (selectionMode) {
    // mount then animate-in
    setShowDeletePill(true);
    setDeleteBtnVisible(false);
    const id = requestAnimationFrame(() => setDeleteBtnVisible(true));
    return () => cancelAnimationFrame(id);
  } else {
    // animate-out then unmount
    setDeleteBtnVisible(false);
    timeout = setTimeout(() => setShowDeletePill(false), 220); // match duration in class
  }

  return () => {
    if (timeout) clearTimeout(timeout);
  };
}, [selectionMode]);


  return (
    <div className="col-span-1 lg:col-span-9 rounded-3xl shadow p-1 flex flex-col gap-2 bg-[#F8F8F8] justify-center z-1">

      {/* Filters / controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-4">
        {/* Player selector */}
        <div className="relative" ref={menuRef}>
          {profile?.type === "player" ? (<></>) : (
            <button
              onClick={toggleMenu}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl text-lg cursor-pointer hover:bg-gray-200">
              <Image
                src={activePlayer?.avatar ?? '/images/default-avatar.png'}
                alt="Avatar"
                width={28}
                height={28}
                className="w-7 h-7 rounded-full object-cover" />
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

        {/* Filters Section */}
        <div className='flex items-center gap-6'>
          <div className="flex items-baseline gap-2 bg-white border border-gray-300 rounded-lg px-4 py-1">
            <span className="text-lg text-gray-600">Win Rate</span>
            <span className="text-lg font-bold text-green-600">
              {activePlayer && activePlayer.winRate != null ? `${Math.trunc(activePlayer.winRate * 100)}%` : '100%'}
            </span>
          </div>

          {/* Trash toggles selection mode */}
          <div className="flex items-baseline gap-2 bg-white border border-gray-300 rounded-lg py-2 px-4">
            <button onClick={toggleSelectionMode} aria-pressed={selectionMode} title="Select videos">
              <Trash2
                size={18}
                className={`hover:scale-[1.1] cursor-pointer ${selectionMode ? 'text-red-700' : 'text-gray-700 hover:text-red-800'}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Matches grid (made relative so the floating pill can sit above) */}
      <div className="relative p-4 bg-[#FFFFFF] rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-2 max-h-[450px] overflow-y-auto h-110">
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
          matches.map((m) => {
            const isSelected = selectedIds.includes(String(m.id));
            const isFading = fadingIds.includes(String(m.id));
            return (
                <div
                  key={m.id}
                  className={`relative rounded-2xl overflow-hidden h-50 bg-[#F8F8F8] border-2 border-[#F8F8F8]
                              hover:scale-[1.03] active:scale-[0.99]
                              transition-all duration-300 ease-out
                              ${isFading ? 'opacity-0 scale-[0.98] translate-y-1' : 'opacity-100'}`}
                  onClick={() => handleToggleSelect(m.id)}
                  role={selectionMode ? "button" : undefined}
                >
                {!selectionMode ? (
                  <Link href={`/matches/${m.id}`} className="block w-full h-full">
                    <Image
                      src={m.imageUrl}
                      alt={m.title}
                      width={500}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                ) : (
                  <div className="w-full h-full">
                    <Image
                      src={m.imageUrl}
                      alt={m.title}
                      width={500}
                      height={300}
                      className="w-full h-full object-cover select-none pointer-events-none"
                    />
                  </div>
                )}

                <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black to-transparent pointer-events-none" />
                <div className="absolute bottom-2 left-2 text-gray-300 text-xs font-semibold px-2 py-1 rounded">
                  {m.title}
                </div>

                {/* Selection checkbox */}
                {selectionMode && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleToggleSelect(m.id); }}
                      className={`absolute top-2 right-2 w-6 h-6 rounded-md border-2 flex items-center justify-center z-10
                                  transition-all duration-200 ease-out
                                  ${selectionMode ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'}
                                  ${isSelected ? 'bg-[#42B6B1] border-[#42B6B1]' : 'bg-white border-gray-300'}`}
                      aria-pressed={isSelected}
                      aria-label={isSelected ? 'Deselect video' : 'Select video'}
                    >
                      {isSelected && <Check size={14} className="text-white" />}
                    </button>
                )}
              </div>
            );
          })
        )}

        {/* Floating "Delete Selected" pill */}
        {(showDeletePill) && (
          <div className="absolute bottom-4 right-4 z-50">
            <button
              type="button"
              onClick={handleDeleteSelected}
              disabled={selectedIds.length === 0 || isDeleting}
              className={`flex items-center gap-2 rounded-2xl border border-gray-300 bg-white shadow-lg px-4 py-3 text-sm font-semibold
                          hover:scale-[1.05] hover:cursor-pointer transition-all duration-200 ease-out
                          ${deleteBtnVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
                          ${selectedIds.length ? 'text-red-700 hover:bg-red-50' : 'text-gray-400 cursor-not-allowed'}`}
              aria-busy={isDeleting}
            >
              <Trash2 size={16} />
              <span>{isDeleting ? "Deleting…" : "Delete Selected"}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

