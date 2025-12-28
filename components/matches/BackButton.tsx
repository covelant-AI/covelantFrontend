"use client";

import Image from "next/image";

type Props = {
  onClick: () => void;
};

export function BackButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 left-4 z-10 px-4 py-4 rounded-xl bg-white shadow-md
                 hover:bg-gray-100 transition-colors duration-100 hover:scale-105 active:scale-95"
      type="button"
      aria-label="Go back"
    >
      <Image
        src="https://firebasestorage.googleapis.com/v0/b/fir-auth-f8ffb.firebasestorage.app/o/images%2Ficons%2FBackArrow.svg?alt=media&token=f4695bb5-dfd2-4733-9755-32748dbc86b8"
        alt="Back"
        width={20}
        height={20}
      />
    </button>
  );
}
