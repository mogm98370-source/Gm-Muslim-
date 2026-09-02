import React, { useState } from 'react';
import { ArrowRight, Mic, MicOff, Volume2, Star, Sparkles, RefreshCw, CheckCircle2, Award } from 'lucide-react';
import { UserProfile } from '../types';
import { speakEnglish, soundEffects, startSpeechRecognition } from '../lib/sound';
import confetti from 'canvas-confetti';

interface RepeatAfterMeProps {
  user: UserProfile;
  initialWord?: string;
  onBack: () => void;
  onReward: (stars: number) => void;
}

export const RepeatAfterMe: React.FC<RepeatAfterMeProps> = ({
  user,
  initialWord,
  onBack,
  onReward
}) => {
  const challengeList = [
    { word: 'Apple', arabic: 'تفاحة', emoji: '🍎', sentence: 'Apple' },
    { word: 'Cat', arabic: 'قطة', emoji: '🐱', sentence: 'Cat' },
    { word: 'Dog', arabic: 'كلب', emoji: '🐶', sentence: 'Dog' },
    { word: 'Sun', arabic: 'شمس', emoji: '☀️', sentence: 'Sun' },
    { word: 'Star', arabic: 'نجمة', emoji: '⭐', sentence: 'Star' },
    { word: 'Ball', arabic: 'كرة', emoji: '⚽', sentence: 'Ball' },
    { word: 'Happy', arabic: 'سعيد', emoji: '😊', sentence: 'Happy' },
    { word: 'Thank you', arabic: 'شكراً لك', emoji: '💐', sentence: 'Thank you' }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [userSpokenText, setUserSpokenText] = useState('');
  const [status, setStatus] = useState<'idle' | 'listening' | 'success' | 'retry'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const currentItem = challengeList[currentIndex];

  const handlePlayPrompt = () => {
    soundEffects.playPop();
    speakEnglish(currentItem.word);
  };

  const handleStartMic = () => {
    setErrorMsg('');
    setUserSpokenText('');
    setStatus('listening');
    setIsRecording(true);

    const recognitionInstance = startSpeechRecognition(
      currentItem.word,
      (result) => {
        setIsRecording(false);
        setUserSpokenText(result.transcript);
        if (result.isMatch) {
          setStatus('success');
          soundEffects.playSuccess();
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 }
          });
          onReward(5);
        } else {
          setStatus('retry');
          soundEffects.playError();
        }
      },
      (err) => {
        setIsRecording(false);
        setStatus('retry');
        setErrorMsg(err);
      },
      () => {
        setIsRecording(true);
      }
    );
  };

  const handleNextChallenge = () => {
    soundEffects.playPop();
    setStatus('idle');
    setUserSpokenText('');
    setErrorMsg('');
    setCurrentIndex((prev) => (prev + 1) % challengeList.length);
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
            <span>🎤</span>
            <span>كرر معي (Repeat After Me)</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            استمع → كرر بصوتك في الميكروفون → اكسب نجوم وتشجيع!
          </p>
        </div>

        <button
          onClick={handleNextChallenge}
          className="bg-emerald-100 text-emerald-900 font-bold text-xs px-3 py-2 rounded-2xl hover:bg-emerald-200 transition-colors flex items-center gap-1"
        >
          <span>التالي</span>
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Challenge Stage */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-emerald-200 shadow-xl text-center space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 text-xs font-bold">
          <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
            1. استمع 🔊
          </span>
          <span className="text-slate-300">➔</span>
          <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
            2. ردد بالميكروفون 🎤
          </span>
          <span className="text-slate-300">➔</span>
          <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full border border-amber-200">
            3. احصل على نجوم ⭐
          </span>
        </div>

        {/* Big Word Card */}
        <div className="bg-gradient-to-tr from-emerald-50 via-teal-50 to-cyan-50 rounded-3xl p-8 border-2 border-dashed border-emerald-300 max-w-md mx-auto">
          <span className="text-8xl mb-3 block animate-bounce">
            {currentItem.emoji}
          </span>
          <h3 className="text-4xl sm:text-5xl font-black text-slate-800 font-display mb-1" dir="ltr">
            {currentItem.word}
          </h3>
          <p className="text-xl font-bold text-emerald-700">
            {currentItem.arabic}
          </p>
        </div>

        {/* Listen Button */}
        <div className="flex justify-center">
          <button
            onClick={handlePlayPrompt}
            className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-extrabold text-base py-3 px-6 rounded-2xl shadow-md shadow-amber-200 transition-all flex items-center gap-2"
          >
            <Volume2 className="w-6 h-6" />
            <span>اسمع الكلمة أولاً 🔊</span>
          </button>
        </div>

        {/* Microphone Recording Button */}
        <div className="py-4">
          <button
            onClick={handleStartMic}
            disabled={isRecording}
            className={`w-28 h-28 mx-auto rounded-full flex flex-col items-center justify-center transition-all shadow-xl active:scale-95 ${
              isRecording 
                ? 'bg-rose-500 text-white animate-pulse ring-8 ring-rose-200' 
                : 'bg-gradient-to-tr from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-emerald-200 hover:scale-105'
            }`}
          >
            <Mic className="w-10 h-10 mb-1" />
            <span className="text-xs font-black">
              {isRecording ? 'نستمع لك...' : 'اضغط وتحدث'}
            </span>
          </button>
        </div>

        {/* Feedback results */}
        {status === 'listening' && (
          <p className="text-emerald-700 font-bold text-sm animate-pulse">
            تحدث الآن بصوت واضح بالقرب من الميكروفون... 🎙️
          </p>
        )}

        {status === 'success' && (
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 max-w-md mx-auto space-y-2 animate-bounce">
            <div className="flex items-center justify-center gap-2 text-emerald-800 font-black text-xl">
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              <span>نطق ممتاز ورائع يا بطل! 🌟 (+5 نجوم)</span>
            </div>
            {userSpokenText && (
              <p className="text-xs text-emerald-700 font-medium">
                سمعنا منك: "{userSpokenText}"
              </p>
            )}
            <button
              onClick={handleNextChallenge}
              className="bg-emerald-600 text-white font-bold text-xs py-2 px-4 rounded-xl mt-2"
            >
              الكلمة التالية ➔
            </button>
          </div>
        )}

        {status === 'retry' && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 max-w-md mx-auto space-y-2">
            <p className="text-amber-800 font-bold text-base">
              محاولة جيدة! استمع للكلمة وحاول مرة أخرى بكل ثقة 👏
            </p>
            {userSpokenText && (
              <p className="text-xs text-slate-500 font-medium">
                الكلمة التي سمعناها: "{userSpokenText}"
              </p>
            )}
            {errorMsg && (
              <p className="text-xs text-rose-500 font-medium">
                {errorMsg}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
