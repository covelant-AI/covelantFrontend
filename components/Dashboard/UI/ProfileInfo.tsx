// ProfileInfo.tsx
import Image from "next/image";

interface ProfileInfoProps {
  avatarSrc: string | undefined;
  firstName: string;
  lastName: string;
}

const ProfileInfo = ({  avatarSrc, firstName, lastName }: ProfileInfoProps) => (
    <>
    <div className="w-18 h-18 rounded-2xl overflow-hidden flex justify-center items-center">
      <Image
        src={avatarSrc || "/images/default-avatar.png"}
        alt="Profile picture"
        width={72}
        height={72}
        className="object-cover w-full h-full"
        />
    </div>
    <h3 className="text-xl font-semibold text-gray-800">
      {firstName ?? 'No Player'}
      <br />
      <span className='font-bold'>{lastName ?? 'selected'}</span>
    </h3>
    </>
);

export default ProfileInfo;


