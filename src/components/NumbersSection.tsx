import React, { useState } from 'react';
import { 
  ArrowRight, 
  Volume2, 
  Star, 
  Sparkles, 
  Check, 
  Lock, 
  RefreshCw, 
  HelpCircle 
} from 'lucide-react';
import { NumberItem, UserProfile } from '../types';
import { speakEnglish, soundEffects } from '../lib/sound';
import confetti from 'canvas-confetti';

interface NumbersSectionProps {
  numbers: NumberItem[];
  user: UserProfile;
  onBack: () => void;
  onNumberLearned: (num: number) => void;
  onOpenPremium: () => void;
}

export const NumbersSection: React.FC<NumbersSectionProps> = ({
  numbers,
  user,
  onBack,
  onNumberLearned,
  onOpenPremium
}) => {
  const [selectedNum, setSelectedNum] = useState<NumberItem>(numbers[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [quizTarget, setQuizTarget] = useState<NumberItem | null>(null);
  const [quizOptions, setQuizOptions] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const handleSelectNumber = (item: NumberItem) => {
    if (item.isPremium && !user.isPremium) {
      soundEffects.playPop();
      onOpenPremium();
      return;
    }
    soundEffects.playPop();
    setSelectedNum(item);
    playNumberAudio(item);
  };

  const playNumberAudio = async (item: NumberItem) => {
    setIsPlayingAudio(true);
    await speakEnglish(`${item.number}. ${item.word}.`);
    setIsPlayingAudio(false);
  };

  const startQuiz = () => {
    soundEffects.playPop();
    const available = user.isPremium ? numbers : numbers.filter(n => !n.isPremium);
    const target = available[Math.floor(Math.random() * available.length)];
    setQuizTarget(target);
    
    // Pick 3 options
    const others = available.filter(n => n.number !== target.number).sort(() => 0.5 - Math.random()).slice(0, 2);
    const opts = [target.number, ...others.map(o => o.number)].sort(() => 0.5 - Math.random());
    setQuizOptions(opts);
    setFeedback(null);
    setQuizMode(true);
    speakEnglish(`Find the number: ${target.word}`);
  };

  const handleQuizAnswer = (num: number) => {
    if (!quizTarget) return;
    if (num === quizTarget.number) {
      soundEffects.playSuccess();
      setFeedback('correct');
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      onNumberLearned(quizTarget.number);
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
            <span>🔢</span>
            <span>الأرقام والعد (1 - 20)</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            استمع لنطق الأرقام وعد الأشكال المبهجة!
          </p>
        </div>

        <button
          onClick={startQuiz}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-3 sm:px-4 py-2 rounded-2xl shadow-sm flex items-center gap-1.5 transition-all"
        >
          <HelpCircle className="w-4 h-4" />
          <span>اختبار العد 🎮</span>
        </button>
      </div>

      {/* Quiz Mode Banner if active */}
      {quizMode && quizTarget && (
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
              تمرين تفاعلي: أين الرقم؟
            </span>
            <button
              onClick={() => setQuizMode(false)}
              className="text-xs bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-xl"
            >
              إغلاق الاختبار ✕
            </button>
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black">
              أين الرقم: <span className="text-amber-300 underline font-display">{quizTarget.word}</span> ({quizTarget.arabicWord})؟
            </h3>
            <button
              onClick={() => speakEnglish(quizTarget.word)}
              className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-xl text-xs font-bold"
            >
              <Volume2 className="w-4 h-4" />
              <span>إعادة الاستماع</span>
            </button>
          </div>

          {/* Quiz Options */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2">
            {quizOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => handleQuizAnswer(opt)}
                className="h-20 bg-white hover:bg-amber-100 active:scale-95 text-slate-900 font-black text-4xl rounded-2xl shadow-md transition-all font-display"
              >
                {opt}
              </button>
            ))}
          </div>

          {feedback === 'correct' && (
            <p className="text-center font-black text-emerald-300 text-lg animate-bounce">
              🎉 أحسنت يا بطل! إجابة صحيحة ⭐
            </p>
          )}
          {feedback === 'wrong' && (
            <p className="text-center font-bold text-rose-200 text-sm">
              حاول مرة أخرى يا بطل، يمكنك الاستماع مجدداً! 💡
            </p>
          )}
        </div>
      )}

      {/* Main Focus Number Stage */}
      {selectedNum && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Number Large Badge */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-8 rounded-3xl bg-gradient-to-tr from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300">
              <span className="text-8xl sm:text-9xl font-black text-indigo-600 font-display animate-pulse">
                {selectedNum.number}
              </span>
              <span className="text-3xl font-black text-slate-800 mt-2 font-display">
                {selectedNum.word}
              </span>
              <span className="text-xl font-bold text-indigo-600">
                {selectedNum.arabicWord}
              </span>
            </div>

            {/* Visual Counting Area */}
            <div className="md:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                  <span>🍎</span>
                  <span>عد العناصر ({selectedNum.number}):</span>
                </h4>
                <button
                  onClick={() => playNumberAudio(selectedNum)}
                  disabled={isPlayingAudio}
                  className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>اسمع النطق 🔊</span>
                </button>
              </div>

              {/* Items grid for counting */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center gap-2.5 min-h-[120px] justify-center">
                {Array.from({ length: selectedNum.number }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      soundEffects.playPop(400 + idx * 50);
                      speakEnglish(`${idx + 1}`);
                    }}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border-2 border-indigo-200 hover:border-indigo-400 hover:scale-110 active:scale-95 flex flex-col items-center justify-center shadow-xs transition-all cursor-pointer group"
                  >
                    <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform">
                      {idx % 2 === 0 ? '⭐' : '🍎'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-600">
                      {idx + 1}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    soundEffects.playStarCollect();
                    confetti({ particleCount: 30, spread: 50 });
                    onNumberLearned(selectedNum.number);
                  }}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold py-3 px-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Star className="w-5 h-5 fill-white" />
                  <span>أتقنت عد هذا الرقم! ⭐ (+5 نجوم)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Numbers Selection Grid (1 - 20) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-100 shadow-sm">
        <h3 className="font-extrabold text-slate-800 text-base mb-4 flex items-center gap-2">
          <span>🔢</span>
          <span>جميع الأرقام:</span>
        </h3>

        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-2.5">
          {numbers.map((item) => {
            const isSelected = selectedNum?.number === item.number;
            const isLearned = user.learnedNumbers?.includes(item.number.toString());
            const isLocked = item.isPremium && !user.isPremium;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectNumber(item)}
                className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 font-display transition-all ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-700 text-white shadow-md scale-105 z-10'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-indigo-50 hover:border-indigo-300'
                }`}
              >
                {isLocked && (
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                    <Lock className="w-2.5 h-2.5" />
                  </div>
                )}
                <span className="text-2xl sm:text-3xl font-black">
                  {item.number}
                </span>
                <span className={`text-[10px] font-bold ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                  {item.word}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
