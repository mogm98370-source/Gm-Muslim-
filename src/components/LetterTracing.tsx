import React, { useRef, useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Volume2, 
  Trash2, 
  RotateCcw, 
  Check, 
  Star, 
  Sparkles, 
  Palette, 
  PenTool,
  Award 
} from 'lucide-react';
import { LetterItem, UserProfile } from '../types';
import { speakEnglish, soundEffects } from '../lib/sound';
import confetti from 'canvas-confetti';

interface LetterTracingProps {
  letters: LetterItem[];
  user: UserProfile;
  initialLetter?: string;
  onBack: () => void;
  onReward: (stars: number) => void;
}

export const LetterTracing: React.FC<LetterTracingProps> = ({
  letters,
  user,
  initialLetter = 'A',
  onBack,
  onReward
}) => {
  const [selectedLetterChar, setSelectedLetterChar] = useState<string>(initialLetter);
  const [brushColor, setBrushColor] = useState<string>('#3B82F6');
  const [brushSize, setBrushSize] = useState<number>(18);
  const [hasDrawn, setHasDrawn] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  const colors = [
    { name: 'Blue', hex: '#3B82F6' },
    { name: 'Red', hex: '#EF4444' },
    { name: 'Green', hex: '#10B981' },
    { name: 'Purple', hex: '#8B5CF6' },
    { name: 'Orange', hex: '#F97316' },
    { name: 'Pink', hex: '#EC4899' }
  ];

  const currentLetterObj = letters.find(l => l.letter === selectedLetterChar) || letters[0];

  useEffect(() => {
    drawGuideLetter();
  }, [selectedLetterChar]);

  const drawGuideLetter = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background guide grid lines
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);

    // Top line
    ctx.beginPath();
    ctx.moveTo(30, 80);
    ctx.lineTo(canvas.width - 30, 80);
    ctx.stroke();

    // Middle dashed line
    ctx.beginPath();
    ctx.moveTo(30, canvas.height / 2);
    ctx.lineTo(canvas.width - 30, canvas.height / 2);
    ctx.stroke();

    // Bottom baseline
    ctx.beginPath();
    ctx.moveTo(30, canvas.height - 80);
    ctx.lineTo(canvas.width - 30, canvas.height - 80);
    ctx.stroke();

    // Draw big dotted guide letter
    ctx.setLineDash([]);
    ctx.font = 'bold 220px Fredoka, sans-serif';
    ctx.fillStyle = '#CBD5E1';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(selectedLetterChar, canvas.width / 2, canvas.height / 2);

    setHasDrawn(false);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isDrawingRef.current = true;
    setHasDrawn(true);

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);

    soundEffects.playPop(800);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const handleFinishTracing = () => {
    if (!hasDrawn) {
      soundEffects.playError();
      return;
    }
    soundEffects.playSuccess();
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 }
    });
    onReward(5);
    speakEnglish(`Great job! You wrote the letter ${selectedLetterChar}!`);
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
            <span>✏️</span>
            <span>اكتب وارسم الحرف (Letter Tracing)</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            تتبع خطوط الحرف بإصبعك على الشاشة لتعلم كتابته بدقة!
          </p>
        </div>

        <button
          onClick={() => speakEnglish(selectedLetterChar)}
          className="bg-amber-100 text-amber-900 font-bold text-xs px-3 py-2 rounded-2xl hover:bg-amber-200 transition-colors flex items-center gap-1"
        >
          <Volume2 className="w-4 h-4" />
          <span>نطق الحرف</span>
        </button>
      </div>

      {/* Main Canvas Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-blue-200 shadow-xl space-y-6">
        {/* Canvas & Controls Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Color Picker */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">لون القلم:</span>
            {colors.map(c => (
              <button
                key={c.hex}
                onClick={() => {
                  soundEffects.playPop();
                  setBrushColor(c.hex);
                }}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  brushColor === c.hex ? 'scale-125 border-slate-800 shadow-md' : 'border-white'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>

          {/* Reset & Undo */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEffects.playPop();
                drawGuideLetter();
              }}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-rose-500" />
              <span>مسح</span>
            </button>
          </div>
        </div>

        {/* Tracing HTML5 Canvas */}
        <div className="relative flex justify-center bg-slate-50 rounded-3xl p-4 border-2 border-slate-200 overflow-hidden touch-none">
          <canvas
            ref={canvasRef}
            width={600}
            height={380}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full max-w-[600px] h-[320px] sm:h-[380px] bg-white rounded-2xl shadow-inner border border-slate-200 cursor-crosshair"
          />
        </div>

        {/* Finish / Reward Button */}
        <button
          onClick={handleFinishTracing}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 active:scale-98 text-white font-black text-lg py-4 px-6 rounded-3xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
        >
          <Check className="w-6 h-6" />
          <span>أكملت كتابة الحرف! ⭐ (+5 نجوم)</span>
        </button>
      </div>

      {/* Alphabet Picker */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm">
        <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm mb-3">
          اختر حرفاً آخر لكتابته:
        </h4>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {letters.map(l => (
            <button
              key={l.id}
              onClick={() => {
                soundEffects.playPop();
                setSelectedLetterChar(l.letter);
              }}
              className={`w-12 h-12 shrink-0 rounded-2xl font-black text-xl font-display transition-all ${
                selectedLetterChar === l.letter
                  ? 'bg-blue-600 text-white shadow-md scale-105'
                  : 'bg-slate-100 hover:bg-blue-50 text-slate-800'
              }`}
            >
              {l.letter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
