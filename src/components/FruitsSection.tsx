import React, { useState } from 'react';
import { ArrowRight, Volume2, Lock, Star, Sparkles, Heart } from 'lucide-react';
import { FruitItem, UserProfile } from '../types';
import { speakEnglish, soundEffects } from '../lib/sound';
import confetti from 'canvas-confetti';

interface FruitsSectionProps {
  fruits: FruitItem[];
  user: UserProfile;
  onBack: () => void;
  onOpenPremium: () => void;
}

export const FruitsSection: React.FC<FruitsSectionProps> = ({
  fruits,
  user,
  onBack,
  onOpenPremium
}) => {
  const [selectedFruit, setSelectedFruit] = useState<FruitItem>(fruits[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSelectFruit = (item: FruitItem) => {
    if (item.isPremium && !user.isPremium) {
      soundEffects.playPop();
      onOpenPremium();
      return;
    }
    soundEffects.playPop();
    setSelectedFruit(item);
    playFruit(item);
  };

  const playFruit = async (item: FruitItem) => {
    setIsPlaying(true);
    await speakEnglish(`${item.name}. ${item.name} is sweet and healthy.`);
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
            <span>🍎</span>
            <span>الفواكه اللذيذة (Fruits)</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            تعلم أسماء الفواكه الشهية ومذاقها اللذيذ باللغة الإنجليزية!
          </p>
        </div>

        <div className="bg-rose-100 text-rose-900 font-bold text-xs px-3 py-1.5 rounded-2xl">
          فواكه صحية ومغذية 🍓
        </div>
      </div>

      {selectedFruit && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-rose-200 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div 
              className="md:col-span-5 h-60 rounded-3xl bg-gradient-to-tr from-rose-50 to-amber-50 border-2 border-dashed border-rose-300 flex flex-col items-center justify-center p-6 cursor-pointer group"
              onClick={() => playFruit(selectedFruit)}
            >
              <span className="text-8xl mb-2 group-hover:scale-125 transition-transform duration-300">
                {selectedFruit.emoji}
              </span>
              <span className="text-xs font-bold text-rose-600 bg-white px-3 py-1 rounded-full shadow-xs">
                {selectedFruit.tasteAr}
              </span>
            </div>

            <div className="md:col-span-7 space-y-4">
              <div>
                <h3 className="text-3xl sm:text-4xl font-black text-slate-800 font-display">
                  {selectedFruit.name}
                </h3>
                <p className="text-xl font-bold text-rose-600">
                  {selectedFruit.arabicName}
                </p>
              </div>

              <div className="bg-rose-50 rounded-2xl p-4 border border-rose-200">
                <span className="text-xs font-bold text-rose-800 block mb-1">جملة مفيدة:</span>
                <p className="text-base font-black text-rose-950 font-display" dir="ltr">
                  "I like to eat sweet {selectedFruit.name}!"
                </p>
                <p className="text-xs font-bold text-rose-700 mt-1">
                  أنا أحب أن آكل {selectedFruit.arabicName} اللذيذة!
                </p>
              </div>

              <button
                onClick={() => playFruit(selectedFruit)}
                disabled={isPlaying}
                className="w-full bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-extrabold text-base py-3 px-5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Volume2 className="w-6 h-6 animate-bounce" />
                <span>اسمع نطق الفاكهة 🔊</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fruit Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {fruits.map((item) => {
          const isSelected = selectedFruit?.id === item.id;
          const isLocked = item.isPremium && !user.isPremium;

          return (
            <button
              key={item.id}
              onClick={() => handleSelectFruit(item)}
              className={`relative p-4 rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-2 bg-white ${
                isSelected 
                  ? 'border-rose-500 shadow-md scale-105 bg-rose-50/50' 
                  : 'border-slate-200 hover:border-rose-300'
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
