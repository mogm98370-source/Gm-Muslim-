import React, { useState } from 'react';
import { ArrowRight, Volume2, Search, Lock, Star, Sparkles, Filter } from 'lucide-react';
import { WordItem, WordCategory, UserProfile } from '../types';
import { speakEnglish, soundEffects } from '../lib/sound';

interface WordsDictionarySectionProps {
  words: WordItem[];
  user: UserProfile;
  onBack: () => void;
  onOpenPremium: () => void;
}

export const WordsDictionarySection: React.FC<WordsDictionarySectionProps> = ({
  words,
  user,
  onBack,
  onOpenPremium
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeWord, setActiveWord] = useState<WordItem | null>(null);

  const categories: { id: string; labelAr: string; emoji: string }[] = [
    { id: 'all', labelAr: 'الكل', emoji: '🌟' },
    { id: 'family', labelAr: 'العائلة', emoji: '👨‍👩‍👧' },
    { id: 'food', labelAr: 'الطعام', emoji: '🍞' },
    { id: 'school', labelAr: 'المدرسة', emoji: '🎒' },
    { id: 'toys', labelAr: 'الألعاب', emoji: '🧸' },
    { id: 'clothes', labelAr: 'الملابس', emoji: '👗' },
    { id: 'home', labelAr: 'المنزل', emoji: '🏠' },
    { id: 'nature', labelAr: 'الطبيعة', emoji: '🌿' },
    { id: 'transport', labelAr: 'المواصلات', emoji: '🚀' }
  ];

  const filteredWords = words.filter(w => {
    const matchesCat = selectedCategory === 'all' || w.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      w.english.toLowerCase().includes(searchQuery.toLowerCase()) || 
      w.arabic.includes(searchQuery);
    return matchesCat && matchesSearch;
  });

  const handleSpeak = (item: WordItem) => {
    if (item.isPremium && !user.isPremium) {
      soundEffects.playPop();
      onOpenPremium();
      return;
    }
    soundEffects.playPop();
    setActiveWord(item);
    speakEnglish(item.english);
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
            <span>📚</span>
            <span>قاموس الكلمات المصور (Dictionary)</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            استكشف الكلمات حسب الأقسام واستمع لنطقها الواضح!
          </p>
        </div>

        <div className="bg-sky-100 text-sky-900 font-bold text-xs px-3 py-1.5 rounded-2xl">
          {filteredWords.length} كلمة متاحة 📖
        </div>
      </div>

      {/* Search and Category Filter */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ابحث عن كلمة بالإنجليزية أو العربية..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-12 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  soundEffects.playPop();
                  setSelectedCategory(cat.id);
                }}
                className={`px-3.5 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-200 scale-105'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.labelAr}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Words Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filteredWords.map((item) => {
          const isSelected = activeWord?.id === item.id;
          const isLocked = item.isPremium && !user.isPremium;

          return (
            <div
              key={item.id}
              onClick={() => handleSpeak(item)}
              className={`relative bg-white p-4 rounded-3xl border-2 transition-all flex flex-col items-center justify-between gap-2 shadow-xs hover:shadow-md cursor-pointer group ${
                isSelected 
                  ? 'border-sky-500 bg-sky-50/40 scale-105' 
                  : 'border-slate-200 hover:border-sky-300'
              }`}
            >
              {isLocked && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <Lock className="w-2.5 h-2.5" />
                </div>
              )}

              <span className="text-4xl sm:text-5xl group-hover:scale-125 transition-transform duration-200">
                {item.emoji}
              </span>

              <div className="text-center w-full">
                <span className="font-black text-base sm:text-lg text-slate-800 block font-display truncate">
                  {item.english}
                </span>
                <span className="text-xs font-bold text-sky-600 block truncate">
                  {item.arabic}
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSpeak(item);
                }}
                className="w-full py-1.5 bg-slate-100 hover:bg-sky-500 hover:text-white text-slate-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>نطق</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
