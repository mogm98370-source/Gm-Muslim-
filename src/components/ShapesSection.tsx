import React, { useState } from 'react';
import { ArrowRight, Volume2, Lock, Star, Sparkles, Shapes } from 'lucide-react';
import { ShapeItem, UserProfile } from '../types';
import { speakEnglish, soundEffects } from '../lib/sound';

interface ShapesSectionProps {
  shapes: ShapeItem[];
  user: UserProfile;
  onBack: () => void;
  onOpenPremium: () => void;
}

export const ShapesSection: React.FC<ShapesSectionProps> = ({
  shapes,
  user,
  onBack,
  onOpenPremium
}) => {
  const [selectedShape, setSelectedShape] = useState<ShapeItem>(shapes[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSelectShape = (item: ShapeItem) => {
    if (item.isPremium && !user.isPremium) {
      soundEffects.playPop();
      onOpenPremium();
      return;
    }
    soundEffects.playPop();
    setSelectedShape(item);
    playShape(item);
  };

  const playShape = async (item: ShapeItem) => {
    setIsPlaying(true);
    await speakEnglish(`${item.name}. ${item.sides > 0 ? `It has ${item.sides} sides.` : 'It is a round shape.'}`);
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
            <span>🔵</span>
            <span>الأشكال الهندسية (Shapes)</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            تعرف على الدائرة والمربع والمثلث والنجمة والقلب بالإنجليزية!
          </p>
        </div>

        <div className="bg-purple-100 text-purple-900 font-bold text-xs px-3 py-1.5 rounded-2xl">
          أشكال هندسية ممتعة 🔺
        </div>
      </div>

      {selectedShape && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-purple-200 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div 
              className="md:col-span-5 h-60 rounded-3xl bg-gradient-to-tr from-purple-50 via-indigo-50 to-pink-50 border-2 border-dashed border-purple-300 flex flex-col items-center justify-center p-6 cursor-pointer group"
              onClick={() => playShape(selectedShape)}
            >
              <span className="text-8xl mb-2 group-hover:scale-125 transition-transform duration-300">
                {selectedShape.emoji}
              </span>
              <span className="text-xs font-bold text-purple-700 bg-white px-3 py-1 rounded-full shadow-xs">
                {selectedShape.sides > 0 ? `عدد الأضلاع: ${selectedShape.sides}` : 'شكل منحني / بدون أضلاع'}
              </span>
            </div>

            <div className="md:col-span-7 space-y-4">
              <div>
                <h3 className="text-3xl sm:text-4xl font-black text-slate-800 font-display">
                  {selectedShape.name}
                </h3>
                <p className="text-xl font-bold text-purple-600">
                  {selectedShape.arabicName}
                </p>
              </div>

              <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200">
                <span className="text-xs font-bold text-purple-800 block mb-1">وصف الشكل:</span>
                <p className="text-base font-black text-purple-950 font-display" dir="ltr">
                  "This is a {selectedShape.name}."
                </p>
              </div>

              <button
                onClick={() => playShape(selectedShape)}
                disabled={isPlaying}
                className="w-full bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-extrabold text-base py-3 px-5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Volume2 className="w-6 h-6 animate-bounce" />
                <span>اسمع نطق الشكل 🔊</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shapes Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {shapes.map((item) => {
          const isSelected = selectedShape?.id === item.id;
          const isLocked = item.isPremium && !user.isPremium;

          return (
            <button
              key={item.id}
              onClick={() => handleSelectShape(item)}
              className={`relative p-5 rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-2 bg-white ${
                isSelected 
                  ? 'border-purple-600 shadow-md scale-105 bg-purple-50/50' 
                  : 'border-slate-200 hover:border-purple-300'
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
