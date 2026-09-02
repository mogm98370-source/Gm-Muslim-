import React, { useState } from 'react';
import { 
  Volume2, 
  ArrowRight, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  PenTool, 
  Mic, 
  Play, 
  RefreshCw 
} from 'lucide-react';
import { LetterItem, UserProfile } from '../types';
import { speakEnglish, soundEffects } from '../lib/sound';
import confetti from 'canvas-confetti';

interface LettersSectionProps {
  letters: LetterItem[];
  user: UserProfile;
  onBack: () => void;
  onLetterLearned: (letter: string) => void;
  onOpenTracing: (letter: string) => void;
  onOpenRepeat: (word: string) => void;
  onOpenPremium: () => void;
}

export const LettersSection: React.FC<LettersSectionProps> = ({
  letters,
  user,
  onBack,
  onLetterLearned,
  onOpenTracing,
  onOpenRepeat,
  onOpenPremium
}) => {
  const [selectedLetter, setSelectedLetter] = useState<LetterItem>(letters[0] || {} as LetterItem);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showSentence, setShowSentence] = useState(true);

  const handleSelectLetter = (item: LetterItem) => {
    if (item.isPremium && !user.isPremium) {
      soundEffects.playPop();
      onOpenPremium();
      return;
    }
    soundEffects.playPop();
    setSelectedLetter(item);
    playLetterAudio(item);
  };

  const playLetterAudio = async (item: LetterItem) => {
    setIsPlayingAudio(true);
    await speakEnglish(`${item.letter}. ${item.lowercase}. ${item.word}.`);
    setIsPlayingAudio(false);
  };

  const playSentenceAudio = async () => {
    if (!selectedLetter) return;
    setIsPlayingAudio(true);
    await speakEnglish(selectedLetter.exampleSentence);
    setIsPlayingAudio(false);
  };

  const handleMarkCompleted = () => {
    soundEffects.playStarCollect();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
    onLetterLearned(selectedLetter.letter);
  };

  const isCompleted = user.learnedLetters.includes(selectedLetter.letter);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Navigation Header */}
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
            <span>🔤</span>
            <span>الحروف الإنجليزية (A - Z)</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            اضغط على الحرف واستمع للنطق وشاهد الكلمة والأمثلة!
          </p>
        </div>

        <div className="bg-amber-100 text-amber-900 font-bold text-xs px-3 py-1.5 rounded-2xl flex items-center gap-1">
          <span>{user.learnedLetters.length} من {letters.length} مكتمل</span>
          <span>⭐</span>
        </div>
      </div>

      {/* Main Focus Letter Stage */}
      {selectedLetter && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-lg relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Big Letter Card Display */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-3xl bg-gradient-to-tr from-amber-50 to-orange-50 border-2 border-dashed border-amber-300">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-7xl sm:text-9xl font-black text-amber-600 tracking-tight font-display animate-pulse">
                  {selectedLetter.letter}
                </span>
                <span className="text-5xl sm:text-7xl font-bold text-amber-400 font-display">
                  {selectedLetter.lowercase}
                </span>
              </div>
              <div className="text-6xl sm:text-7xl mb-3 hover:scale-125 transition-transform cursor-pointer"
                onClick={() => playLetterAudio(selectedLetter)}
              >
                {selectedLetter.emoji}
              </div>
              <div className="text-center">
                <span className="text-2xl sm:text-3xl font-black text-slate-800 block">
                  {selectedLetter.word}
                </span>
                <span className="text-lg font-bold text-amber-700 block">
                  {selectedLetter.arabicWord}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {selectedLetter.phonetic}
                </span>
              </div>
            </div>

            {/* Interactive Actions & Sentence Practice */}
            <div className="md:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {/* Speak Letter Button */}
                <button
                  onClick={() => playLetterAudio(selectedLetter)}
                  disabled={isPlayingAudio}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-extrabold text-base py-3 px-5 rounded-2xl shadow-md shadow-amber-200 transition-all flex items-center justify-center gap-2"
                >
                  <Volume2 className="w-6 h-6 animate-bounce" />
                  <span>اسمع النطق 🔊</span>
                </button>

                {/* Repeat Voice Feature */}
                <button
                  onClick={() => {
                    soundEffects.playPop();
                    onOpenRepeat(selectedLetter.word);
                  }}
                  className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold py-3 px-4 rounded-2xl shadow-md shadow-emerald-200 transition-all flex items-center gap-1.5"
                  title="كرر معي بالميكروفون"
                >
                  <Mic className="w-5 h-5" />
                  <span>كرر معي 🎤</span>
                </button>

                {/* Finger Tracing Studio */}
                <button
                  onClick={() => {
                    soundEffects.playPop();
                    onOpenTracing(selectedLetter.letter);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-bold py-3 px-4 rounded-2xl shadow-md shadow-blue-200 transition-all flex items-center gap-1.5"
                  title="اكتب الحرف بالإصبع"
                >
                  <PenTool className="w-5 h-5" />
                  <span>اكتب الحرف ✏️</span>
                </button>
              </div>

              {/* Example Sentence Box */}
              <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-800 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>جملة تدريبية:</span>
                  </span>
                  <button
                    onClick={playSentenceAudio}
                    className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 bg-white px-2 py-1 rounded-xl shadow-2xs"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>نطق الجملة</span>
                  </button>
                </div>
                <p className="text-base sm:text-lg font-black text-slate-800" dir="ltr">
                  "{selectedLetter.exampleSentence}"
                </p>
                <p className="text-xs sm:text-sm font-bold text-slate-600">
                  {selectedLetter.arabicSentence}
                </p>
              </div>

              {/* Mark as Learned / Reward Action */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  onClick={handleMarkCompleted}
                  className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 shadow-xs'
                  }`}
                >
                  <Star className={`w-5 h-5 ${isCompleted ? 'fill-emerald-600 text-emerald-600' : 'text-amber-500'}`} />
                  <span>{isCompleted ? 'أتقنت هذا الحرف! (اضغط لمكافأة)' : 'أكملت تعلم الحرف ⭐ (+5 نجوم)'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alphabet Selection Grid (A to Z) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-100 shadow-sm">
        <h3 className="font-extrabold text-slate-800 text-base mb-4 flex items-center gap-2">
          <span>🎯</span>
          <span>اختر حرفاً للبدء:</span>
        </h3>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-13 gap-2 sm:gap-2.5">
          {letters.map((item) => {
            const isSelected = selectedLetter?.letter === item.letter;
            const isLearned = user.learnedLetters.includes(item.letter);
            const isLocked = item.isPremium && !user.isPremium;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectLetter(item)}
                className={`relative flex flex-col items-center justify-center p-2 rounded-2xl border-2 font-display transition-all ${
                  isSelected
                    ? 'bg-amber-500 border-amber-600 text-white shadow-md scale-105 z-10'
                    : isLearned
                    ? 'bg-emerald-50 border-emerald-300 text-slate-800 hover:bg-emerald-100'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-amber-50 hover:border-amber-300'
                }`}
              >
                {isLocked && (
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                    <Lock className="w-2.5 h-2.5" />
                  </div>
                )}
                {isLearned && !isSelected && (
                  <div className="absolute -top-1 -left-1 text-xs">
                    ⭐
                  </div>
                )}
                <span className="text-xl sm:text-2xl font-black">
                  {item.letter}
                </span>
                <span className={`text-[10px] font-bold ${isSelected ? 'text-amber-100' : 'text-slate-500'}`}>
                  {item.lowercase}
                </span>
                <span className="text-sm mt-0.5">
                  {item.emoji}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
