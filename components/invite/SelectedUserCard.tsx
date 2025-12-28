"use client";

import type { PlayerData } from "@/util/interfaces";
import ProfileInfo from "@/components/Dashboard/ProfileInfo";
import { DotBackground } from "@/components/UI/DotBackground";

type Props = {
  user: PlayerData;
  onClear: () => void;
  onSubmit: () => void;
};

export function SelectedUserCard({ user, onClear, onSubmit }: Props) {
  return (
    <div className="relative w-4/6 bg-white rounded-xl h-full shadow-md px-6 py-5 items-center z-10">
      <div className="relative flex flex-col bg-white border border-[1px] rounded-lg shadow-xs h-50 w-20 z-10 w-full">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row space-x-4 p-4">
            <ProfileInfo avatarSrc={user.avatar} firstName={user.firstName} lastName={user.lastName} />
          </div>
          <div>
            <button
              onClick={onClear}
              className="text-red hover:text-red-300 text-2xl cursor-pointer p-8 active:scale-[0.9]"
              type="button"
              aria-label="Clear selected user"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex-row border-t border-gray-300 opacity-60 p-2" />

        <div className="flex flex-row justify-around">
          <div className="flex flex-col justify-center items-center">
            <h3 className="font-semibold italic text-[#68C5C1]">AGE</h3>
            <h3>{user.age || "Private"}</h3>
          </div>
          <div className="flex flex-col justify-center items-center">
            <h3 className="font-semibold italic text-[#68C5C1]">HAND STYLE</h3>
            <h3>{user.dominantHand || "Right-handed"}</h3>
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-center mt-6">
        <button
          onClick={onSubmit}
          className="bg-[#68C5C1] text-black px-10 py-2 rounded-lg hover:bg-teal-500 cursor-pointer text-white font-bold z-11"
          type="button"
        >
          Send Request
        </button>
      </div>

      <DotBackground BackgroundType={"opacity-50"} />
    </div>
  );
}
