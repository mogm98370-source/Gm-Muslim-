import React, { useState } from 'react';
import { 
  ArrowRight, 
  Volume2, 
  RotateCcw, 
  Trash2, 
  Sparkles, 
  Star, 
  Crown, 
  Check, 
  Play 
} from 'lucide-react';
import { UserProfile } from '../types';
import { speakEnglish, soundEffects } from '../lib/sound';
import confetti from 'canvas-confetti';

interface WriteAndSpeakProps {
  user: UserProfile;
  onBack: () => void;
  onOpenPremium: () => void;
  onReward: (stars: number) => void;
}

export const WriteAndSpeak: React.FC<WriteAndSpeakProps> = ({
  user,
  onBack,
  onOpenPremium,
  onReward
}) => {
  const [text, setText] = useState('Apple');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(0.85);

  const presets = [
    { label: 'Apple', icon: '🍎' },
    { label: 'Cat', icon: '🐱' },
    { label: 'Sun', icon: '☀️' },
    { label: 'Happy', icon: '😊' },
    { label: 'I love you', icon: '❤️' },
    { label: 'Good morning', icon: '🌅' },
    { label: 'Big Blue Balloon', icon: '🎈' },
    { label: 'One Two Three', icon: '🔢' }
  ];

  const alphabetRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  const handleSpeak = async () => {
    if (!text.trim()) return;
    soundEffects.playPop();
    setIsPlaying(true);
    await speakEnglish(text, speed);
    setIsPlaying(false);
    onReward(1);
  };

  const handleKeyPress = (char: string) => {
    soundEffects.playPop();
    setText(prev => prev + char.toLowerCase());
  };

  const handleSpace = () => {
    soundEffects.playPop();
    setText(prev => prev + ' ');
  };

  const handleBackspace = () => {
    soundEffects.playPop();
    setText(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    soundEffects.playPop();
    setText('');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-4xl mx-auto">
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
            <span>🔊</span>
            <span>استوديو اكتب وانطق (Write & Speak)</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            اكتب أي حرف أو كلمة أو جملة واسمع نطقها الإنجليزي الواضح!
          </p>
        </div>

        <div className="bg-amber-100 text-amber-900 font-bold text-xs px-3 py-1.5 rounded-2xl flex items-center gap-1">
          <span>⭐ غير محدود</span>
        </div>
      </div>

      {/* Main Text Display & Audio Action */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-xl space-y-6">
        {/* Big Display Screen */}
        <div className="relative bg-gradient-to-tr from-amber-50 to-orange-50 rounded-3xl p-6 border-2 border-amber-300 min-h-[140px] flex flex-col items-center justify-center text-center">
          <span className="text-3xl sm:text-5xl font-black text-slate-800 font-display tracking-wide break-all" dir="ltr">
            {text || <span className="text-slate-300">اكتب هنا...</span>}
          </span>
        </div>

        {/* Speed and Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">سرعة النطق:</span>
            <button
              onClick={() => setSpeed(0.65)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                speed === 0.65 ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
              }`}
            >
              بطيء 🐢
            </button>
            <button
              onClick={() => setSpeed(0.85)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                speed === 0.85 ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
              }`}
            >
              عادي 🐇
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>مسح الكل</span>
            </button>
          </div>
        </div>

        {/* Large Play / Speak Button */}
        <button
          onClick={handleSpeak}
          disabled={!text.trim() || isPlaying}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-98 text-white font-black text-lg py-4 px-6 rounded-3xl shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <Volume2 className="w-7 h-7 animate-bounce" />
          <span>اسمع النطق الإنجليزي 🔊</span>
        </button>

        {/* Quick Presets for Toddlers */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-500 block">
            كلمات وجمل جاهزة للتجربة:
          </span>
          <div className="flex flex-wrap gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  soundEffects.playPop();
                  setText(p.label);
                  speakEnglish(p.label, speed);
                }}
                className="bg-amber-50 hover:bg-amber-100 border border-amber-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-2xl flex items-center gap-1.5 transition-all active:scale-95"
              >
                <span>{p.icon}</span>
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Kid-Friendly On-Screen Large Virtual Keyboard */}
      <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-6 shadow-xl space-y-2.5">
        <div className="text-center text-xs font-bold text-slate-400 mb-2">
          لوحة مفاتيح الأطفال الإنجليزية ⌨️
        </div>

        {alphabetRows.map((row, rowIdx) => (
          <div key={rowIdx} className="flex justify-center gap-1.5 sm:gap-2">
            {row.map(k => (
              <button
                key={k}
                onClick={() => handleKeyPress(k)}
                className="w-8 sm:w-12 h-11 sm:h-14 bg-slate-800 hover:bg-amber-500 hover:text-white active:scale-90 rounded-2xl text-base sm:text-xl font-black font-display shadow-md transition-all flex items-center justify-center"
              >
                {k}
              </button>
            ))}
          </div>
        ))}

        {/* Bottom space & backspace row */}
        <div className="flex justify-center gap-2 pt-2">
          <button
            onClick={handleBackspace}
            className="px-4 sm:px-6 h-12 bg-rose-600/80 hover:bg-rose-600 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>حذف</span>
          </button>
          <button
            onClick={handleSpace}
            className="flex-1 max-w-xs h-12 bg-slate-700 hover:bg-slate-600 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center transition-all active:scale-95"
          >
            مسافة (Space)
          </button>
          <button
            onClick={handleSpeak}
            className="px-4 sm:px-6 h-12 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1 transition-all active:scale-95 shadow-md shadow-emerald-900"
          >
            <Volume2 className="w-4 h-4" />
            <span>انطق</span>
          </button>
        </div>
      </div>
    </div>
  );
};
