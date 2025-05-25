'use client';
import React, { useRef, useState } from "react";
import Image from "next/image";

interface UploadVideoProps {
  onVideoUpload: (videoURL: string, videoThumbnail: string) => void;
}

export default function UploadVideo({ onVideoUpload }: UploadVideoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [highlight, setHighlight] = useState(false);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null);

  const simulateUpload = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) clearInterval(interval);
    }, 200);
  };

const extractThumbnail = (videoFile: File, url: string) => {
  const video = document.createElement("video");
  video.src = url;
  video.crossOrigin = "anonymous";
  video.muted = true;
  video.playsInline = true;

  // Wait until video metadata is loaded (duration, dimensions)
  video.addEventListener("loadedmetadata", () => {
    // Seek to 0.1 seconds to ensure we get a non-black frame
    video.currentTime = 0.1;
  });

  video.addEventListener("seeked", () => {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageUrl = canvas.toDataURL("image/jpeg");
      setVideoThumbnail(imageUrl);
      onVideoUpload(url, imageUrl); // Send to parent
    }
  });
};

  const handleVideoFile = (file: File) => {
    if (file && file.type.startsWith("video/")) {
      const url = URL.createObjectURL(file);
      setVideoURL(url);
      setUploadProgress(0);
      simulateUpload();
      extractThumbnail(file, url);
    } else {
      alert("Please upload a valid video file.");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setHighlight(false);
    const file = e.dataTransfer.files[0];
    handleVideoFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleVideoFile(file);
  };

  return (
    <div
      className={`relative flex items-center justify-center border-2 border-dashed ${
        highlight ? "border-blue-400 bg-blue-50" : "border-[#4DBAB5] bg-gray-100"
      } rounded-xl p-6 h-[420px] cursor-pointer transition-colors duration-300 w-full max-w-xl overflow-hidden`}
      onClick={() => fileInputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setHighlight(true);
      }}
      onDragLeave={() => setHighlight(false)}
    >
      {!videoThumbnail ? (
        <div className="text-center text-black">
          <Image className="mx-auto mb-4" src="/icons/UploadMatch.svg" alt="upload" width={80} height={50} />
          <p className="text-sm font-medium text-gray-400 underline">click here</p>
          <p className="text-sm text-gray-400">or</p>
          <p className="text-sm underline text-gray-400">drag and drop</p>
        </div>
      ) : (
        <>
          <img
            src={videoThumbnail}
            alt="Video Thumbnail"
            className="absolute inset-0 w-full h-full object-cover rounded-xl"
          />
          {uploadProgress < 100 && (
            <div className="absolute bottom-6 left-6 right-6">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div
                  className="bg-[#4DBAB5] h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-white text-center">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}
        </>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
