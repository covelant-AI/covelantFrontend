import Link from "next/link";
import Image from "next/image";
import type { PlayerData } from "@/util/interfaces";

type Props = {
  person: PlayerData;
  onRemove: (id: number) => void;
};

export function ConnectionCard({ person, onRemove }: Props) {
  return (
    <div className="relative flex flex-col justify-center items-center max-w-[150px]">
      <button
        onClick={() => onRemove(person.id)}
        className="absolute -top-2 right-5 bg-radial-[at_50%_50%] from-white to-white-900 to-[#FF4545] to-300% hover:to-200%
                   text-red-500 rounded-full p-1 hover:scale-[1.1] active:scale-[1.05] pointer:cursor"
        aria-label="Remove connection"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <Link href="/coming-soon" className="flex flex-col items-center">
        <div className="rounded-lg p-1 border hover:border-[#6EB6B3] hover:bg-[#6EB6B3] active:scale-[0.98]">
          <Image
            src={person.avatar || "/images/default-avatar.png"}
            alt={`${person.firstName} ${person.lastName}`}
            width={80}
            height={80}
            className="w-20 h-20 object-cover rounded-md"
          />
        </div>
        <span className="mt-2 text-sm font-semibold text-gray-700 text-center">
          {person.firstName} {person.lastName}
        </span>
      </Link>
    </div>
  );
}
