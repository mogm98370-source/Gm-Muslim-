import React, { useState } from 'react';
import { 
  ArrowRight, 
  Music, 
  Volume2, 
  Play, 
  Pause, 
  Star, 
  Sparkles, 
  RotateCcw 
} from 'lucide-react';
import { SongItem, UserProfile } from '../types';
import { speakEnglish, soundEffects } from '../lib/sound';
import confetti from 'canvas-confetti';

interface SongsSectionProps {
  songs: SongItem[];
  user: UserProfile;
  onBack: () => void;
  onReward: (stars: number) => void;
}

export const SongsSection: React.FC<SongsSectionProps> = ({
  songs,
  user,
  onBack,
  onReward
}) => {
  const [selectedSong, setSelectedSong] = useState<SongItem>(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLyricIdx, setCurrentLyricIdx] = useState<number>(0);

  const handlePlaySong = async (song: SongItem) => {
    soundEffects.playPop();
    setIsPlaying(true);

    for (let i = 0; i < song.lyrics.length; i++) {
      setCurrentLyricIdx(i);
      // Play rhythmic musical tone before line
      soundEffects.playPop(300 + (i % 4) * 100);
      await speakEnglish(song.lyrics[i], 0.9);
    }

    setIsPlaying(false);
    onReward(5);
    confetti({ particleCount: 50, spread: 70 });
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
            <span>🎵</span>
            <span>الأناشيد والأغاني التعليمية (Songs)</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            استمع للأناشيد اللطيفة وردد الكلمات بطريقة إيقاعية ممتعة!
          </p>
        </div>

        <div className="bg-purple-100 text-purple-900 font-bold text-xs px-3 py-1.5 rounded-2xl">
          أغاني مبهجة 🎶
        </div>
      </div>

      {/* Main Active Song Studio */}
      {selectedSong && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-purple-200 shadow-xl text-center space-y-6">
          <div className="text-center space-y-2">
            <span className="text-7xl block animate-pulse">🎵</span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 font-display">
              {selectedSong.titleEn}
            </h3>
            <p className="text-lg font-bold text-purple-700">
              {selectedSong.titleAr}
            </p>
          </div>

          {/* Big Play / Sing Button */}
          <div className="flex justify-center">
            <button
              onClick={() => handlePlaySong(selectedSong)}
              disabled={isPlaying}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-95 text-white font-black text-lg py-4 px-8 rounded-3xl shadow-lg shadow-purple-200 transition-all flex items-center gap-3 disabled:opacity-50"
            >
              <Volume2 className="w-7 h-7 animate-bounce" />
              <span>{isPlaying ? 'جاري الغناء...' : 'غنِّ واستمع للأنشودة 🎶'}</span>
            </button>
          </div>

          {/* Karaoke Style Lyrics Display */}
          <div className="bg-gradient-to-tr from-purple-50 to-pink-50 rounded-3xl p-6 sm:p-8 border-2 border-purple-200 space-y-3 max-w-xl mx-auto">
            {selectedSong.lyrics.map((line, idx) => (
              <p
                key={idx}
                className={`text-lg sm:text-2xl font-black transition-all py-1.5 px-3 rounded-xl font-display ${
                  currentLyricIdx === idx && isPlaying
                    ? 'bg-purple-600 text-white scale-105 shadow-md'
                    : 'text-slate-700'
                }`}
                dir="ltr"
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Songs Library */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {songs.map((song) => (
          <div
            key={song.id}
            onClick={() => {
              soundEffects.playPop();
              setSelectedSong(song);
              setCurrentLyricIdx(0);
            }}
            className={`p-5 rounded-3xl border-2 transition-all cursor-pointer bg-white ${
              selectedSong?.id === song.id
                ? 'border-purple-600 shadow-md bg-purple-50/40 scale-102'
                : 'border-slate-200 hover:border-purple-300'
            }`}
          >
            <span className="text-4xl block mb-2">🎶</span>
            <h4 className="font-black text-base text-slate-800 font-display">
              {song.titleEn}
            </h4>
            <p className="text-xs font-bold text-purple-700">
              {song.titleAr}
            </p>
            <p className="text-[11px] text-slate-500 mt-2">
              {song.lyrics.length} أسطر موسيقية
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
