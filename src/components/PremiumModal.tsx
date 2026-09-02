import React, { useState } from 'react';
import { 
  X, 
  Crown, 
  Check, 
  Sparkles, 
  Star, 
  ShieldCheck, 
  Gift, 
  ArrowLeft 
} from 'lucide-react';
import { SubscriptionPlan, UserProfile } from '../types';
import { soundEffects } from '../lib/sound';
import confetti from 'canvas-confetti';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: SubscriptionPlan[];
  user: UserProfile;
  onUpgrade: (planId: string) => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  plans,
  user,
  onUpgrade
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('yearly');
  const [giftCode, setGiftCode] = useState('');
  const [codeSuccess, setCodeSuccess] = useState(false);
  const [codeError, setCodeError] = useState('');

  if (!isOpen) return null;

  const handleSubscribe = (planId: string) => {
    soundEffects.playSuccess();
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 }
    });
    onUpgrade(planId);
  };

  const handleApplyGiftCode = (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError('');
    if (giftCode.trim().toUpperCase() === 'GM2026' || giftCode.trim().toUpperCase() === 'FREE' || giftCode.trim().toUpperCase() === 'SUPERKID') {
      soundEffects.playSuccess();
      confetti({ particleCount: 80, spread: 80 });
      setCodeSuccess(true);
      setTimeout(() => {
        onUpgrade('lifetime');
      }, 1200);
    } else {
      soundEffects.playError();
      setCodeError('رمز الهدية غير صالح. جرّب: GM2026 أو FREE');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border-2 border-amber-300 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white text-center">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center mb-3 shadow-inner">
            <Crown className="w-10 h-10 text-amber-200 fill-amber-200 animate-bounce" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-black font-display tracking-wide">
            GM English المميز (Premium) 👑
          </h3>
          <p className="text-amber-100 text-xs sm:text-sm font-bold mt-1">
            افتح جميع الدروس الـ 26، الألعاب الـ 12، المعلم الذكي غير المحدود وبدون أي إعلانات!
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Free */}
            <div className="p-5 rounded-3xl border-2 border-slate-200 bg-slate-50 space-y-3">
              <span className="text-xs font-black text-slate-500 block">الباقة الأساسية</span>
              <h4 className="text-xl font-black text-slate-800">مجاناً (Free)</h4>
              <ul className="space-y-2 text-xs text-slate-600 font-medium">
                <li className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>أول 5 حروف و 5 أرقام</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>3 ألعاب تعليمية</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>استوديو اكتب وانطق الأساسي</span>
                </li>
              </ul>
            </div>

            {/* Premium */}
            <div className="p-5 rounded-3xl border-2 border-amber-400 bg-amber-50/60 shadow-md space-y-3 relative overflow-hidden">
              <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-2xs">
                الأكثر طلباً ⭐
              </div>
              <span className="text-xs font-black text-amber-800 block">الباقة المفتوحة الشاملة</span>
              <h4 className="text-xl font-black text-amber-900">متميز (Premium) 💎</h4>
              <ul className="space-y-2 text-xs text-slate-800 font-bold">
                <li className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>فتح جميع الحروف (A-Z) كاملة</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>فتح جميع الألعاب الـ 12 التعليمية</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>المعلم الذكي Gemini AI للأطفال بلا حدود</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>توليد القصص التفاعلية الذكية</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Pricing Selector */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedPlanId('monthly')}
              className={`p-4 rounded-2xl border-2 text-right transition-all ${
                selectedPlanId === 'monthly'
                  ? 'border-amber-500 bg-amber-50/60 shadow-md'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <span className="text-xs font-bold text-slate-500 block">اشتراك شهري</span>
              <span className="text-lg font-black text-slate-900">$4.99 / شهر</span>
            </button>

            <button
              onClick={() => setSelectedPlanId('yearly')}
              className={`p-4 rounded-2xl border-2 text-right transition-all relative ${
                selectedPlanId === 'yearly'
                  ? 'border-amber-500 bg-amber-50/60 shadow-md'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full absolute top-2 left-2">
                وفر 40%
              </span>
              <span className="text-xs font-bold text-slate-500 block">اشتراك سنوي (موصى به)</span>
              <span className="text-lg font-black text-slate-900">$29.99 / سنة</span>
            </button>
          </div>

          {/* Direct Activation Button */}
          <button
            onClick={() => handleSubscribe(selectedPlanId)}
            className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:scale-[1.01] active:scale-98 text-white font-black text-base py-4 rounded-2xl shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-2"
          >
            <Crown className="w-5 h-5 text-amber-200 fill-amber-200" />
            <span>ترقية الحساب الآن إلى GM Premium 👑</span>
          </button>

          {/* Gift / Promo Code Section */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Gift className="w-4 h-4 text-purple-600" />
              <span>هل تملك كود هدية أو كود تفعيل مدرسي؟</span>
            </div>

            <form onSubmit={handleApplyGiftCode} className="flex gap-2">
              <input
                type="text"
                placeholder="أدخل الكود (مثلاً: GM2026 أو FREE)"
                value={giftCode}
                onChange={(e) => setGiftCode(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold uppercase"
              />
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors"
              >
                تفعيل الرمز
              </button>
            </form>

            {codeSuccess && (
              <p className="text-xs text-emerald-600 font-bold">
                🎉 تم تفعيل الاشتراك المتميز بنجاح! مبروك يا بطل!
              </p>
            )}
            {codeError && (
              <p className="text-xs text-rose-500 font-bold">
                {codeError}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
