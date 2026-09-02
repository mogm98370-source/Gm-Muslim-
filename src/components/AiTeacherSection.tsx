import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowRight, 
  Bot, 
  Send, 
  Volume2, 
  Sparkles, 
  Star, 
  Mic, 
  Smile, 
  Heart,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { UserProfile, ChatMessage } from '../types';
import { speakEnglish, soundEffects } from '../lib/sound';
import confetti from 'canvas-confetti';

interface AiTeacherSectionProps {
  user: UserProfile;
  onBack: () => void;
  onReward: (stars: number) => void;
}

export const AiTeacherSection: React.FC<AiTeacherSectionProps> = ({
  user,
  onBack,
  onReward
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'teacher',
      textAr: `مرحباً يا بطلنا الصغير ${user.childName}! أنا معلمك الذكي للأطفال (Teacher Ghanem). كيف يمكنني مساعدتك في تعلم الإنجليزية اليوم؟ 🌟`,
      textEn: `Hello little champion ${user.childName}! I am Teacher Ghanem. What would you like to learn in English today?`,
      timestamp: new Date().toISOString()
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const kidSuggestions = [
    'علمني كيف أقول مرحباً بالإنجليزي 👋',
    'ما هو صوت القطة بالإنجليزية؟ 🐱',
    'كيف أعد من 1 إلى 5 بالإنجليزية؟ 🔢',
    'أعطني لغزاً بسيطاً بالإنجليزية! 🧩',
    'ما هي ألوان قوس قزح؟ 🌈'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputVal;
    if (!query.trim() || isLoading) return;

    soundEffects.playPop();
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      textAr: query,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          childName: user.childName || 'البطل',
          childAge: user.childAge || 5
        })
      });

      const data = await response.json();

      const textAr = data.replyAr || data.responseAr || 'أحسنت يا بطل! استمر في التعلم.';
      const textEn = data.replyEn || data.responseEn || (data.practiceSentence ? data.practiceSentence : 'Great job! Keep practicing.');

      const teacherMsg: ChatMessage = {
        id: `teacher-${Date.now()}`,
        sender: 'teacher',
        textAr: textAr,
        textEn: textEn,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, teacherMsg]);
      soundEffects.playSuccess();
      onReward(2);

      // Speak English part automatically if available
      if (textEn) {
        speakEnglish(textEn, 0.85);
      }
    } catch (err) {
      console.error('Teacher API error:', err);
      const errorTeacherMsg: ChatMessage = {
        id: `teacher-err-${Date.now()}`,
        sender: 'teacher',
        textAr: 'يا لك من بطل مجتهد! لنتعلم معاً كلمة جديدة: Happy تعني سعيد! 😊',
        textEn: 'I am happy to learn English!',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorTeacherMsg]);
      speakEnglish('I am happy to learn English!', 0.85);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)] min-h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 shrink-0">
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
          <h2 className="text-lg sm:text-xl font-black text-slate-800 flex items-center gap-2 justify-center">
            <span>🤖</span>
            <span>المعلم الذكي للأطفال (Teacher Ghanem)</span>
          </h2>
          <p className="text-[11px] text-slate-500 font-medium">
            مدعوم بالذكاء الاصطناعي الآمن للأطفال لتعليم المفردات والنطق
          </p>
        </div>

        <div className="bg-amber-100 text-amber-900 font-bold text-xs px-3 py-1.5 rounded-2xl flex items-center gap-1">
          <span>{user.totalStars} ⭐</span>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 bg-white rounded-3xl p-4 sm:p-6 border-2 border-amber-200 shadow-xl overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isTeacher = msg.sender === 'teacher';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isTeacher ? 'flex-row' : 'flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm ${
                  isTeacher ? 'bg-amber-400 text-white' : 'bg-indigo-600 text-white'
                }`}
              >
                {isTeacher ? '🤖' : (user.childAvatar || '🧒')}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[80%] rounded-3xl p-4 sm:p-5 shadow-xs space-y-2 ${
                  isTeacher
                    ? 'bg-amber-50/90 text-slate-800 border border-amber-200/80 rounded-tr-none'
                    : 'bg-indigo-600 text-white rounded-tl-none'
                }`}
              >
                {/* English Text with Speaker button */}
                {msg.textEn && (
                  <div className="flex items-center justify-between gap-3 bg-white/70 backdrop-blur-xs p-2.5 rounded-2xl border border-amber-200/60">
                    <p className="text-base sm:text-lg font-black text-slate-900 font-display" dir="ltr">
                      "{msg.textEn}"
                    </p>
                    <button
                      onClick={() => {
                        soundEffects.playPop();
                        speakEnglish(msg.textEn!, 0.85);
                      }}
                      className="w-8 h-8 rounded-xl bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shrink-0 transition-colors shadow-xs"
                      title="استمع للنطق"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Arabic Text */}
                <p className={`text-xs sm:text-sm font-bold leading-relaxed ${isTeacher ? 'text-slate-700' : 'text-indigo-100'}`}>
                  {msg.textAr}
                </p>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-white flex items-center justify-center text-xl animate-pulse">
              🤖
            </div>
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-3xl text-xs font-bold text-amber-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin text-amber-500" />
              <span>المعلم الذكي يجهز إجابة سهلة وممتعة لك يا بطل...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 scrollbar-none">
        {kidSuggestions.map((sug, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(sug)}
            className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-slate-800 text-xs font-bold rounded-full whitespace-nowrap transition-all shadow-2xs"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Message Input Box */}
      <div className="bg-white rounded-3xl p-3 border-2 border-amber-200 shadow-md flex items-center gap-2 shrink-0">
        <input
          type="text"
          placeholder="اسأل المعلم الذكي أي سؤال بالإنجليزية أو العربية..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-400 transition-all"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputVal.trim() || isLoading}
          className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-black px-5 py-3 rounded-2xl shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>إرسال</span>
        </button>
      </div>
    </div>
  );
};
