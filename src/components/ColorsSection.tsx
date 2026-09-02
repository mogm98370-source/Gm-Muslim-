import React, { useState } from 'react';
import { ArrowRight, Volume2, Star, Sparkles, Check, HelpCircle } from 'lucide-react';
import { ColorItem, UserProfile } from '../types';
import { speakEnglish, soundEffects } from '../lib/sound';
import confetti from 'canvas-confetti';

interface ColorsSectionProps {
  colors: ColorItem[];
  user: UserProfile;
  onBack: () => void;
  onReward: (stars: number) => void;
}

export const ColorsSection: React.FC<ColorsSectionProps> = ({
  colors,
  user,
  onBack,
  onReward
}) => {
  const [selectedColor, setSelectedColor] = useState<ColorItem>(colors[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [quizTarget, setQuizTarget] = useState<ColorItem | null>(null);
  const [quizOptions, setQuizOptions] = useState<ColorItem[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const handleSelectColor = (item: ColorItem) => {
    soundEffects.playPop();
    setSelectedColor(item);
    playColorAudio(item);
  };

  const playColorAudio = async (item: ColorItem) => {
    setIsPlayingAudio(true);
    await speakEnglish(`${item.name}. ${item.exampleItem}.`);
    setIsPlayingAudio(false);
  };

  const startQuiz = () => {
    soundEffects.playPop();
    const target = colors[Math.floor(Math.random() * colors.length)];
    setQuizTarget(target);
    const others = colors.filter(c => c.id !== target.id).sort(() => 0.5 - Math.random()).slice(0, 3);
    const opts = [target, ...others].sort(() => 0.5 - Math.random());
    setQuizOptions(opts);
    setFeedback(null);
    setQuizMode(true);
    speakEnglish(`Show me: ${target.name}`);
  };

  const handleQuizChoice = (item: ColorItem) => {
    if (!quizTarget) return;
    if (item.id === quizTarget.id) {
      soundEffects.playSuccess();
      setFeedback('correct');
      confetti({ particleCount: 40, spread: 60 });
      onReward(5);
      setTimeout(() => {
        startQuiz();
      }, 1500);
    } else {
      soundEffects.playError();
      setFeedback('wrong');
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
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
            <span>🎨</span>
            <span>الألوان المبهجة (Colors)</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            تعرف على أسماء الألوان بالإنجليزية مع النطق وأمثلة حية!
          </p>
        </div>

        <button
          onClick={startQuiz}
          className="bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs px-3 sm:px-4 py-2 rounded-2xl shadow-sm flex items-center gap-1.5 transition-all"
        >
          <HelpCircle className="w-4 h-4" />
          <span>لعبة الألوان 🎮</span>
        </button>
      </div>

      {/* Quiz Area */}
      {quizMode && quizTarget && (
        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
              تحدي الألوان السريع 🎯
            </span>
            <button
              onClick={() => setQuizMode(false)}
              className="text-xs bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-xl"
            >
              إغلاق ✕
            </button>
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black">
              أين اللون: <span className="underline font-display">{quizTarget.name}</span> ({quizTarget.arabicName})؟
            </h3>
            <button
              onClick={() => speakEnglish(quizTarget.name)}
              className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-xl text-xs font-bold"
            >
              <Volume2 className="w-4 h-4" />
              <span>استمع مجدداً</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto pt-2">
            {quizOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleQuizChoice(opt)}
                className="h-24 rounded-2xl shadow-md border-4 border-white/80 hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center text-3xl"
                style={{ backgroundColor: opt.hex }}
              >
                <span>{opt.emoji}</span>
              </button>
            ))}
          </div>

          {feedback === 'correct' && (
            <p className="text-center font-black text-amber-200 text-lg animate-bounce">
              🎉 رائع جداً! إجابة صحيحة ⭐
            </p>
          )}
          {feedback === 'wrong' && (
            <p className="text-center font-bold text-white text-sm">
              حاول مرة أخرى يا بطل! 🎨
            </p>
          )}
        </div>
      )}

      {/* Main Focus Color Stage */}
      {selectedColor && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Color Big Visual Card */}
            <div 
              className="md:col-span-5 h-64 rounded-3xl flex flex-col items-center justify-center p-6 shadow-inner border-4 border-white text-center transition-all cursor-pointer group"
              style={{ backgroundColor: selectedColor.hex }}
              onClick={() => playColorAudio(selectedColor)}
            >
              <span className="text-6xl mb-2 group-hover:scale-125 transition-transform">
                {selectedColor.emoji}
              </span>
              <h3 className={`text-4xl font-black font-display tracking-wide ${selectedColor.textColor}`}>
                {selectedColor.name}
              </h3>
              <p className={`text-xl font-bold ${selectedColor.textColor} opacity-90`}>
                {selectedColor.arabicName}
              </p>
            </div>

            {/* Audio & Details */}
            <div className="md:col-span-7 space-y-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-500">مثال من الطبيعة:</span>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{selectedColor.emoji}</span>
                  <div>
                    <span className="text-lg font-black text-slate-800 block">
                      {selectedColor.exampleItem}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      مثل هذا العنصر اللطيف
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => playColorAudio(selectedColor)}
                disabled={isPlayingAudio}
                className="w-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-extrabold text-base py-3 px-5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Volume2 className="w-6 h-6 animate-bounce" />
                <span>اسمع نطق اللون 🔊</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Colors Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {colors.map((c) => {
          const isSelected = selectedColor?.id === c.id;
          return (
            <button
              key={c.id}
              onClick={() => handleSelectColor(c)}
              className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                isSelected 
                  ? 'border-slate-800 shadow-lg scale-105 bg-white' 
                  : 'border-slate-200 bg-white hover:border-amber-400'
              }`}
            >
              <div 
                className="w-14 h-14 rounded-2xl shadow-sm flex items-center justify-center text-2xl border-2 border-white/60"
                style={{ backgroundColor: c.hex }}
              >
                {c.emoji}
              </div>
              <div className="text-center">
                <span className="font-black text-base text-slate-800 block font-display">
                  {c.name}
                </span>
                <span className="text-xs font-bold text-slate-500 block">
                  {c.arabicName}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
