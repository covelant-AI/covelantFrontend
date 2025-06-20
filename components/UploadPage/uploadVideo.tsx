'use client';
import React, { useRef, useState } from "react";
import Image from "next/image";
import { storage, ref, uploadBytesResumable, getDownloadURL } from "@/app/firebase/config";

interface UploadVideoProps {
  onVideoUpload: (videoURL: string, videoThumbnail: string) => void;
}

export default function UploadVideo({ onVideoUpload }: UploadVideoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [highlight, setHighlight] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const extractThumbnail = (videoFile: File, url: string): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.src = url;
      video.crossOrigin = "anonymous";
      video.muted = true;
      video.playsInline = true;
    
      video.addEventListener("loadedmetadata", () => {
        video.currentTime = 0.1;
      });
    
      video.addEventListener("seeked", () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageUrl = canvas.toDataURL("image/jpeg"); // Get the base64 image
          resolve(imageUrl);
        } else {
          resolve("");
        }
      });
    });
  };
  
  const handleVideoFile = async (file: File) => {
    if (file && file.type.startsWith("video/")) {
      const localUrl = URL.createObjectURL(file);
      const ProfileEmail = sessionStorage.removeItem('userEmail');
      setUploadProgress(0);
    
      // Extract thumbnail first
      const thumbnailDataUrl = await extractThumbnail(file, localUrl);
      setThumbnail(thumbnailDataUrl);
    
      // Convert the thumbnail from base64 (dataURL) to a Blob
      const thumbnailBlob = dataURLtoBlob(thumbnailDataUrl);
    
      // Upload thumbnail to Firebase Storage (as a Blob)
      const thumbNailRef = ref(storage, `thumbnails/${ProfileEmail}_${Date.now()}_${file.name}`);
      const uploadTask1 = uploadBytesResumable(thumbNailRef, thumbnailBlob);
    
      // Upload video to Firebase Storage (as a File)
      const videoRef = ref(storage, "videos/" + file.name);
      const uploadTask2 = uploadBytesResumable(videoRef, file);
    
      uploadTask2.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Error uploading video:", error);
          alert("Upload failed: " + error.message);
        },
        async () => {
          const downloadVideoURL = await getDownloadURL(uploadTask2.snapshot.ref);
          const downloadThumbnailURL = await getDownloadURL(uploadTask1.snapshot.ref);
        
          // Call onVideoUpload once both are ready
          onVideoUpload(downloadVideoURL, downloadThumbnailURL);
        }
      );
    } else {
      alert("Please upload a valid video file.");
    }
  };
  
  // Helper function to convert dataURL to Blob
  const dataURLtoBlob = (dataUrl: string) => {
    const byteString = atob(dataUrl.split(",")[1]); // Remove the data URL prefix
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i);
    }
    return new Blob([arrayBuffer], { type: "image/jpeg" });
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
    <>
    {/* For small screens, show only the upload button */}
    <div className="md:hidden w-full items-center justify-center flex flex-col mb-2">
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center px-20 py-3 border border-dashed border-r-2 bg-[#FEFEFE] w-full justify-center text-black font-bold text-lg rounded-t-lg hover:bg-gray-100 transition-colors duration-300 active:scale-95 transition-transform"
        style={uploadProgress === 100 ? { borderColor: "#6EB6B3", borderStyle: "solid", borderWidth: "1px" } : {}}
      >
        <Image 
          className="w-4 h-5 mr-5" 
          src="https://firebasestorage.googleapis.com/v0/b/fir-auth-f8ffb.firebasestorage.app/o/images%2Ficons%2Fupload2.png?alt=media&token=e1f0ff19-b255-4721-a378-ef6bdcb9f69b" 
          width={50} height={50} 
          alt="Upload Icon" 
        />
        Upload Match
      </button>
      
      {/* Display the video filename and progress bar */}
      {thumbnail && (
        <div className="md:hidden w-full border border-[#6EB6B3] rounded-b-lg p-4">
          <div className="text-center text-black font-bold">
            <p className="text-sm">{uploadProgress===100 ? "File Uploaded: " + "CovMatch[#].mp4" : "Uploading..."}</p>
            {/* Only show the progress bar if uploading */}
            {uploadProgress < 100 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-[#4DBAB5] h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>

    <div
      className={`max-md:hidden relative flex items-center justify-center border-2 border-dashed ${
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
      {!thumbnail ? (
        <div className="text-center text-black">
          <Image className="mx-auto mb-4" src="/icons/UploadMatch.svg" alt="upload" width={80} height={50} />
          <p className="text-sm font-medium text-gray-400 underline">click here</p>
          <p className="text-sm text-gray-400">or</p>
          <p className="text-sm underline text-gray-400">drag and drop</p>
        </div>
      ) : (
        <>
          <img
            src={thumbnail}
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
                Uploading... {uploadProgress.toFixed(0)}%
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
  </>
  );
}

