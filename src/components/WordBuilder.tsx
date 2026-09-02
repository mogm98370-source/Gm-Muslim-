import React, { useState, useEffect } from 'react';
import { ArrowRight, Volume2, Star, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';
import { speakEnglish, soundEffects } from '../lib/sound';
import confetti from 'canvas-confetti';

interface WordBuilderProps {
  user: UserProfile;
  onBack: () => void;
  onReward: (stars: number) => void;
}

export const WordBuilder: React.FC<WordBuilderProps> = ({
  user,
  onBack,
  onReward
}) => {
  const wordPuzzles = [
    { word: 'APPLE', arabic: 'تفاحة', emoji: '🍎' },
    { word: 'BALL', arabic: 'كرة', emoji: '⚽' },
    { word: 'CAT', arabic: 'قطة', emoji: '🐱' },
    { word: 'DOG', arabic: 'كلب', emoji: '🐶' },
    { word: 'SUN', arabic: 'شمس', emoji: '☀️' },
    { word: 'STAR', arabic: 'نجمة', emoji: '⭐' },
    { word: 'FISH', arabic: 'سمكة', emoji: '🐟' },
    { word: 'MILK', arabic: 'حليب', emoji: '🥛' },
    { word: 'BOOK', arabic: 'كتاب', emoji: '📖' },
    { word: 'CAR', arabic: 'سيارة', emoji: '🚗' }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState<{ char: string; originalIdx: number }[]>([]);
  const [availableLetters, setAvailableLetters] = useState<{ char: string; originalIdx: number }[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const currentPuzzle = wordPuzzles[currentIndex];

  useEffect(() => {
    initPuzzle();
  }, [currentIndex]);

  const initPuzzle = () => {
    const letters = currentPuzzle.word.split('').map((char, idx) => ({ char, originalIdx: idx }));
    // Scramble letters
    const scrambled = [...letters].sort(() => 0.5 - Math.random());
    setAvailableLetters(scrambled);
    setSelectedLetters([]);
    setIsSuccess(false);
  };

  const handlePickLetter = (item: { char: string; originalIdx: number }) => {
    soundEffects.playPop(500 + selectedLetters.length * 80);
    const newSelected = [...selectedLetters, item];
    setSelectedLetters(newSelected);
    setAvailableLetters(prev => prev.filter(l => l.originalIdx !== item.originalIdx));

    // Check if word complete
    if (newSelected.length === currentPuzzle.word.length) {
      const assembledWord = newSelected.map(l => l.char).join('');
      if (assembledWord === currentPuzzle.word) {
        setIsSuccess(true);
        soundEffects.playSuccess();
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
        onReward(5);
        speakEnglish(currentPuzzle.word);
      } else {
        soundEffects.playError();
        // Reset after short delay
        setTimeout(() => {
          initPuzzle();
        }, 1000);
      }
    }
  };

  const handleRemoveLetter = (item: { char: string; originalIdx: number }) => {
    soundEffects.playPop();
    setSelectedLetters(prev => prev.filter(l => l.originalIdx !== item.originalIdx));
    setAvailableLetters(prev => [...prev, item]);
  };

  const handleNext = () => {
    soundEffects.playPop();
    setCurrentIndex(prev => (prev + 1) % wordPuzzles.length);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-3xl mx-auto">
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
            <span>🧩</span>
            <span>كوّن الكلمة (Word Builder)</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            رتب الحروف المبعثرة بالترتيب الصحيح لتكوين الكلمة!
          </p>
        </div>

        <button
          onClick={handleNext}
          className="bg-purple-100 text-purple-900 font-bold text-xs px-3 py-2 rounded-2xl hover:bg-purple-200 transition-colors flex items-center gap-1"
        >
          <span>التالي</span>
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Puzzle Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-purple-200 shadow-xl text-center space-y-6">
        {/* Word Image & Arabic Clue */}
        <div className="bg-gradient-to-tr from-purple-50 to-pink-50 rounded-3xl p-6 border-2 border-dashed border-purple-300 max-w-sm mx-auto">
          <span className="text-7xl block mb-2">{currentPuzzle.emoji}</span>
          <span className="text-xl font-bold text-purple-700 block">
            {currentPuzzle.arabic}
          </span>
        </div>

        {/* Word Slots (Answer Area) */}
        <div className="flex justify-center gap-2 sm:gap-3 min-h-[70px] items-center">
          {Array.from({ length: currentPuzzle.word.length }).map((_, idx) => {
            const letter = selectedLetters[idx];
            return (
              <button
                key={idx}
                onClick={() => letter && handleRemoveLetter(letter)}
                className={`w-14 h-16 sm:w-16 sm:h-20 rounded-2xl border-2 flex items-center justify-center text-2xl sm:text-3xl font-black font-display transition-all ${
                  letter
                    ? isSuccess
                      ? 'bg-emerald-500 border-emerald-600 text-white shadow-md animate-bounce'
                      : 'bg-purple-600 border-purple-700 text-white shadow-md'
                    : 'bg-slate-100 border-dashed border-slate-300 text-slate-400'
                }`}
              >
                {letter?.char || ''}
              </button>
            );
          })}
        </div>

        {/* Scrambled Available Letter Blocks */}
        <div className="pt-4">
          <span className="text-xs font-bold text-slate-400 block mb-3">
            اضغط على الحروف لترتيبها:
          </span>
          <div className="flex flex-wrap justify-center gap-3">
            {availableLetters.map((item) => (
              <button
                key={item.originalIdx}
                onClick={() => handlePickLetter(item)}
                className="w-14 h-16 sm:w-16 sm:h-20 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-90 text-slate-900 border-2 border-amber-500 font-black text-2xl sm:text-3xl font-display shadow-md transition-all flex items-center justify-center cursor-pointer"
              >
                {item.char}
              </button>
            ))}
          </div>
        </div>

        {/* Success Banner */}
        {isSuccess && (
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 max-w-md mx-auto space-y-2 animate-bounce">
            <h4 className="text-xl font-black text-emerald-800">
              🎉 أحسنت صنعاً يا بطل! كوّنت الكلمة بنجاح! ⭐ (+5 نجوم)
            </h4>
            <button
              onClick={handleNext}
              className="bg-emerald-600 text-white font-bold text-xs py-2 px-6 rounded-xl shadow-xs"
            >
              الكلمة التالية ➔
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
