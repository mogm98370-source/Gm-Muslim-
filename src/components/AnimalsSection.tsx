import React, { useState } from 'react';
import { ArrowRight, Volume2, Lock, Star, Sparkles, Heart } from 'lucide-react';
import { AnimalItem, UserProfile } from '../types';
import { speakEnglish, soundEffects } from '../lib/sound';
import confetti from 'canvas-confetti';

interface AnimalsSectionProps {
  animals: AnimalItem[];
  user: UserProfile;
  onBack: () => void;
  onOpenPremium: () => void;
  onReward: (stars: number) => void;
}

export const AnimalsSection: React.FC<AnimalsSectionProps> = ({
  animals,
  user,
  onBack,
  onOpenPremium,
  onReward
}) => {
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalItem>(animals[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSelectAnimal = (item: AnimalItem) => {
    if (item.isPremium && !user.isPremium) {
      soundEffects.playPop();
      onOpenPremium();
      return;
    }
    soundEffects.playPop();
    setSelectedAnimal(item);
    playAnimal(item);
  };

  const playAnimal = async (item: AnimalItem) => {
    setIsPlaying(true);
    await speakEnglish(`${item.name}. ${item.sound}`);
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
            <span>🐶</span>
            <span>عالم الحيوانات (Animals)</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            تعرف على أسماء الحيوانات بالإنجليزية واستمع لأصواتها اللطيفة!
          </p>
        </div>

        <div className="bg-emerald-100 text-emerald-900 font-bold text-xs px-3 py-1.5 rounded-2xl">
          {animals.length} حيوانات لطيفة 🐾
        </div>
      </div>

      {/* Selected Animal Showcase */}
      {selectedAnimal && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div 
              className="md:col-span-5 h-60 rounded-3xl bg-gradient-to-tr from-emerald-50 via-teal-50 to-cyan-50 border-2 border-dashed border-emerald-300 flex flex-col items-center justify-center p-6 cursor-pointer group"
              onClick={() => playAnimal(selectedAnimal)}
            >
              <span className="text-8xl mb-2 group-hover:scale-125 transition-transform duration-300">
                {selectedAnimal.emoji}
              </span>
              <span className="text-xs font-bold text-emerald-600 bg-white px-3 py-1 rounded-full shadow-xs">
                الصوت: {selectedAnimal.sound}
              </span>
            </div>

            <div className="md:col-span-7 space-y-4">
              <div>
                <h3 className="text-3xl sm:text-4xl font-black text-slate-800 font-display">
                  {selectedAnimal.name}
                </h3>
                <p className="text-xl font-bold text-emerald-600">
                  {selectedAnimal.arabicName}
                </p>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
                <span className="text-xs font-bold text-emerald-800 block mb-1">ماذا يقول هذا الحيوان؟</span>
                <p className="text-base font-black text-emerald-950 font-display" dir="ltr">
                  The {selectedAnimal.name} says: "{selectedAnimal.sound}"
                </p>
              </div>

              <button
                onClick={() => playAnimal(selectedAnimal)}
                disabled={isPlaying}
                className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-extrabold text-base py-3 px-5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Volume2 className="w-6 h-6 animate-bounce" />
                <span>اسمع صوت الحيوان واسمه 🔊</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animal Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {animals.map((item) => {
          const isSelected = selectedAnimal?.id === item.id;
          const isLocked = item.isPremium && !user.isPremium;

          return (
            <button
              key={item.id}
              onClick={() => handleSelectAnimal(item)}
              className={`relative p-4 rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-2 bg-white ${
                isSelected 
                  ? 'border-emerald-500 shadow-md scale-105 bg-emerald-50/50' 
                  : 'border-slate-200 hover:border-emerald-300'
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
