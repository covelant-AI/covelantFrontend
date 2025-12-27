"use client";
import { Clock } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { MatchDisplay } from '@/util/interfaces';

interface VideoPreviewModalProps {
  match: MatchDisplay | null;
  isOpen: boolean;
  onClose: () => void;
  backgroundImageUrl?: string;
  matchDate?: string;
  matchDuration?: string;
  playerOneName?: string;
  playerTwoName?: string;
}

export default function VideoPreviewModal({
  match,
  isOpen,
  onClose,
  backgroundImageUrl,
  matchDate,
  matchDuration,
  playerOneName,
  playerTwoName,
}: VideoPreviewModalProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !match || !mounted) return null;

  const handleMatchHighlight = () => {
    router.push(`/matches/${match.id}`);
    onClose();
  };

  const handleAnalytics = () => {
    router.push(`/matches/${match.id}`);
    onClose();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    } catch {
      return dateString;
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm bg-black/60 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-2xl text-2xl text-white overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background video/image with overlay */}
        <div className="relative w-full h-[600px]">
          {backgroundImageUrl ? (
            <Image
              src={backgroundImageUrl}
              alt={match.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
          )}

          {/* Dark overlay with linear gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, #000000 14%, rgba(0, 0, 0, 0.41) 65%, rgba(0, 0, 0, 0) 100%)'
            }}
          />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-between px-20 py-16">
            <div>
              <div className="flex justify-between items-center pb-16">
                {/* Player names */}
                <h2 className="text-4xl md:text-5xl font-bold">
                  {playerOneName && (
                    <>
                      {playerOneName}
                      {playerTwoName && (
                        <>
                          {' '}
                          <span className="font-normal">vs</span>
                          {' '}
                          {playerTwoName}
                        </>
                      )}
                    </>
                  )}
                  {!playerOneName && !playerTwoName && match.title}
                </h2>

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-white/10 cursor-pointer"
                  aria-label="Close"
                >
                  <Image
                    src="/icons/X.svg"
                    alt="Close"
                    width={30}
                    height={30}
                    className="w-8 h-8"
                  />
                </button>
              </div>

              <div className="flex flex-col gap-4 ">
                {/* Action buttons */}
                <div className="flex gap-8">
                  <button
                    onClick={handleMatchHighlight}
                    className="flex items-center gap-3 bg-[#42B6B1] hover:bg-[#3aa5a0] px-[22px] py-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <Image
                      src="/icons/play.svg"
                      alt="Play"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                    <span className="font-bold">Match Highlight</span>
                  </button>

                  <button
                    onClick={handleAnalytics}
                    className="flex items-center gap-3 bg-[#42B6B1] hover:bg-[#3aa5a0] px-[22px] py-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <Image
                      src="/icons/analytics.svg"
                      alt="Analytics"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                    <span className="font-bold">Analytics</span>
                  </button>
                </div>

                {/* Descriptive text */}
                <p className="font-medium">
                  Watch your best moments or dive deep into <br /> your match analysis.
                </p>
              </div>
            </div>

            {/* Match information */}
            <div className="flex items-center font-medium">
              {matchDate && (
                <span>
                  {formatDate(matchDate)}
                </span>
              )}
              {matchDuration && (
                  <span className="pl-2">⊙ {matchDuration}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

