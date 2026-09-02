import React, { useState } from 'react';
import { ArrowRight, Volume2, Lock, Star, Sparkles, User } from 'lucide-react';
import { BodyPartItem, UserProfile } from '../types';
import { speakEnglish, soundEffects } from '../lib/sound';

interface BodyPartsSectionProps {
  bodyParts: BodyPartItem[];
  user: UserProfile;
  onBack: () => void;
  onOpenPremium: () => void;
}

export const BodyPartsSection: React.FC<BodyPartsSectionProps> = ({
  bodyParts,
  user,
  onBack,
  onOpenPremium
}) => {
  const [selectedPart, setSelectedPart] = useState<BodyPartItem>(bodyParts[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSelectPart = (item: BodyPartItem) => {
    if (item.isPremium && !user.isPremium) {
      soundEffects.playPop();
      onOpenPremium();
      return;
    }
    soundEffects.playPop();
    setSelectedPart(item);
    playPart(item);
  };

  const playPart = async (item: BodyPartItem) => {
    setIsPlaying(true);
    await speakEnglish(`${item.name}. This is my ${item.name}.`);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => {
            soundEffects.playPop();
            onBack();
          }}
          className="flex items-center gap-2 bg-white hover:bg-amber-50 text-slate-700 font-bold px-4 py-2 rounded-2xl border border-amber-200 transition-colors shadow-xs"
        >
          <ArrowRight className="w-5 h-5 text-amber-600" />
          <span>العودة للرئيسية</span>
        </button>

        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2 justify-center">
            <span>👋</span>
            <span>أجزاء الجسم (Body Parts)</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            تعرف على أجزاء جسم الإنسان وتحدث بها بثقة!
          </p>
        </div>

        <div className="bg-amber-100 text-amber-900 font-bold text-xs px-3 py-1.5 rounded-2xl">
          أجزاء جسمي 👦
        </div>
      </div>

      {selectedPart && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div 
              className="md:col-span-5 h-60 rounded-3xl bg-gradient-to-tr from-amber-50 via-yellow-50 to-orange-50 border-2 border-dashed border-amber-300 flex flex-col items-center justify-center p-6 cursor-pointer group"
              onClick={() => playPart(selectedPart)}
            >
              <span className="text-8xl mb-2 group-hover:scale-125 transition-transform duration-300">
                {selectedPart.emoji}
              </span>
              <span className="text-xs font-bold text-amber-800 bg-white px-3 py-1 rounded-full shadow-xs">
                {selectedPart.descriptionAr}
              </span>
            </div>

            <div className="md:col-span-7 space-y-4">
              <div>
                <h3 className="text-3xl sm:text-4xl font-black text-slate-800 font-display">
                  {selectedPart.name}
                </h3>
                <p className="text-xl font-bold text-amber-600">
                  {selectedPart.arabicName}
                </p>
              </div>

              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                <span className="text-xs font-bold text-amber-800 block mb-1">جملة للتحدث:</span>
                <p className="text-base font-black text-amber-950 font-display" dir="ltr">
                  "I can point to my {selectedPart.name}!"
                </p>
                <p className="text-xs font-bold text-amber-700 mt-1">
                  أستطيع أن أشير إلى {selectedPart.arabicName}!
                </p>
              </div>

              <button
                onClick={() => playPart(selectedPart)}
                disabled={isPlaying}
                className="w-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-extrabold text-base py-3 px-5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Volume2 className="w-6 h-6 animate-bounce" />
                <span>اسمع النطق 🔊</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Body Parts Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {bodyParts.map((item) => {
          const isSelected = selectedPart?.id === item.id;
          const isLocked = item.isPremium && !user.isPremium;

          return (
            <button
              key={item.id}
              onClick={() => handleSelectPart(item)}
              className={`relative p-5 rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-2 bg-white ${
                isSelected 
                  ? 'border-amber-500 shadow-md scale-105 bg-amber-50/50' 
                  : 'border-slate-200 hover:border-amber-300'
              }`}
            >
              {isLocked && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <Lock className="w-2.5 h-2.5" />
                </div>
              )}
              <span className="text-5xl hover:scale-110 transition-transform">
                {item.emoji}
              </span>
              <div className="text-center">
                <span className="font-black text-base text-slate-800 block font-display">
                  {item.name}
                </span>
                <span className="text-xs font-bold text-slate-500 block">
                  {item.arabicName}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
