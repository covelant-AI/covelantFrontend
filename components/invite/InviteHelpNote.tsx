import Image from "next/image";

export function InviteHelpNote() {
  return (
    <div className="flex flex-row w-full space-x-4 z-11 pt-4">
      <Image
        src="/icons/info.svg"
        alt="Information icon"
        width={32}
        height={32}
        className="object-fill h-8 w-8 w-1/6"
      />
      <h3 className="w-5/6 text-gray-400 text-sm">
        If the player doesn’t have an account yet, use the manual invite option to generate a link you can share with
        them.
        <br />
        If the player is already registered, just search for their name and add them directly.
      </h3>
    </div>
  );
}
