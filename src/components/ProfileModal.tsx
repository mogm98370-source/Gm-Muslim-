import React, { useState } from 'react';
import { X, User, Check, LogOut, ShieldCheck, Sparkles, Mail, Lock } from 'lucide-react';
import { UserProfile } from '../types';
import { soundEffects } from '../lib/sound';
import { SUPER_ADMIN_EMAIL, isSuperAdmin } from '../lib/firebase';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateProfile: (name: string, avatar: string, age: number) => void;
  onOpenAuthScreen: () => void;
  onSignOut: () => Promise<void>;
  isAuthLoading?: boolean;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateProfile,
  onOpenAuthScreen,
  onSignOut,
  isAuthLoading = false
}) => {
  const [name, setName] = useState(user.childName || 'البطل الصغير');
  const [avatar, setAvatar] = useState(user.childAvatar || '🧒');
  const [age, setAge] = useState(user.childAge || 5);

  const avatars = ['🧒', '👧', '🦁', '🐼', '🦄', '🚀', '🐱', '🐶', '🦊', '🐻', '👑', '⭐'];
  const isAdmin = isSuperAdmin(user.email);
  const isSignedIn = Boolean(user.email && !user.uid.startsWith('guest-'));

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    soundEffects.playSuccess();
    onUpdateProfile(name.trim(), avatar, age);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" dir="rtl">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-400 to-orange-400 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{avatar}</span>
            <div>
              <h3 className="text-lg font-black leading-none">الملف الشخصي والحساب 🌟</h3>
              <p className="text-[11px] text-amber-100 font-bold mt-0.5">تسجيل الدخول وإعدادات البطل</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Account Info Section */}
        <div className="p-5 bg-slate-50 border-b border-slate-200">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-600" />
                <span className="text-xs font-black text-slate-800">حساب GM English</span>
              </div>

              {isSignedIn && (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  isAdmin ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {isAdmin ? <ShieldCheck className="w-3 h-3 text-amber-600" /> : <Sparkles className="w-3 h-3 text-emerald-600" />}
                  {isAdmin ? 'المشرف العام (Super Admin)' : 'مسجّل الدخول'}
                </span>
              )}
            </div>

            {isSignedIn ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="truncate font-bold text-slate-700 max-w-[200px]" dir="ltr">
                    {user.email}
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      soundEffects.playPop();
                      await onSignOut();
                      onClose();
                    }}
                    disabled={isAuthLoading}
                    className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-black text-xs px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
                {isAdmin && (
                  <p className="text-[11px] text-amber-800 font-bold bg-amber-50 p-2 rounded-xl border border-amber-200">
                    👑 هذا الحساب يمتلك صلاحية المشرف العام الكاملة ({SUPER_ADMIN_EMAIL}).
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-slate-600 font-bold leading-relaxed">
                  سجّل الدخول بالبريد الإلكتروني لحفظ نجوم الطفل ومزامنة تقدمه بأمان.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playPop();
                    onClose();
                    onOpenAuthScreen();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white font-black text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>تسجيل الدخول بالبريد وكلمة المرور</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Child Profile Customization Form */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Avatar Choice */}
          <div>
            <label className="text-xs font-black text-slate-700 block mb-2">
              اختر الشخصية الرمزية للطفل (Avatar):
            </label>
            <div className="grid grid-cols-6 gap-2">
              {avatars.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => {
                    soundEffects.playPop();
                    setAvatar(av);
                  }}
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl transition-all cursor-pointer ${
                    avatar === av
                      ? 'bg-amber-100 border-2 border-amber-500 scale-105 shadow-xs'
                      : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Child Name */}
          <div>
            <label className="text-xs font-black text-slate-700 block mb-1">
              اسم البطل الصغير:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white outline-none focus:border-amber-400"
              placeholder="مثال: يوسف، سارة..."
              required
            />
          </div>

          {/* Child Age */}
          <div>
            <label className="text-xs font-black text-slate-700 block mb-1">
              عمر الطفل (سنوات):
            </label>
            <div className="flex gap-2">
              {[3, 4, 5, 6, 7].map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => {
                    soundEffects.playPop();
                    setAge(a);
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    age === a
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {a} سنوات
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-white font-black text-sm py-3 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>حفظ التعديلات</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
