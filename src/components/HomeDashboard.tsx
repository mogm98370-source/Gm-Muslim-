import React from 'react';
import { 
  BookOpen, 
  Volume2, 
  Mic, 
  PenTool, 
  Sparkles, 
  Gamepad2, 
  Bot, 
  Heart, 
  Award, 
  Palette, 
  Music, 
  Puzzle, 
  CheckCircle2, 
  Flame, 
  Star, 
  Smile, 
  Footprints, 
  Shapes, 
  Apple, 
  Cat, 
  ListOrdered, 
  Type, 
  Compass,
  ArrowLeft,
  Crown
} from 'lucide-react';
import { UserProfile, DailyChallenge } from '../types';
import { soundEffects } from '../lib/sound';

interface HomeDashboardProps {
  user: UserProfile;
  dailyChallenges: DailyChallenge[];
  onNavigate: (view: string) => void;
  onOpenPremium: () => void;
  onClaimDailyReward: (challengeId: string) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  user,
  dailyChallenges,
  onNavigate,
  onOpenPremium,
  onClaimDailyReward
}) => {
  // Main Learning Islands
  const coreSections = [
    {
      id: 'letters',
      titleAr: 'الحروف الإنجليزية',
      titleEn: 'Letters (A to Z)',
      subtitleAr: '26 حرفاً مع النطق والصور والأمثلة',
      icon: '🔤',
      gradient: 'from-amber-400 via-orange-400 to-rose-400',
      badge: 'الأساس',
      accentColor: 'border-orange-200'
    },
    {
      id: 'numbers',
      titleAr: 'الأرقام والعد',
      titleEn: 'Numbers (1 to 20)',
      subtitleAr: 'تعلم الأرقام وعد الأشكال بالإنجليزية',
      icon: '🔢',
      gradient: 'from-blue-400 via-indigo-400 to-violet-500',
      badge: '1-20',
      accentColor: 'border-blue-200'
    },
    {
      id: 'colors',
      titleAr: 'الألوان المبهجة',
      titleEn: 'Colors & Splashes',
      subtitleAr: '10 ألوان مع النطق والأمثلة الحية',
      icon: '🎨',
      gradient: 'from-pink-400 via-rose-400 to-red-400',
      badge: 'ممتع',
      accentColor: 'border-pink-200'
    },
    {
      id: 'animals',
      titleAr: 'عالم الحيوانات',
      titleEn: 'Animals & Sounds',
      subtitleAr: 'تعرف على الحيوانات وأسمائها وأصواتها',
      icon: '🐶',
      gradient: 'from-emerald-400 via-teal-400 to-cyan-500',
      badge: 'أصوات',
      accentColor: 'border-emerald-200'
    },
    {
      id: 'fruits',
      titleAr: 'الفواكه اللذيذة',
      titleEn: 'Yummy Fruits',
      subtitleAr: 'تعلم أسماء الفواكه الشهية والصحية',
      icon: '🍎',
      gradient: 'from-red-400 via-rose-500 to-pink-500',
      badge: 'صحي',
      accentColor: 'border-rose-200'
    },
    {
      id: 'shapes',
      titleAr: 'الأشكال الهندسية',
      titleEn: 'Fun Shapes',
      subtitleAr: 'الدائرة، المربع، المثلث، النجمة والقلب',
      icon: '🔵',
      gradient: 'from-purple-400 via-violet-500 to-indigo-500',
      badge: 'أشكال',
      accentColor: 'border-purple-200'
    },
    {
      id: 'bodyParts',
      titleAr: 'أجزاء الجسم',
      titleEn: 'My Body Parts',
      subtitleAr: 'تعلم أجزاء جسم الإنسان وتفاعلها',
      icon: '👋',
      gradient: 'from-amber-400 via-yellow-400 to-lime-500',
      badge: 'تفاعلي',
      accentColor: 'border-yellow-200'
    },
    {
      id: 'words',
      titleAr: 'قاموس الكلمات المصور',
      titleEn: 'Words Dictionary',
      subtitleAr: 'العائلة، الطعام، المدرسة، الألعاب والملابس',
      icon: '📚',
      gradient: 'from-sky-400 via-cyan-400 to-teal-500',
      badge: 'شامل',
      accentColor: 'border-cyan-200'
    },
    {
      id: 'sentences',
      titleAr: 'الجمل البسيطة',
      titleEn: 'Simple Sentences',
      subtitleAr: 'جمل سهلة للمحادثة اليومية والتحيات',
      icon: '🗣️',
      gradient: 'from-indigo-400 via-purple-400 to-pink-400',
      badge: 'محادثة',
      accentColor: 'border-indigo-200'
    }
  ];

  // Interactive Studios & Features
  const specialFeatures = [
    {
      id: 'write-and-speak',
      titleAr: 'اكتب وانطق 🔊',
      titleEn: 'Write & Speak',
      descriptionAr: 'اكتب أي حرف أو كلمة واسمع نطقها بصوت إنجليزي فائق الوضوح!',
      color: 'bg-gradient-to-br from-amber-500 to-orange-600',
      icon: Volume2
    },
    {
      id: 'repeat-after-me',
      titleAr: 'كرر معي 🎤',
      titleEn: 'Repeat After Me',
      descriptionAr: 'استمع للكلمة ورددها في الميكروفون لتحصل على نجوم وتشجيع!',
      color: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      icon: Mic
    },
    {
      id: 'letter-tracing',
      titleAr: 'اكتب الحرف بالإصبع ✏️',
      titleEn: 'Trace & Write',
      descriptionAr: 'تتبع خطوط الحروف الإنجليزية على الشاشة واكسب المهارة!',
      color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      icon: PenTool
    },
    {
      id: 'word-builder',
      titleAr: 'كوّن الكلمة 🧩',
      titleEn: 'Word Builder',
      descriptionAr: 'رتب الحروف المبعثرة بالترتيب الصحيح لتكوين الكلمات!',
      color: 'bg-gradient-to-br from-purple-500 to-pink-600',
      icon: Puzzle
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 animate-fade-in">
      {/* Welcome Hero Greeting Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 p-6 sm:p-8 text-white shadow-xl shadow-orange-100">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-right space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold shadow-inner">
              <span>{user.childAvatar || '🧒'}</span>
              <span>مرحباً يا بطلنا الصغير {user.childName}! 🌟</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight font-display">
              هل أنت مستعد لتعلم الإنجليزية اليوم؟
            </h2>
            <p className="text-amber-50 text-xs sm:text-sm font-medium leading-relaxed">
              اختر قسماً أو ابدأ اللعب لجمع المزيد من النجوم الذهبية والأوسمة! ⭐
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                soundEffects.playPop();
                onNavigate('games');
              }}
              className="bg-white hover:bg-amber-50 text-slate-800 font-extrabold text-sm sm:text-base px-5 py-3 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Gamepad2 className="w-5 h-5 text-orange-500" />
              <span>العب واكسب نجوم 🎮</span>
            </button>
            <button
              onClick={() => {
                soundEffects.playPop();
                onNavigate('ai-teacher');
              }}
              className="bg-slate-900/30 hover:bg-slate-900/40 text-white font-extrabold text-sm sm:text-base px-5 py-3 rounded-2xl backdrop-blur-md border border-white/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Bot className="w-5 h-5 text-amber-200" />
              <span>المعلم الذكي 🤖</span>
            </button>
          </div>
        </div>

        {/* Decorative background bubbles */}
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-yellow-300/20 blur-xl pointer-events-none" />
      </div>

      {/* Daily Challenge Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-amber-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg">
              🏆
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">
                التحديات اليومية
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                أكمل التحديات لتحصل على مكافآت ونقاط مضاعفة!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl text-xs font-bold">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span>سلسلة {user.dailyStreak || 1} أيام</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {dailyChallenges.map((challenge) => {
            const isDone = challenge.completed || challenge.currentCount >= challenge.targetCount;
            return (
              <div 
                key={challenge.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isDone 
                    ? 'bg-emerald-50/70 border-emerald-200' 
                    : 'bg-slate-50/80 border-slate-100 hover:border-amber-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-bold text-xs text-slate-800 leading-tight">
                    {challenge.titleAr}
                  </h4>
                  <span className="text-xs font-black text-amber-600 shrink-0 flex items-center gap-0.5">
                    +{challenge.rewardStars} ⭐
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${isDone ? 'bg-emerald-500' : 'bg-amber-400'}`}
                      style={{ width: `${Math.min(100, (challenge.currentCount / challenge.targetCount) * 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
                    <span>{challenge.currentCount} من {challenge.targetCount}</span>
                    {isDone ? (
                      <span className="text-emerald-600 flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> مكتمل
                      </span>
                    ) : (
                      <span>قيد التقدم</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4 Super Interactive Kid Studios */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-lg sm:text-xl font-black text-slate-800 flex items-center gap-2">
            <span>✨</span>
            <span>استوديوهات التعلم التفاعلية</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {specialFeatures.map(feat => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                onClick={() => {
                  soundEffects.playPop();
                  onNavigate(feat.id);
                }}
                className={`${feat.color} text-white rounded-3xl p-5 shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-98 transition-all cursor-pointer flex flex-col justify-between min-h-[140px] group`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:rotate-6 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">
                    {feat.titleEn}
                  </span>
                </div>
                <div>
                  <h4 className="font-black text-base sm:text-lg mb-1">
                    {feat.titleAr}
                  </h4>
                  <p className="text-white/80 text-xs font-medium line-clamp-2">
                    {feat.descriptionAr}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Core Learning Categories Grid */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-800 flex items-center gap-2">
              <span>📚</span>
              <span>أقسام الدروس التعليمية</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              اضغط على أي قسم للاستماع ومشاهدة الدروس التفاعلية
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {coreSections.map(sec => (
            <div
              key={sec.id}
              onClick={() => {
                soundEffects.playPop();
                onNavigate(sec.id);
              }}
              className={`bg-white rounded-3xl p-5 border-2 ${sec.accentColor} hover:shadow-xl hover:border-amber-300 hover:-translate-y-1 active:translate-y-0 transition-all cursor-pointer group flex items-center gap-4`}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${sec.gradient} flex items-center justify-center text-3xl shadow-md shrink-0 group-hover:scale-110 transition-transform`}>
                {sec.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <h4 className="font-extrabold text-slate-800 text-base group-hover:text-amber-600 transition-colors truncate">
                    {sec.titleAr}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
                    {sec.badge}
                  </span>
                </div>
                <p className="text-xs font-bold text-amber-600 mb-0.5">
                  {sec.titleEn}
                </p>
                <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                  {sec.subtitleAr}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stories, Songs & Games Quick Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Stories Card */}
        <div 
          onClick={() => {
            soundEffects.playPop();
            onNavigate('stories');
          }}
          className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-3xl p-6 shadow-md hover:shadow-xl hover:scale-[1.02] cursor-pointer transition-all flex flex-col justify-between"
        >
          <div>
            <div className="text-4xl mb-2">📖</div>
            <h4 className="text-xl font-black mb-1">القصص التعليمية المصورة</h4>
            <p className="text-emerald-100 text-xs font-medium leading-relaxed">
              قصص قصيرة ومشوقة بالإنجليزية مع قراءة صوتية وأسئلة ذكاء بعد كل قصة.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs font-bold text-emerald-200">
            <span>استمع واقرأ الآن</span>
            <ArrowLeft className="w-4 h-4" />
          </div>
        </div>

        {/* Songs Card */}
        <div 
          onClick={() => {
            soundEffects.playPop();
            onNavigate('songs');
          }}
          className="bg-gradient-to-br from-purple-500 to-indigo-700 text-white rounded-3xl p-6 shadow-md hover:shadow-xl hover:scale-[1.02] cursor-pointer transition-all flex flex-col justify-between"
        >
          <div>
            <div className="text-4xl mb-2">🎵</div>
            <h4 className="text-xl font-black mb-1">الأناشيد التعليمية</h4>
            <p className="text-purple-100 text-xs font-medium leading-relaxed">
              أنشودة الحروف والأرقام والألوان لتسهيل الحفظ بطريقة إيقاعية ممتعة.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs font-bold text-purple-200">
            <span>استمع وغنِّ معنا</span>
            <ArrowLeft className="w-4 h-4" />
          </div>
        </div>

        {/* 12 Games Portal Card */}
        <div 
          onClick={() => {
            soundEffects.playPop();
            onNavigate('games');
          }}
          className="bg-gradient-to-br from-rose-500 to-orange-600 text-white rounded-3xl p-6 shadow-md hover:shadow-xl hover:scale-[1.02] cursor-pointer transition-all flex flex-col justify-between"
        >
          <div>
            <div className="text-4xl mb-2">🎮</div>
            <h4 className="text-xl font-black mb-1">قسم الألعاب الـ 12</h4>
            <p className="text-rose-100 text-xs font-medium leading-relaxed">
              وصل الحروف، الذاكرة، التحدي السريع، اسمع واختر، بازل الكلمات والمزيد!
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs font-bold text-rose-200">
            <span>ابدأ اللعب والمرح</span>
            <ArrowLeft className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
