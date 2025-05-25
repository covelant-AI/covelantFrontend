'use client';
import Image from "next/image";
import Link from "next/link";
import UploadVideo from "@/components/UI/uploadVideo";
import MatchData from "@/components/UI/MatchData";

export default function UploadMatchPage() {

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-20 py-10">
      {/* Header */}
      <div className="mb-8 text-center flex flex-col items-center">
        <div className="w-screen flex justify-start px-40">
            <Link href="/">
                <button className="px-6 py-4 rounded-xl bg-white shadow-md hover:bg-gray-100 transition-colors 
                    duration-200 hover:scale-105 hover:cursor-pointer active:scale-95 transition-transform">
                  <Image src="/icons/backArrow.svg" alt="Back" width={20} height={20} />
                </button>
            </Link>
        </div>
        <span>
        <h1 className="text-5xl font-bold text-gray-900">Upload Match Video</h1>
        <p className="text-lg text-gray-400 mt-2">
          Pick a video of a match you would like to analyze and <br/> make sure that the video satisfies the requirements.
        </p>
        </span>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Upload Section */}
        <UploadVideo
          onVideoUpload={(url, thumbnail) => {
            console.log("Video URL:", url);
            console.log("Thumbnail:", thumbnail);
          }}
        />

        {/* Match Data Section */}
        <MatchData/>
      </div>
      {/* Next Button */}
        <button className="bg-[#4DBAB5] mt-6 text-xl px-20 py-2 rounded-xl cursor-pointer 
        hover:bg-teal-600 transition-colors duration-300 active:scale-95 transition-transform">
          Next
        </button>
    </div>
  );
}
