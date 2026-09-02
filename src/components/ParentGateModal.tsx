import React, { useState, useEffect } from 'react';
import { Lock, X, Check, ShieldAlert } from 'lucide-react';
import { soundEffects } from '../lib/sound';

interface ParentGateModalProps {
  isOpen: boolean;
  targetView: string;
  onClose: () => void;
  onSuccess: (targetView: string) => void;
  savedPin?: string;
}

export const ParentGateModal: React.FC<ParentGateModalProps> = ({
  isOpen,
  targetView,
  onClose,
  onSuccess,
  savedPin
}) => {
  const [num1, setNum1] = useState(4);
  const [num2, setNum2] = useState(5);
  const [inputVal, setInputVal] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [mode, setMode] = useState<'math' | 'pin'>('math');

  useEffect(() => {
    if (isOpen) {
      // Generate randomized multiplication or addition math challenge
      const n1 = Math.floor(Math.random() * 8) + 3;
      const n2 = Math.floor(Math.random() * 7) + 2;
      setNum1(n1);
      setNum2(n2);
      setInputVal('');
      setErrorMsg('');
      if (savedPin && savedPin.length === 4) {
        setMode('pin');
      } else {
        setMode('math');
      }
    }
  }, [isOpen, savedPin]);

  if (!isOpen) return null;

  const correctAnswer = num1 * num2;

  const handleVerify = () => {
    if (mode === 'math') {
      if (parseInt(inputVal, 10) === correctAnswer) {
        soundEffects.playSuccess();
        onSuccess(targetView);
        onClose();
      } else {
        soundEffects.playError();
        setErrorMsg('إجابة غير صحيحة، يرجى المحاولة مرة أخرى.');
        setInputVal('');
      }
    } else {
      if (inputVal === savedPin) {
        soundEffects.playSuccess();
        onSuccess(targetView);
        onClose();
      } else {
        soundEffects.playError();
        setErrorMsg('رمز PIN غير صحيح.');
        setInputVal('');
      }
    }
  };

  const handleNumberPad = (val: string) => {
    soundEffects.playPop();
    if (inputVal.length < 6) {
      setInputVal(prev => prev + val);
    }
  };

  const handleDelete = () => {
    soundEffects.playPop();
    setInputVal(prev => prev.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border-4 border-amber-200 text-center relative">
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-inner">
          <Lock className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-black text-slate-800 mb-1">
          منطقة مخصصة للوالدين 🔒
        </h3>
        <p className="text-xs text-slate-500 mb-4 font-medium leading-relaxed">
          {mode === 'math' 
            ? 'لحماية الأطفال، يرجى حل هذه المسألة الرياضية البسيطة للمتابعة:' 
            : 'أدخل رمز PIN الخاص بولي الأمر للدخول:'}
        </p>

        {mode === 'math' ? (
          <div className="bg-amber-50 rounded-2xl p-4 mb-4 border border-amber-200 flex items-center justify-center gap-3 text-2xl font-black text-amber-900">
            <span>{num1}</span>
            <span>×</span>
            <span>{num2}</span>
            <span>=</span>
            <span className="min-w-[60px] h-10 bg-white border-2 border-amber-400 rounded-xl flex items-center justify-center text-amber-700 font-mono">
              {inputVal || '?'}
            </span>
          </div>
        ) : (
          <div className="bg-indigo-50 rounded-2xl p-4 mb-4 border border-indigo-200 flex items-center justify-center gap-2">
            {[0, 1, 2, 3].map(idx => (
              <div 
                key={idx} 
                className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center text-lg font-bold font-mono transition-all ${
                  inputVal[idx] ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-indigo-200 text-slate-400'
                }`}
              >
                {inputVal[idx] ? '•' : ''}
              </div>
            ))}
          </div>
        )}

        {errorMsg && (
          <p className="text-xs font-bold text-rose-500 mb-3 bg-rose-50 py-1.5 px-3 rounded-xl">
            {errorMsg}
          </p>
        )}

        {/* Numeric keypad */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(n => (
            <button
              key={n}
              onClick={() => handleNumberPad(n)}
              className="h-12 bg-slate-100 hover:bg-amber-100 hover:text-amber-800 text-slate-800 font-bold text-lg rounded-2xl transition-all active:scale-95 shadow-xs"
            >
              {n}
            </button>
          ))}
          <button
            onClick={handleDelete}
            className="h-12 bg-rose-50 text-rose-600 font-bold text-sm rounded-2xl hover:bg-rose-100 transition-all active:scale-95"
          >
            مسح
          </button>
          <button
            onClick={() => handleNumberPad('0')}
            className="h-12 bg-slate-100 hover:bg-amber-100 text-slate-800 font-bold text-lg rounded-2xl transition-all active:scale-95"
          >
            0
          </button>
          <button
            onClick={handleVerify}
            className="h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all active:scale-95 flex items-center justify-center shadow-md shadow-emerald-200"
          >
            <Check className="w-5 h-5" />
          </button>
        </div>

        {savedPin && (
          <button
            onClick={() => {
              setMode(m => m === 'math' ? 'pin' : 'math');
              setInputVal('');
              setErrorMsg('');
            }}
            className="text-[11px] font-bold text-amber-600 hover:underline"
          >
            {mode === 'math' ? 'استخدم رمز PIN بدلاً من ذلك' : 'استخدم المسألة الرياضية بدلاً من ذلك'}
          </button>
        )}
      </div>
    </div>
  );
};
