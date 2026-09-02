import React, { useState } from 'react';
import { 
  ArrowRight, 
  BookOpen, 
  Volume2, 
  Sparkles, 
  Star, 
  Bot, 
  CheckCircle2, 
  HelpCircle,
  Play,
  RotateCcw
} from 'lucide-react';
import { StoryItem, UserProfile } from '../types';
import { speakEnglish, soundEffects } from '../lib/sound';
import confetti from 'canvas-confetti';

interface StoriesSectionProps {
  stories: StoryItem[];
  user: UserProfile;
  onBack: () => void;
  onReward: (stars: number) => void;
  onOpenPremium: () => void;
}

export const StoriesSection: React.FC<StoriesSectionProps> = ({
  stories,
  user,
  onBack,
  onReward,
  onOpenPremium
}) => {
  const [selectedStory, setSelectedStory] = useState<StoryItem | null>(null);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Read entire story or single sentence
  const handleReadSentence = async (text: string) => {
    setIsPlaying(true);
    await speakEnglish(text, 0.85);
    setIsPlaying(false);
  };

  const handleReadFullStory = async (story: StoryItem) => {
    setIsPlaying(true);
    for (let i = 0; i < story.sentences.length; i++) {
      setCurrentSentenceIdx(i);
      await speakEnglish(story.sentences[i].english, 0.85);
    }
    setIsPlaying(false);
    onReward(10);
    confetti({ particleCount: 50, spread: 70 });
  };

  const handleAnswerQuiz = (qIdx: number, optIdx: number, correctIdx: number) => {
    if (optIdx === correctIdx) {
      soundEffects.playSuccess();
      confetti({ particleCount: 40, spread: 60 });
      onReward(5);
      setQuizScore((prev) => (prev || 0) + 1);
    } else {
      soundEffects.playError();
    }
  };

  // Generate Custom Story using Gemini API
  const handleGenerateAiStory = async () => {
    if (!customPrompt.trim()) return;
    setIsGeneratingAi(true);
    soundEffects.playPop();

    try {
      const res = await fetch('/api/ai/story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: customPrompt,
          ageGroup: 'kindergarten'
        })
      });

      const data = await res.json();
      if (data.story) {
        const newStory: StoryItem = {
          id: `ai-${Date.now()}`,
          titleAr: data.story.titleAr || customPrompt,
          titleEn: data.story.titleEn || customPrompt,
          coverEmoji: '✨',
          sentences: data.story.sentences || [
            { english: 'Once upon a time in a happy forest.', arabic: 'في قديم الزمان في غابة سعيدة.' }
          ],
          moralAr: data.story.moralAr || 'التعلم ممتع دائماً!'
        };
        setSelectedStory(newStory);
        setCustomPrompt('');
        soundEffects.playSuccess();
      }
    } catch (e) {
      console.error('AI Story Error:', e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => {
            soundEffects.playPop();
            if (selectedStory) {
              setSelectedStory(null);
            } else {
              onBack();
            }
          }}
          className="flex items-center gap-2 bg-white hover:bg-amber-50 text-slate-700 font-bold px-4 py-2 rounded-2xl border border-amber-200 transition-colors shadow-xs"
        >
          <ArrowRight className="w-5 h-5 text-amber-600" />
          <span>{selectedStory ? 'العودة للقصص' : 'العودة للرئيسية'}</span>
        </button>

        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2 justify-center">
            <span>📖</span>
            <span>القصص التعليمية المصورة (Kids Stories)</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            استمع للقصص القصيرة وتدرب على الفهم والمفردات!
          </p>
        </div>

        <div className="bg-emerald-100 text-emerald-900 font-bold text-xs px-3 py-1.5 rounded-2xl">
          {stories.length} قصص رائعة 🌟
        </div>
      </div>

      {/* SELECTED STORY READER */}
      {selectedStory ? (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-emerald-200 shadow-xl space-y-6 max-w-3xl mx-auto">
          {/* Story Title & Cover */}
          <div className="text-center space-y-2">
            <span className="text-7xl block animate-bounce">{selectedStory.coverEmoji}</span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 font-display">
              {selectedStory.titleEn}
            </h3>
            <p className="text-lg font-bold text-emerald-700">
              {selectedStory.titleAr}
            </p>
          </div>

          {/* Full Story Audio Playback Control */}
          <div className="flex justify-center">
            <button
              onClick={() => handleReadFullStory(selectedStory)}
              disabled={isPlaying}
              className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-extrabold text-base py-3 px-6 rounded-2xl shadow-md transition-all flex items-center gap-2"
            >
              <Volume2 className="w-6 h-6 animate-pulse" />
              <span>استمع للقصة كاملة 🔊</span>
            </button>
          </div>

          {/* Sentences Cards */}
          <div className="space-y-4">
            {selectedStory.sentences.map((sentence, idx) => (
              <div
                key={idx}
                className={`p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-center justify-between gap-4 ${
                  currentSentenceIdx === idx && isPlaying
                    ? 'bg-emerald-50 border-emerald-400 shadow-md scale-102'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="space-y-1 text-right flex-1">
                  <p className="text-base sm:text-lg font-black text-slate-800 font-display" dir="ltr">
                    "{sentence.english}"
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-slate-500">
                    {sentence.arabic}
                  </p>
                </div>
                <button
                  onClick={() => handleReadSentence(sentence.english)}
                  className="w-10 h-10 rounded-xl bg-white hover:bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs shrink-0"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Moral */}
          {selectedStory.moralAr && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
              <span className="text-xs font-bold text-amber-800 block mb-0.5">العبرة من القصة 💡</span>
              <p className="font-extrabold text-slate-800 text-sm">
                {selectedStory.moralAr}
              </p>
            </div>
          )}

          {/* Quiz Section */}
          {selectedStory.quiz && selectedStory.quiz.length > 0 && (
            <div className="bg-purple-50 rounded-2xl p-5 border border-purple-200 space-y-3">
              <h4 className="font-black text-purple-900 text-base flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                <span>سؤال الذكاء حول القصة:</span>
              </h4>
              {selectedStory.quiz.map((q, qIdx) => (
                <div key={qIdx} className="space-y-2">
                  <p className="font-bold text-sm text-slate-800">{q.questionAr}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {q.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => handleAnswerQuiz(qIdx, optIdx, q.correctIndex)}
                        className="py-2.5 px-3 bg-white hover:bg-purple-100 active:scale-95 border border-purple-200 rounded-xl font-bold text-xs text-slate-700 transition-all"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Stories Gallery & AI Creator */
        <div className="space-y-8">
          {/* AI Custom Story Generator Card */}
          <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Bot className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black">
                  اصنع قصة جديدة بالذكاء الاصطناعي (AI Magic Story) ✨
                </h3>
                <p className="text-purple-200 text-xs font-medium">
                  اكتب أي فكرة مثل "أرنب يحب الجزر في الحديقة" وسيقوم الذكاء الاصطناعي بكتابتها ونطقها فوراً!
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="اكتب فكرة القصة هنا (مثلاً: دب صغير يلعب بالكرة)..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-purple-200 text-sm font-bold focus:outline-none focus:bg-white/20 transition-all"
              />
              <button
                onClick={handleGenerateAiStory}
                disabled={isGeneratingAi || !customPrompt.trim()}
                className="bg-amber-400 hover:bg-amber-500 active:scale-95 text-slate-900 font-extrabold text-sm px-6 py-3 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-5 h-5 text-amber-900" />
                <span>{isGeneratingAi ? 'جاري التأليف...' : 'ألّف القصة الآن 🪄'}</span>
              </button>
            </div>
          </div>

          {/* Stories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stories.map((story) => (
              <div
                key={story.id}
                onClick={() => {
                  soundEffects.playPop();
                  setSelectedStory(story);
                  setCurrentSentenceIdx(0);
                }}
                className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-emerald-400 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <span className="text-6xl block mb-3 group-hover:scale-110 transition-transform">
                    {story.coverEmoji}
                  </span>
                  <h4 className="font-extrabold text-slate-800 text-lg group-hover:text-emerald-600 transition-colors font-display">
                    {story.titleEn}
                  </h4>
                  <p className="text-sm font-bold text-emerald-700 mb-2">
                    {story.titleAr}
                  </p>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {story.sentences[0]?.arabic}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
                  <span>اقرأ واستمع ➔</span>
                  <span>{story.sentences.length} جمل</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
