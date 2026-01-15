
import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Sparkle } from 'lucide-react';

export interface QuantumAudioProps {
  intensity: number; // 0 to 100
  isActive: boolean;
  keywords?: string[];
  shouldPrompt?: boolean;
}

export type QuantumSoundType = 'primary' | 'navigation' | 'toggle' | 'alert' | 'soft' | 'sharp';

/**
 * محرك الصوت الكمي المطور:
 * يستخدم تقنيات FM Synthesis و Additive Synthesis لخلق أصوات "فضائية" و"رقمية" نظيفة.
 */
export const playQuantumPing = (type: QuantumSoundType = 'soft') => {
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const masterGain = audioCtx.createGain();
  masterGain.connect(audioCtx.destination);
  const now = audioCtx.currentTime;

  if (type === 'primary') {
    // صوت "الرنين البلوري المتصاعد" للفعل الأساسي
    const freqs = [523.25, 1046.50, 1567.98]; // نغمات C5, C6, G6
    freqs.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      
      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, now + 0.1);

      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.15 / (i + 1), now + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      osc.connect(g);
      g.connect(masterGain);
      osc.start();
      osc.stop(now + 0.5);
    });
  } else if (type === 'navigation') {
    // صوت "النبضة الكمية" القصيرة للملاحة والتنقل
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);

    g.gain.setValueAtTime(0.08, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(g);
    g.connect(masterGain);
    osc.start();
    osc.stop(now + 0.1);
  } else if (type === 'toggle') {
    // صوت مزدوج سريع للتبديل (تشغيل/إيقاف)
    const osc = audioCtx.createOscillator();
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(1100, now + 0.05);
    
    masterGain.gain.setValueAtTime(0.05, now);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
    
    osc.connect(masterGain);
    osc.start();
    osc.stop(now + 0.1);
  } else {
    // الصوت الافتراضي الناعم
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(type === 'sharp' ? 1400 : 880, now);
    osc.frequency.exponentialRampToValueAtTime(type === 'sharp' ? 200 : 440, now + 0.15);

    masterGain.gain.setValueAtTime(0.1, now);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

    osc.connect(masterGain);
    osc.start();
    osc.stop(now + 0.2);
  }
};

/**
 * صوت "مرساة الواقع" (Anchoring Sound):
 * صوت عميق ورنان يعبر عن تثبيت النية في الحقل الموحد.
 */
export const playAnchoringSound = () => {
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const now = audioCtx.currentTime;
  const masterGain = audioCtx.createGain();
  masterGain.connect(audioCtx.destination);

  // 1. الضربة العميقة (Sub-frequency)
  const sub = audioCtx.createOscillator();
  const subGain = audioCtx.createGain();
  sub.type = 'sine';
  sub.frequency.setValueAtTime(55, now);
  sub.frequency.exponentialRampToValueAtTime(40, now + 2);
  subGain.gain.setValueAtTime(0.4, now);
  subGain.gain.exponentialRampToValueAtTime(0.0001, now + 2);
  sub.connect(subGain);
  subGain.connect(masterGain);
  sub.start();
  sub.stop(now + 2);

  // 2. الرنين المعدني العلوي (FM Synthesis)
  const carrier = audioCtx.createOscillator();
  const modulator = audioCtx.createOscillator();
  const modGain = audioCtx.createGain();
  const carrierGain = audioCtx.createGain();

  carrier.type = 'sine';
  carrier.frequency.setValueAtTime(220, now);
  
  modulator.type = 'sine';
  modulator.frequency.setValueAtTime(330, now);
  modGain.gain.setValueAtTime(150, now);
  modGain.gain.exponentialRampToValueAtTime(10, now + 1.5);

  carrierGain.gain.setValueAtTime(0.2, now);
  carrierGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

  modulator.connect(modGain);
  modGain.connect(carrier.frequency);
  carrier.connect(carrierGain);
  carrierGain.connect(masterGain);

  carrier.start();
  modulator.start();
  carrier.stop(now + 2.5);
  modulator.stop(now + 2.5);
};

export const QuantumAudio: React.FC<QuantumAudioProps> = ({ intensity, isActive, keywords = [], shouldPrompt = false }) => {
  const [isMuted, setIsMuted] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const droneOscRef = useRef<OscillatorNode | null>(null);
  const harmonicOscRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const noiseGainRef = useRef<GainNode | null>(null);

  const initAudio = () => {
    if (audioCtxRef.current) return;
    audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    const ctx = audioCtxRef.current;

    const drone = ctx.createOscillator();
    drone.type = 'sine';
    drone.frequency.setValueAtTime(136.1, ctx.currentTime);

    const harmonic = ctx.createOscillator();
    harmonic.type = 'triangle';
    harmonic.frequency.setValueAtTime(272.2, ctx.currentTime);

    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0, b1, b2, b3, b4, b5, b6;
    b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;
    
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0, ctx.currentTime);
    noiseGainRef.current = noiseGain;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, ctx.currentTime);
    filter.Q.setValueAtTime(1, ctx.currentTime);
    filterRef.current = filter;

    const mainGain = ctx.createGain();
    mainGain.gain.setValueAtTime(0, ctx.currentTime);
    gainNodeRef.current = mainGain;

    drone.connect(filter);
    harmonic.connect(filter);
    noiseSource.connect(noiseGain);
    noiseGain.connect(filter);
    filter.connect(mainGain);
    mainGain.connect(ctx.destination);

    drone.start();
    harmonic.start();
    noiseSource.start();
    
    droneOscRef.current = drone;
    harmonicOscRef.current = harmonic;
    noiseNodeRef.current = noiseSource;
  };

  useEffect(() => {
    if (!isMuted && isActive) {
      initAudio();
      const ctx = audioCtxRef.current!;
      const gain = gainNodeRef.current!;
      const filter = filterRef.current!;
      const drone = droneOscRef.current!;
      const harmonic = harmonicOscRef.current!;
      const noiseGain = noiseGainRef.current!;

      const energyKeywords = ['نجاح', 'قوة', 'مال', 'ثراء', 'طاقة', 'حب', 'انطلاق'];
      const hasHighEnergy = keywords.some(k => energyKeywords.some(ek => k.includes(ek)));
      const baseFreq = hasHighEnergy ? 174.61 : 136.1;
      const normalizedIntensity = intensity / 100;
      
      const targetGain = 0.05 + (normalizedIntensity * 0.15);
      const targetFreq = baseFreq + (normalizedIntensity * 120);
      const noiseLevel = 0.02 + (normalizedIntensity * 0.06);
      const filterFreq = 300 + (normalizedIntensity * 2500) + (hasHighEnergy ? 600 : 0);
      const resonance = 1 + (normalizedIntensity * 12);

      gain.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.5);
      noiseGain.gain.setTargetAtTime(noiseLevel, ctx.currentTime, 0.5);
      drone.frequency.setTargetAtTime(targetFreq, ctx.currentTime, 1);
      harmonic.frequency.setTargetAtTime(targetFreq * 1.5, ctx.currentTime, 1);
      filter.frequency.setTargetAtTime(filterFreq, ctx.currentTime, 0.5);
      filter.Q.setTargetAtTime(resonance, ctx.currentTime, 0.5);

    } else if (gainNodeRef.current) {
      const ctx = audioCtxRef.current!;
      gainNodeRef.current.gain.setTargetAtTime(0, ctx.currentTime, 0.8);
    }
  }, [intensity, isMuted, isActive, keywords]);

  return (
    <div className="fixed top-24 sm:top-32 right-6 z-[100] flex flex-col items-end gap-3">
      {isMuted && isActive && shouldPrompt && (
        <div className="animate-in slide-in-from-right-10 fade-in duration-1000">
          <div className="bg-violet-600/20 backdrop-blur-xl border border-violet-500/30 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
            <Sparkle size={12} className="text-violet-400 animate-spin-slow" />
            <span className="text-[10px] sm:text-xs font-bold text-violet-100 whitespace-nowrap">رفع التردد مطلوب للتجلي.. فعّل الصوت</span>
          </div>
        </div>
      )}
      <button 
        onClick={() => {
          if (isMuted) initAudio();
          playQuantumPing('toggle');
          setIsMuted(!isMuted);
        }}
        className={`p-4 glass rounded-full text-violet-300 hover:text-white transition-all active-quantum relative ${isMuted && isActive ? 'animate-bounce shadow-[0_0_15px_rgba(139,92,246,0.4)]' : ''}`}
        aria-label={isMuted ? "تفعيل الترددات الكمية" : "كتم الصوت"}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} className="animate-pulse" />}
        {isMuted && isActive && (
          <span className="absolute inset-0 rounded-full border border-violet-500 animate-ping opacity-30" />
        )}
      </button>
    </div>
  );
};
