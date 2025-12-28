"use client";

import Image from "next/image";

type Props = {
  copied: boolean;
  onCopy: () => void;
};

export function InviteLinkCard({ copied, onCopy }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-md px-6 py-5 items-center max-w-md">
      <div className="flex flex-row justify-between">
        <span className="flex flex-col">
          <label className="text-gray-600 text-xl font-semibold">Signup Link</label>
          <span className="text-sm text-gray-400 flex-wrap">Share with your Coaches or Players</span>
        </span>

        <button
          onClick={onCopy}
          className="border border-[#9ED8D5] rounded-lg px-6 text-black font-semibold hover:bg-teal-50
                     transition flex flex-row justify-between items-center cursor-pointer"
          type="button"
        >
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/fir-auth-f8ffb.firebasestorage.app/o/images%2FLink.png?alt=media&token=6468552d-40fd-4027-99b7-90846d406851"
            alt="Link"
            width={24}
            height={24}
            className="pr-2"
          />
          <span>{copied ? "Copied!" : "Copy Link"}</span>
        </button>
      </div>

    </div>
  );
}
