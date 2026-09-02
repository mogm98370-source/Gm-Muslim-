import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound, 
  Eye, 
  EyeOff,
  Star,
  Crown,
  BookOpen
} from 'lucide-react';
import { signUpWithEmail, signInWithEmail, sendResetPassword, SUPER_ADMIN_EMAIL } from '../lib/firebase';
import { soundEffects } from '../lib/sound';
import { UserProfile } from '../types';

interface AuthScreenProps {
  isOpen?: boolean;
  onClose?: () => void;
  onAuthSuccess: (profile: UserProfile) => void;
  onContinueAsGuest?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ 
  isOpen = true, 
  onClose, 
  onAuthSuccess, 
  onContinueAsGuest 
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  
  if (!isOpen) return null;
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [childName, setChildName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🧒');
  const [showPassword, setShowPassword] = useState(false);

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const avatars = ['🧒', '👧', '🦁', '🐼', '🦄', '🚀', '🐱', '🐶', '🦊', '🐻', '👑', '⭐'];

  const getArabicFirebaseError = (error: any): string => {
    const code = error?.code || '';
    switch (code) {
      case 'auth/invalid-email':
        return 'البريد الإلكتروني المدخل غير صالح.';
      case 'auth/user-disabled':
        return 'هذا الحساب تم إيقافه مؤقتاً، يرجى التواصل مع الإدارة.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
      case 'auth/email-already-in-use':
        return 'هذا البريد الإلكتروني مسجل مسبقاً، يمكنك تسجيل الدخول به.';
      case 'auth/weak-password':
        return 'كلمة المرور ضعيفة، يجب أن تتكون من 6 أحرف أو أرقام على الأقل.';
      case 'auth/too-many-requests':
        return 'تم إدخال محاولات خاطئة كثيرة، يرجى الانتظار قليلاً أو إعادة تعيين كلمة المرور.';
      default:
        return error?.message || 'حدث خطأ غير متوقع، يرجى المحاولة ثانية.';
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setErrorMessage('يرجى ملء جميع الحقول المطلوبة.');
      soundEffects.playError();
      return;
    }

    try {
      setIsLoading(true);
      const user = await signInWithEmail(email, password);
      soundEffects.playSuccess();
    } catch (err: any) {
      soundEffects.playError();
      setErrorMessage(getArabicFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !password || !confirmPassword) {
      setErrorMessage('يرجى ملء كافة حقول البريد وكلمة المرور.');
      soundEffects.playError();
      return;
    }

    if (password.length < 6) {
      setErrorMessage('يجب أن لا تقل كلمة المرور عن 6 خانات.');
      soundEffects.playError();
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('كلمتا المرور غير متطابقتين.');
      soundEffects.playError();
      return;
    }

    try {
      setIsLoading(true);
      const finalChildName = childName.trim() || 'البطل الصغير';
      const newProfile = await signUpWithEmail(email, password, finalChildName);
      soundEffects.playSuccess();
      onAuthSuccess({
        ...newProfile,
        childAvatar: selectedAvatar
      });
    } catch (err: any) {
      soundEffects.playError();
      setErrorMessage(getArabicFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email) {
      setErrorMessage('يرجى إدخال البريد الإلكتروني لإرسال الرابط.');
      soundEffects.playError();
      return;
    }

    try {
      setIsLoading(true);
      await sendResetPassword(email);
      soundEffects.playSuccess();
      setSuccessMessage('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني بنجاح!');
    } catch (err: any) {
      soundEffects.playError();
      setErrorMessage(getArabicFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 selection:bg-amber-400 selection:text-white" dir="rtl">
      {/* Decorative background badges */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-25">
        <div className="absolute top-10 left-10 text-6xl animate-bounce">🎈</div>
        <div className="absolute top-20 right-20 text-6xl animate-pulse">🌟</div>
        <div className="absolute bottom-10 left-20 text-6xl animate-bounce" style={{ animationDelay: '1s' }}>🚀</div>
        <div className="absolute bottom-20 right-10 text-6xl animate-pulse" style={{ animationDelay: '1.5s' }}>🧸</div>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border-2 border-amber-200/80 overflow-hidden relative z-10 my-auto animate-fade-in">
        {/* Header Branding */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 p-5 sm:p-6 text-white text-center relative shadow-md">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-colors cursor-pointer"
              title="إغلاق"
            >
              ✕
            </button>
          )}

          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 backdrop-blur-sm shadow-inner mb-2 sm:mb-3 border border-white/40">
            <span className="text-2xl sm:text-3xl">🦁</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">GM English</h1>
          <p className="text-xs sm:text-sm font-bold text-amber-100 mt-1">
            تعلّم • العب • انطق
          </p>

          <div className="mt-3 sm:mt-4 flex items-center justify-center gap-1.5 bg-black/15 py-1 px-3 rounded-full w-max mx-auto border border-white/20 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>بوابة التعليم التفاعلية للأطفال</span>
          </div>
        </div>

        {/* Navigation Tabs (Sign In / Sign Up) */}
        <div className="flex border-b border-slate-200 bg-slate-50/80">
          <button
            type="button"
            onClick={() => {
              soundEffects.playPop();
              setMode('signin');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-3.5 text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 ${
              mode === 'signin'
                ? 'bg-white text-orange-600 border-b-2 border-orange-500 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>تسجيل الدخول</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playPop();
              setMode('signup');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-3.5 text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 ${
              mode === 'signup'
                ? 'bg-white text-orange-600 border-b-2 border-orange-500 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>إنشاء حساب جديد</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 space-y-5">
          {/* Notification Messages */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    dir="ltr"
                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-orange-500 focus:bg-white rounded-2xl px-4 py-3 text-sm text-slate-800 font-bold outline-none transition-all pl-11"
                  />
                  <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-black text-slate-700">
                    كلمة المرور
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playPop();
                      setMode('forgot');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="text-[11px] font-black text-orange-600 hover:text-orange-700 hover:underline"
                  >
                    نسيت كلمة المرور؟
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    dir="ltr"
                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-orange-500 focus:bg-white rounded-2xl px-4 py-3 text-sm text-slate-800 font-bold outline-none transition-all pl-11 pr-11"
                  />
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm py-3.5 px-4 rounded-2xl shadow-lg shadow-orange-300 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>تسجيل الدخول</span>
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </>
                )}
              </button>

              {onContinueAsGuest && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playPop();
                      onContinueAsGuest();
                    }}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs py-3 px-4 rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>الدخول كزائر للتجربة السريعة</span>
                    <ArrowRight className="w-3.5 h-3.5 rotate-180 text-slate-400" />
                  </button>
                </div>
              )}

              <div className="pt-1 text-center text-[11px] text-slate-400 font-bold">
                تسجيل الدخول محمي عبر Firebase Authentication 🔒
              </div>
            </form>
          )}

          {/* SIGN UP FORM */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  اسم الطفل / البطل
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="مثال: يوسف البطل"
                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-orange-500 focus:bg-white rounded-2xl px-4 py-2.5 text-sm text-slate-800 font-bold outline-none transition-all pl-11"
                  />
                  <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              {/* Avatar Picker */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  اختر شخصية البطل (Avatar)
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {avatars.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => {
                        soundEffects.playPop();
                        setSelectedAvatar(av);
                      }}
                      className={`h-11 rounded-xl text-xl flex items-center justify-center transition-all ${
                        selectedAvatar === av
                          ? 'bg-amber-100 border-2 border-amber-500 scale-110 shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    dir="ltr"
                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-orange-500 focus:bg-white rounded-2xl px-4 py-2.5 text-sm text-slate-800 font-bold outline-none transition-all pl-11"
                  />
                  <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  كلمة المرور (6 خانات على الأقل)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    dir="ltr"
                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-orange-500 focus:bg-white rounded-2xl px-4 py-2.5 text-sm text-slate-800 font-bold outline-none transition-all pl-11 pr-11"
                  />
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    dir="ltr"
                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-orange-500 focus:bg-white rounded-2xl px-4 py-2.5 text-sm text-slate-800 font-bold outline-none transition-all pl-11 pr-11"
                  />
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-sm py-3.5 px-4 rounded-2xl shadow-lg shadow-emerald-200 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    <span>إنشاء الحساب وبدء التعلم 🚀</span>
                  </>
                )}
              </button>

              {onContinueAsGuest && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playPop();
                      onContinueAsGuest();
                    }}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs py-3 px-4 rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>الدخول كزائر للتجربة السريعة</span>
                    <ArrowRight className="w-3.5 h-3.5 rotate-180 text-slate-400" />
                  </button>
                </div>
              )}
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-sm font-black text-slate-800">إعادة تعيين كلمة المرور</h3>
                <p className="text-xs text-slate-500">
                  أدخل بريدك الإلكتروني المسجل وسنرسل لك رابطاً مباشراً لتعيين كلمة مرور جديدة.
                </p>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    dir="ltr"
                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-orange-500 focus:bg-white rounded-2xl px-4 py-3 text-sm text-slate-800 font-bold outline-none transition-all pl-11"
                  />
                  <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm py-3.5 px-4 rounded-2xl shadow-lg shadow-orange-200 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>إرسال رابط إعادة التعيين</span>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playPop();
                    setMode('signin');
                  }}
                  className="text-xs font-black text-slate-600 hover:text-slate-900 underline"
                >
                  العودة لتسجيل الدخول
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
          <p className="text-[11px] text-slate-500 font-bold">
            GM English © 2026 • منصة تعليم الإنجليزية للمبتدئين
          </p>
        </div>
      </div>
    </div>
  );
};
