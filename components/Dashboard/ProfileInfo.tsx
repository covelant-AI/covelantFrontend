import Image from "next/image";
import { ProfileInfoProps } from "@/util/types/heroSection/sidePannel";

function getDisplayName(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : fallback;
}

export default function ProfileInfo({
  avatarSrc = null,
  firstName = null,
  lastName = null,
  avatarAlt = "Profile picture",
  size = 72,
  className = "",
}: ProfileInfoProps) {
  const safeFirstName = getDisplayName(firstName, "No Player");
  const safeLastName = getDisplayName(lastName, "selected");

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="rounded-lg overflow-hidden flex justify-center items-center"
        style={{ width: size, height: size }}
      >
        <Image
          src={avatarSrc || "/images/default-avatar.png"}
          alt={avatarAlt}
          width={size}
          height={size}
          className="object-cover w-full h-full"
        />
      </div>

      <h3 className="text-xl font-semibold text-gray-800 leading-tight">
        {safeFirstName}
        <br />
        <span className="font-bold">{safeLastName}</span>
      </h3>
    </div>
  );
}
