import React from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Crown, 
  ShieldCheck, 
  Lock, 
  User, 
  Flame, 
  LogOut,
  LogIn
} from 'lucide-react';
import { UserProfile } from '../types';
import { soundEffects } from '../lib/sound';

interface HeaderProps {
  user: UserProfile;
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenParentGate: (targetView: string) => void;
  onOpenAuth: () => void;
  onOpenPremium: () => void;
  onSignOut: () => void;
  isMuted: boolean;
  onToggleSound: () => void;
  isSuperAdminUser: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  currentView,
  onNavigate,
  onOpenParentGate,
  onOpenAuth,
  onOpenPremium,
  onSignOut,
  isMuted,
  onToggleSound,
  isSuperAdminUser
}) => {
  const isSignedIn = Boolean(user.email && !user.uid.startsWith('guest-'));
  const starsCount = user.totalStars ?? user.stars ?? 0;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-xs px-3 sm:px-6 py-2.5 transition-all" dir="rtl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Brand / Logo */}
        <div 
          onClick={() => {
            soundEffects.playPop();
            onNavigate('home');
          }}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-400 to-rose-400 flex items-center justify-center text-white shadow-md shadow-orange-200 group-hover:scale-105 transition-transform">
            <span className="font-extrabold text-base sm:text-lg tracking-tight font-display">GM</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-black text-slate-800 text-base sm:text-lg tracking-tight leading-none">
                GM English
              </h1>
              {(user.isPremium || isSuperAdminUser) && (
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-xs flex items-center gap-0.5">
                  <Crown className="w-2.5 h-2.5" /> VIP
                </span>
              )}
            </div>
            <p className="text-[11px] font-bold text-amber-600 leading-tight hidden sm:block">
              تعلّم • العب • انطق
            </p>
          </div>
        </div>

        {/* Stats & Child Profile Info */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Stars counter */}
          <button 
            onClick={() => {
              soundEffects.playStarCollect();
              onNavigate('progress');
            }}
            className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-900 px-2.5 sm:px-3 py-1.5 rounded-2xl transition-all shadow-xs cursor-pointer"
            title="النجوم التي جمعتها"
          >
            <span className="text-base sm:text-lg leading-none">⭐</span>
            <span className="font-black text-xs sm:text-sm">{starsCount}</span>
          </button>

          {/* Daily streak */}
          <button 
            onClick={() => {
              soundEffects.playPop();
              onNavigate('progress');
            }}
            className="hidden xs:flex items-center gap-1 bg-orange-50 border border-orange-200 hover:bg-orange-100 text-orange-900 px-2.5 sm:px-3 py-1.5 rounded-2xl transition-all shadow-xs cursor-pointer"
            title="أيام التعلم المتتالية"
          >
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span className="font-black text-xs sm:text-sm">{user.dailyStreak || 1}</span>
          </button>

          {/* Premium CTA Button */}
          {!user.isPremium && !isSuperAdminUser ? (
            <button
              onClick={() => {
                soundEffects.playStarCollect();
                onOpenPremium();
              }}
              className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-white font-black text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl shadow-md shadow-orange-200 hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Crown className="w-4 h-4 text-amber-100" />
              <span className="hidden sm:inline">ترقية</span>
              <span>Premium</span>
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black px-2.5 py-1.5 rounded-2xl">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>مفعّل VIP</span>
            </div>
          )}

          {/* Sound Mute/Unmute */}
          <button
            onClick={onToggleSound}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
            title={isMuted ? "تشغيل الأصوات" : "كتم الأصوات"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
          </button>

          {/* Parent Zone Protection Lock Button */}
          <button
            onClick={() => {
              soundEffects.playPop();
              onOpenParentGate('parent');
            }}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-black transition-all shadow-xs cursor-pointer"
            title="قسم الوالدين (محمي)"
          >
            <Lock className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden md:inline">قسم الوالدين</span>
          </button>

          {/* Super Admin Panel Button — STRICTLY for larblaablaybla@gmail.com */}
          {isSuperAdminUser && (
            <button
              onClick={() => {
                soundEffects.playPop();
                onOpenParentGate('admin');
              }}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl border border-amber-400 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-black transition-all shadow-md shadow-amber-200 cursor-pointer"
              title="لوحة تحكم المشرف العام"
            >
              <ShieldCheck className="w-4 h-4 text-amber-100" />
              <span className="hidden lg:inline">لوحة الإشراف (Admin)</span>
            </button>
          )}

          {/* User Profile / Logout Button */}
          {isSignedIn ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  soundEffects.playPop();
                  onOpenAuth();
                }}
                className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-2xl border border-amber-200 bg-amber-50 hover:bg-amber-100 transition-colors cursor-pointer"
                title="الملف الشخصي"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center text-lg shadow-inner">
                  {user.childAvatar || '🧒'}
                </div>
                <span className="font-bold text-xs text-slate-700 hidden lg:inline max-w-[80px] truncate">
                  {user.childName || 'البطل'}
                </span>
              </button>

              <button
                onClick={() => {
                  soundEffects.playPop();
                  onOpenParentGate('logout');
                }}
                className="w-9 h-9 rounded-2xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                title="تسجيل الخروج"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                soundEffects.playPop();
                onOpenAuth();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-white rounded-2xl text-xs font-black transition-all shadow-xs cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>تسجيل الدخول</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
