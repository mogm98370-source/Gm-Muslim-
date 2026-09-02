import React, { useState } from 'react';
import { ArrowRight, Volume2, Lock, Star, Sparkles, Sliders, CheckCircle2 } from 'lucide-react';
import { SentenceItem, UserProfile } from '../types';
import { speakEnglish, soundEffects } from '../lib/sound';

interface SimpleSentencesSectionProps {
  sentences: SentenceItem[];
  user: UserProfile;
  onBack: () => void;
  onOpenPremium: () => void;
}

export const SimpleSentencesSection: React.FC<SimpleSentencesSectionProps> = ({
  sentences,
  user,
  onBack,
  onOpenPremium
}) => {
  const [selectedSent, setSelectedSent] = useState<SentenceItem>(sentences[0]);
  const [speechRate, setSpeechRate] = useState<number>(0.8);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSelectSent = (item: SentenceItem) => {
    if (item.isPremium && !user.isPremium) {
      soundEffects.playPop();
      onOpenPremium();
      return;
    }
    soundEffects.playPop();
    setSelectedSent(item);
    playSentence(item, speechRate);
  };

  const playSentence = async (item: SentenceItem, rate: number) => {
    setIsPlaying(true);
    await speakEnglish(item.english, rate);
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
            <span>🗣️</span>
            <span>الجمل البسيطة (Simple Sentences)</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            تعلم التحدث بجمل إنجليزية قصيرة وسهلة!
          </p>
        </div>

        {/* Speech Speed Toggle */}
        <div className="flex items-center gap-1.5 bg-white border border-slate-200 p-1 rounded-2xl">
          <button
            onClick={() => setSpeechRate(0.65)}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              speechRate === 0.65 ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            بطيء 🐢
          </button>
          <button
            onClick={() => setSpeechRate(0.85)}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              speechRate === 0.85 ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            عادي 🐇
          </button>
        </div>
      </div>

      {selectedSent && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-200 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="w-24 h-24 rounded-3xl bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center text-6xl shadow-inner shrink-0">
              {selectedSent.emoji}
            </div>

            <div className="flex-1 text-center md:text-right space-y-2">
              <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full">
                {selectedSent.difficulty === 'easy' ? 'مستوى سهل' : 'مستوى متوسط'}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-800 font-display" dir="ltr">
                "{selectedSent.english}"
              </h3>
              <p className="text-lg font-bold text-indigo-700">
                {selectedSent.arabic}
              </p>
            </div>

            <button
              onClick={() => playSentence(selectedSent, speechRate)}
              disabled={isPlaying}
              className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-base py-3.5 px-6 rounded-2xl shadow-md transition-all flex items-center gap-2 shrink-0"
            >
              <Volume2 className="w-6 h-6 animate-bounce" />
              <span>استمع للجملة 🔊</span>
            </button>
          </div>
        </div>
      )}

      {/* Sentences List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sentences.map((item) => {
          const isSelected = selectedSent?.id === item.id;
          const isLocked = item.isPremium && !user.isPremium;

          return (
            <div
              key={item.id}
              onClick={() => handleSelectSent(item)}
              className={`p-4 rounded-3xl border-2 transition-all flex items-center justify-between gap-4 cursor-pointer bg-white ${
                isSelected 
                  ? 'border-indigo-500 bg-indigo-50/40 shadow-md' 
                  : 'border-slate-200 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{item.emoji}</span>
                <div>
                  <h4 className="font-black text-base text-slate-800 font-display" dir="ltr">
                    {item.english}
                  </h4>
                  <p className="text-xs font-bold text-slate-500">
                    {item.arabic}
                  </p>
                </div>
              </div>

              {isLocked ? (
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectSent(item);
                  }}
                  className="w-9 h-9 rounded-2xl bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-600 flex items-center justify-center transition-colors shrink-0"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
