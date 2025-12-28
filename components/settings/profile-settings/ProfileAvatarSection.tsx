import Image from "next/image";
import { PropsProfileAvatarSection } from "../types/types";

export function ProfileAvatarSection({
  form,
  onChangePicture,
  onDeletePicture,
  fileInputRef,
  onFileSelected,
}: PropsProfileAvatarSection) {
  return (
    <>
      <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={onFileSelected} />

      <div className="col-span-1 flex flex-row justify-center items-center space-x-4 max-md:flex-col max-md:items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg max-md:mb-4 max-md:mr-0">
          <Image
            src={form.avatar || "/images/default-avatar.png"}
            alt="Profile"
            width={500}
            height={500}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="flex space-x-4">
          <button
            onClick={onChangePicture}
            className="bg-[#42B6B1] text-white px-4 py-1 rounded-md hover:bg-teal-600 transition"
            type="button"
          >
            Change Picture  
          </button>
          <button
            onClick={onDeletePicture}
            className="border border-gray-100 bg-[#F9F9F9] text-red-500 font-semibold px-4 py-1 rounded-md hover:bg-red-50 transition"
            type="button"
          >
            Delete Picture
          </button>
        </div>
      </div>
    </>
  );
}
