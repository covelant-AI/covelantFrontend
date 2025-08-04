'use client';
import { useEffect, useState } from 'react';
import ProductDisplay from "@/components/Stripe/ProductDisplay";
import { useAuth } from '@/app/context/AuthContext';
import clsx from 'clsx';

const featuresList = [
  { name: 'Dead time Detection', cost: 0 },
  { name: 'Cut Away Dead Time', cost: 20 },
  { name: 'Track Ball Speed', cost: 40 },
  { name: 'Track Player Speed', cost: 40 },
];

interface AiFeatureSelectorProps {
  onFeatureChange: (features: string[]) => void;
  onSubmit: ( features: string[]) => void;
}

export default function AiFeatureSelector({ onFeatureChange, onSubmit }: AiFeatureSelectorProps) {
  const [credits, setCredits] = useState<number>(0);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['Dead time Detection']);
  const [levelKey, setLevelKey] = useState<number>(0);
  const {profile} = useAuth();  

  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/getUser?email=${encodeURIComponent(profile.email)}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      const user = await res.json();
      setCredits(user?.data.credits || 0);
    } catch (error) {
      console.error('Failed to fetch user credits:', error);
    }
  };

  useEffect(() => {
    if (profile?.email) {
      fetchUser();
    }
  }, [profile?.email]);


  useEffect(() => {
    onFeatureChange(selectedFeatures);
  }, [selectedFeatures, onFeatureChange]);

  const toggleFeature = (featureName: string) => {
    setSelectedFeatures(prev => {
      const updated = prev.includes(featureName)
        ? prev.filter(f => f !== featureName)
        : [...prev, featureName];

      setLevelKey(prevKey => prevKey + 1);
      return updated;
    });
  };

  const usedCredits = selectedFeatures.reduce((total, featureName) => {
    const feature = featuresList.find(f => f.name === featureName);
    return total + (feature?.cost || 0);
  }, 0);

  const getImageName = (count: number) => {
    switch (count) {
      case 1: return 'freshman';
      case 2: return 'apprentice';
      case 3: return 'athlete';
      case 4: return 'challanger';
      default: return 'freshman';
    }
  };

  const handleSubmit = async () => {
    if (usedCredits > credits) {
      setShowPopup(true);
      return;
    }

    try {
      const res = await fetch('/api/updateCredits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: profile.email,
          usedCredits,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error('Credit update failed:', err.message || 'Unknown error');
        alert('Something went wrong updating your credits.');
        return;
      }

      setCredits((prev) => prev - usedCredits); // Optimistic UI update
      onSubmit(selectedFeatures);
    } catch (error) {
      console.error('Error while updating credits:', error);
      alert('Unable to update credits. Please try again.');
    }
  };


  const currentImageName = getImageName(selectedFeatures.length);

  return (
    <div className="bg-white p-3 rounded-2xl w-full max-w-lg text-center">
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 transition-opacity duration-300">
          <div
            className={clsx(
              "bg-white rounded-lg p-6 max-w-2xl w-full shadow-lg relative",
              "transform transition-all duration-300 scale-95 opacity-0 animate-popup"
            )}
          >
            <button
              onClick={() => {
                setShowPopup(false);
                setTimeout(() => fetchUser(), 100); // slight delay ensures popup closes smoothly
              }}
              className="absolute top-2 right-2 text-gray-600 p-2 hover:cursor-pointer hover:text-red-500 text-4xl"
              aria-label="Close"
            >
              &times;
            </button>
            <ProductDisplay />
          </div>
        </div>
      )}
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Match</h2>
      <div className="flex items-center justify-center gap-2 mb-6">
        <span className="text-md font-semibold text-gray-500">Your Credits:</span>
        <div className="bg-teal-400 text-teal-700 font-bold px-4 py-2 rounded-lg text-sm">
          <img
            src={`/icons/credits.png`}
            className="h-4 w-4 inline-block mr-1"
          />
          {credits}
        </div>
          <div
            onClick={() => setShowPopup(true)}
            className="active:scale-[0.9] w-10 h-10 flex items-center justify-center border-2 border-[#E7E7E7] rounded-xl bg-white hover:bg-[#42B6B1] 
            cursor-pointer hover:text-white transition-colors duration-300"
          >
            <svg
              className="w-5 h-5 stroke-black"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>

      </div>

      <div className="text-left text-lg text-black font-semibold mb-2 flex items-center justify-between">
        <span>AI features</span>
      </div>

      <div className='flex flex-row gap-6 items-center justify-between mb-4'>
        <div className="grid grid-cols-1 gap-3 text-left mb-4">
          {featuresList.map((feature) => (
            <label key={feature.name} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFeatures.includes(feature.name)}
                onChange={() => toggleFeature(feature.name)}
                className="w-5 h-5 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
              />
              <span className="text-gray-700">
                {feature.name}
              </span>
            </label>
          ))}
        </div>

        <div className="flex justify-center my-4 relative w-fit group">
          <img
            key={`avatar-${levelKey}`}
            src={`/images/Ai/${currentImageName}.png`}
            alt="Player Avatar"
            className={clsx(
              "w-40 h-52 transition-all duration-500 ease-in-out transform",
              "animate-fade-scale"
            )}
          />
          <img
            key={`overlay-${levelKey}`}
            src={`/images/Ai/text-${currentImageName}.png`}
            alt="Overlay"
            className="absolute bottom-0 left-0 w-full h-auto transition-all duration-200 ease-in-in"
          />
        </div>
      </div>

      <p className="text-xs text-gray-500 mb-4">
        You’ll use <span className="font-semibold text-gray-800">{usedCredits}</span> credits
      </p>

      <button
        className="w-1/2 bg-teal-400 text-white font-semibold py-2 rounded-lg hover:bg-cyan-600 transition-all"
        disabled={selectedFeatures.length === 0}
        onClick={handleSubmit}
      >
        Fisnish Upload
      </button>
    </div>
  );
}
