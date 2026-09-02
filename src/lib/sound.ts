// Web Audio API Synthesizer & Speech Engine for GM English

class SoundEffectsEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Pleasant bubble pop sound on button tap
  playPop(pitch = 600) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(pitch * 1.5, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch {
      // Audio fallback silent
    }
  }

  // Star collect reward sound (magical chime)
  playStarCollect() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.07);

        gain.gain.setValueAtTime(0.25, this.ctx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.07 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.07);
        osc.stop(this.ctx.currentTime + idx * 0.07 + 0.26);
      });
    } catch {}
  }

  // Success fanfare on answering correctly
  playSuccess() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const chords = [
        { freq: 440, time: 0 },
        { freq: 554.37, time: 0.08 },
        { freq: 659.25, time: 0.16 },
        { freq: 880, time: 0.24 }
      ];
      chords.forEach(({ freq, time }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + time);
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime + time);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + time + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + time);
        osc.stop(this.ctx.currentTime + time + 0.36);
      });
    } catch {}
  }

  // Soft gentle 'oops' boop for wrong answer (encouraging, not scary)
  playError() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(220, this.ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.21);
    } catch {}
  }

  // Level up victory fanfare
  playLevelUp() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const notes = [440, 554, 659, 880, 1108];
      notes.forEach((f, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, this.ctx.currentTime + i * 0.1);
        gain.gain.setValueAtTime(0.35, this.ctx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.1 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.1);
        osc.stop(this.ctx.currentTime + i * 0.1 + 0.45);
      });
    } catch {}
  }

  // Victory sound on completing games or challenges
  playVictory() {
    this.playLevelUp();
  }
}

export const soundEffects = new SoundEffectsEngine();

// Speech Synthesis for English with kid-friendly slow and clear pronunciation
export function speakEnglish(text: string, rate = 0.85, pitch = 1.1): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = rate; // Slightly slower for kids
      utterance.pitch = pitch; // Friendly slightly higher pitch

      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Zira'))) 
        || voices.find(v => v.lang.startsWith('en'));
      
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
    } catch {
      resolve();
    }
  });
}

export function speakArabic(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.9;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
    } catch {
      resolve();
    }
  });
}

// Browser Speech Recognition for "Repeat After Me" (كرر معي)
export interface SpeechRecognitionResultObject {
  transcript: string;
  isMatch: boolean;
  confidence: number;
}

export function startSpeechRecognition(
  targetWord: string,
  onResult: (res: SpeechRecognitionResultObject) => void,
  onError: (err: string) => void,
  onStart?: () => void
): { stop: () => void } {
  const SpeechRecognition = (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition || (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError('الميكروفون غير مدعوم في هذا المتصفح. يمكنك تجربة متصفح Google Chrome.');
    return { stop: () => {} };
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;
    recognition.continuous = false;

    recognition.onstart = () => {
      if (onStart) onStart();
    };

    recognition.onresult = (event: any) => {
      const results = event.results[0];
      const transcript = results[0].transcript.trim().toLowerCase();
      const confidence = results[0].confidence || 0.8;

      const cleanTarget = targetWord.trim().toLowerCase().replace(/[^a-z0-9 ]/g, '');
      const cleanTranscript = transcript.replace(/[^a-z0-9 ]/g, '');

      // Check direct match or includes target word
      const isMatch = cleanTranscript === cleanTarget || 
        cleanTranscript.includes(cleanTarget) ||
        cleanTarget.includes(cleanTranscript) ||
        (cleanTranscript.length > 2 && cleanTarget.length > 2 && (cleanTranscript.slice(0, 3) === cleanTarget.slice(0, 3)));

      onResult({
        transcript,
        isMatch,
        confidence
      });
    };

    recognition.onerror = (e: any) => {
      if (e.error === 'no-speech') {
        onError('لم نسمع أي صوت، اضغط على الميكروفون وتحدث بصوت واضح!');
      } else if (e.error === 'not-allowed') {
        onError('يرجى السماح بالوصول إلى الميكروفون لتكرار الكلمة.');
      } else {
        onError(`حدث خطأ أثناء التسجيل: ${e.error || 'يرجى المحاولة مجدداً'}`);
      }
    };

    recognition.start();

    return {
      stop: () => {
        try {
          recognition.stop();
        } catch {}
      }
    };
  } catch (err) {
    onError('تعذر تشغيل الميكروفون.');
    return { stop: () => {} };
  }
}
