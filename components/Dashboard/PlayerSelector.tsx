"use client";

import Image from "next/image";
import type { Player } from "@/util/interfaces";

type Props = {
  isPlayerProfile: boolean;
  activePlayer: Player | null;
  players: Player[];
  showMenu: boolean;
  onToggleMenu: () => void;
  onSelectPlayer: (player: Player) => void;
  menuRef: React.RefObject<HTMLDivElement>;
};

export function PlayerSelector({
  isPlayerProfile,
  activePlayer,
  players,
  showMenu,
  onToggleMenu,
  onSelectPlayer,
  menuRef,
}: Props) {
  if (isPlayerProfile) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={onToggleMenu}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl text-lg cursor-pointer hover:bg-gray-200"
      >
        <Image
          src={activePlayer?.avatar ?? "/images/default-avatar.png"}
          alt="Avatar"
          width={28}
          height={28}
          className="w-7 h-7 rounded-full object-cover"
        />
        <span className="text-gray-700">
          {activePlayer?.firstName} {activePlayer?.lastName}
        </span>
        <span className="text-gray-500">▼</span>
      </button>

      {showMenu && (
        <div className="absolute bottom-full mb-2 w-64 bg-white border border-gray-300 rounded-2xl shadow-lg">
          <div className="px-4 py-2 font-bold text-gray-700 text-xl">Select a Player</div>
          <div className="flex items-center text-gray-400 font-semibold">
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <ul className="text-sm text-gray-600">
            {players.map((player) => (
              <li
                key={player.id}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => onSelectPlayer(player)}
              >
                <Image
                  src={player.avatar ?? "/images/default-avatar.png"}
                  alt="Avatar"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-normal text-gray-700 text-md">
                  {player.firstName} {player.lastName}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
