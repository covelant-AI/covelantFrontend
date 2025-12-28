"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useAuth } from "@/app/context/AuthContext";
import type { MatchDisplay, Match, Props, Player } from "@/util/interfaces";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import * as Sentry from "@sentry/nextjs";

import { useMatchesStatusUpdater } from "@/hooks/useMatchesStatusUpdater";

import { PlayerSelector } from "./PlayerSelector";
import { MatchCard } from "./MatchCard";
import { DeleteSelectedPill } from "./DeleteSelectedPill";

import { fetchConnectedPlayers } from "./services/connections";
import { fetchMatchesForPlayer } from "./services/matches";
import { toMatchDisplays } from "./utils/matchDisplay";
import { readSelectedPlayerFromSession, writeSelectedPlayerToSession } from "./utils/storage";
import { useOutsideClick } from "./hooks/useOutsideClick";
import { useDeleteSelectionPill } from "./hooks/useDeleteSelectionPill";

export default function VideoDashboard({ activePlayer, setActivePlayer }: Props) {
  const { profile } = useAuth();

  const isPlayerProfile = profile?.type === "player";

  const [showMenu, setShowMenu] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<MatchDisplay[]>([]);

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [fadingIds, setFadingIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const { showDeletePill, deleteBtnVisible } = useDeleteSelectionPill(selectionMode);

  const toggleMenu = useCallback(() => setShowMenu((p) => !p), []);
  const closeMenu = useCallback(() => setShowMenu(false), []);

  useOutsideClick(menuRef, closeMenu, showMenu);

  const toggleSelectionMode = useCallback(() => {
    setSelectionMode((prev) => {
      if (prev) setSelectedIds([]); // clear when leaving
      return !prev;
    });
  }, []);

  const handleToggleSelect = useCallback(
    (id: string | number) => {
      if (!selectionMode) return;
      const key = String(id);
      setSelectedIds((prev) => (prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]));
    },
    [selectionMode]
  );

  // Restore selected player from session on mount
  useEffect(() => {
    const stored = readSelectedPlayerFromSession();
    if (stored) setActivePlayer(stored);
  }, [setActivePlayer]);

  // Load connected players for coach (and default selection)
  useEffect(() => {
    const email = profile?.email;
    if (!email) return;

    const controller = new AbortController();

    (async () => {
      try {
        const connected = await fetchConnectedPlayers(email, controller.signal);
        setPlayers(connected);

        if (!readSelectedPlayerFromSession() && connected.length > 0) {
          setActivePlayer(connected[0]);
          writeSelectedPlayerToSession(connected[0]);
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        Sentry.captureException(err);
      }
    })();

    return () => controller.abort();
  }, [profile?.email, setActivePlayer]);

  // Load matches for selected player
  useEffect(() => {
    if (!activePlayer?.id) return;

    const controller = new AbortController();

    (async () => {
      try {
        const rawMatches: Match[] = await fetchMatchesForPlayer(activePlayer.id, controller.signal);
        setMatches(toMatchDisplays(rawMatches, activePlayer));
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        Sentry.captureException(err);
      }
    })();

    return () => controller.abort();
  }, [activePlayer]);

  // Auto-update status for matches in progress
  useMatchesStatusUpdater({ matches, enabled: matches.length > 0 });

  const onSelectPlayer = useCallback(
    (player: Player) => {
      setActivePlayer(player);
      writeSelectedPlayerToSession(player);
      setShowMenu(false);
    },
    [setActivePlayer]
  );

  const handleDeleteSelected = useCallback(async () => {
    if (!selectionMode || selectedIds.length === 0 || isDeleting) return;

    setIsDeleting(true);

    // fade selected
    const idsToFade = selectedIds.map(String);
    setFadingIds(idsToFade);

    // wait for fade animation
    await new Promise<void>((resolve) => setTimeout(resolve, 250));

    // optimistic update
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
        setMatches(prevMatches);
        setFadingIds([]);
        throw new Error(`deleteMatch failed: HTTP ${res.status}`);
      }

      setSelectedIds([]);
      setSelectionMode(false);
      setFadingIds([]);
    } catch (err) {
      Sentry.captureException(err);
      // keep selection so user can retry
    } finally {
      setIsDeleting(false);
    }
  }, [selectionMode, selectedIds, isDeleting, matches]);

  const winRateText = useMemo(() => {
    if (activePlayer && activePlayer.winRate != null) return `${Math.trunc(activePlayer.winRate * 100)}%`;
    return "100%";
  }, [activePlayer]);

  return (
    <div className="col-span-1 lg:col-span-9 rounded-3xl shadow p-1 flex flex-col gap-2 bg-[#F8F8F8] justify-center z-1">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-4">
        <PlayerSelector
          isPlayerProfile={isPlayerProfile}
          activePlayer={activePlayer ?? null}
          players={players}
          showMenu={showMenu}
          onToggleMenu={toggleMenu}
          onSelectPlayer={onSelectPlayer}
          menuRef={menuRef}
        />

        <div className="flex items-center gap-6">
          <div className="flex items-baseline gap-2 bg-white border border-gray-300 rounded-lg px-4 py-1">
            <span className="text-lg text-gray-600">Win Rate</span>
            <span className="text-lg font-bold text-green-600">{winRateText}</span>
          </div>

          <div className="flex items-baseline gap-2 bg-white border border-gray-300 rounded-lg py-2 px-4">
            <button onClick={toggleSelectionMode} aria-pressed={selectionMode} title="Select videos">
              <Trash2
                size={18}
                className={`hover:scale-[1.1] cursor-pointer ${
                  selectionMode ? "text-red-700" : "text-gray-700 hover:text-red-800"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="relative p-4 bg-[#FFFFFF] rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-2 max-h-[450px] overflow-y-auto h-110">
        {matches.length === 0 ? (
          <>
            <div className="max-md:hidden"></div>
            <div className="flex flex-col items-center justify-center h-100 bg-[#FFFFFF] rounded-lg">
              <Image
                src="/images/noMatches.png"
                alt="No matches"
                width={500}
                height={300}
                className="max-w-full max-h-full object-contain"
              />
              <h3 className="text-black text-xl font-bold text-center">
                No analysis available, upload a match!
              </h3>
              <p className="text-gray-400 font-semibold text-center">
                List of analyzed videos will appear here
              </p>
            </div>
          </>
        ) : (
          matches.map((m) => (
            <MatchCard
              key={m.id}
              match={m}
              selectionMode={selectionMode}
              isSelected={selectedIds.includes(String(m.id))}
              isFading={fadingIds.includes(String(m.id))}
              onToggleSelect={handleToggleSelect}
            />
          ))
        )}

        <DeleteSelectedPill
          show={showDeletePill}
          visible={deleteBtnVisible}
          disabled={selectedIds.length === 0 || isDeleting}
          isDeleting={isDeleting}
          onDelete={handleDeleteSelected}
        />
      </div>
    </div>
  );
}
