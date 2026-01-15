
import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Brain, History, ArrowLeft, Send, CheckCircle, Zap, Loader2, Home, X, LayoutGrid, Target, Infinity, Eye, Waves, Share2 } from 'lucide-react';
import { AppState, Intention, RefinementResult } from './types.ts';
import { refineIntention, generateIntentionImage } from './geminiService.ts';
import QuantumCanvas from './components/QuantumCanvas.tsx';
import { QuantumAudio, playQuantumPing, playAnchoringSound } from './components/QuantumAudio.tsx';
import QuantumBurst from './components/QuantumBurst.tsx';
import { QuantumFocusVisualizer } from './components/QuantumFocusVisualizer.tsx';

const QUANTUM_MESSAGES = [
  "رصد تراكب الاحتمالات في الحقل الموحد...",
  "تحييد التشتت وتوجيه وعي المراقب...",
  "تشفير التردد المطلوب في مصفوفة الوعي...",
  "بدء انهيار الدالة الموجية نحو الواقع المختار...",
  "تثبيت المرساة البصرية للتجلي المادي الحقيقي..."
];

const App: React.FC = () => {
  const [activeState, setActiveState] = useState<AppState>(AppState.WELCOME);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<RefinementResult | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<Intention[]>([]);
  const [focusProgress, setFocusProgress] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showCollapseFlash, setShowCollapseFlash] = useState(false);
  const [isBursting, setIsBursting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('quantum_manifest_v5');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) { console.error("History sync error", e); }
    }
  }, []);

  const handleRefine = async () => {
    if (!userInput.trim()) return;
    playQuantumPing('primary');
    setLoading(true);
    try {
      const result = await refineIntention(userInput);
      setCurrentResult(result);
      setActiveState(AppState.REFINE);
    } catch (error) {
      alert("حدث اضطراب في مصفوفة الرصد. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const startFocusing = async () => {
    if (!currentResult) return;
    playQuantumPing('primary');
    setActiveState(AppState.FOCUS);
    setFocusProgress(0);
    setGeneratedImageUrl(null);
    
    generateIntentionImage(currentResult.visualPrompt)
      .then(url => setGeneratedImageUrl(url))
      .catch(err => console.error("Anchor creation error", err));

    let currentProgress = 0;
    const animate = () => {
      if (currentProgress >= 100) {
        setFocusProgress(100);
        setShowCollapseFlash(true);
        setTimeout(() => setShowCollapseFlash(false), 500);
        return;
      }
      const step = currentProgress < 80 ? 0.3 + Math.random() * 0.5 : 1.2 + Math.random() * 2;
      currentProgress += step;
      if (currentProgress > 100) currentProgress = 100;
      
      setFocusProgress(Math.floor(currentProgress));
      setCurrentMessageIndex(Math.min(QUANTUM_MESSAGES.length - 1, Math.floor(currentProgress / 20)));
      setTimeout(animate, 60);
    };
    animate();
  };

  const saveIntention = useCallback(() => {
    if (!currentResult) return;
    
    playAnchoringSound();
    setIsBursting(true);
    
    setTimeout(() => {
      const newIntention: Intention = {
        id: Math.random().toString(36).substr(2, 9),
        original: userInput,
        refined: currentResult.refinedIntention,
        resonance: currentResult.resonanceScore,
        timestamp: Date.now(),
        quantumState: 'collapsed',
        imageUrl: generatedImageUrl || undefined
      };
      const updatedHistory = [newIntention, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('quantum_manifest_v5', JSON.stringify(updatedHistory));
      setActiveState(AppState.HISTORY);
      setUserInput('');
      setIsBursting(false);
    }, 1200);
  }, [currentResult, userInput, generatedImageUrl, history]);

  const handleStateChange = (state: AppState) => {
    playQuantumPing('navigation');
    setActiveState(state);
  };

  const handleShare = async (item: Intention) => {
    const shareText = `رصدت احتمالية واقع جديد: "${item.refined}"\nتم التثبيت عبر منصة كوانتوم التجلي.\n${window.location.origin}`;
    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedId(item.id);
      playQuantumPing('toggle');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Share failed', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center relative overflow-hidden text-white bg-[#020205]">
      <QuantumCanvas />
      {isBursting && <QuantumBurst />}
      
      <QuantumAudio 
        intensity={focusProgress} 
        isActive={activeState === AppState.FOCUS || activeState === AppState.REFINE} 
        keywords={currentResult?.focusKeywords}
        shouldPrompt={activeState !== AppState.WELCOME}
      />

      {showCollapseFlash && (
        <div className="fixed inset-0 z-[110] bg-white/40 backdrop-blur-3xl animate-pulse pointer-events-none" />
      )}

      {/* Header */}
      <header className="w-full max-w-7xl flex justify-between items-center px-4 sm:px-10 py-4 sm:py-10 relative z-50">
        <div 
          className="flex items-center gap-2 sm:gap-5 cursor-pointer hover:opacity-80 transition-ultra group" 
          onClick={() => handleStateChange(AppState.WELCOME)}
        >
          <div className="w-10 h-10 sm:w-16 sm:h-16 bg-violet-600/10 backdrop-blur-2xl rounded-xl sm:rounded-2xl flex items-center justify-center border border-violet-400/20 shadow-[0_0_20px_rgba(139,92,246,0.15)]">
            <Waves className="text-violet-400 group-hover:rotate-180 transition-transform duration-1000" size={24} />
          </div>
          <div>
            <h1 className="text-lg sm:text-3xl font-black tracking-tight leading-none mb-1 text-white">كوانتوم التجلي</h1>
            <p className="text-[7px] sm:text-[10px] text-violet-400 font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em]">Reality Architect Engine</p>
          </div>
        </div>
        
        <button 
          onClick={() => handleStateChange(AppState.HISTORY)}
          className="group active-quantum flex items-center gap-2 px-3 py-1.5 sm:px-8 sm:py-4 bg-white/5 hover:bg-white/10 rounded-xl sm:rounded-2xl transition-ultra border border-white/10 backdrop-blur-md"
        >
          <History size={16} className="text-violet-300" />
          <span className="text-[10px] sm:text-[12px] font-black uppercase tracking-widest">مصفوفة الرصد</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-6xl px-4 sm:px-10 relative z-40 flex-1 flex flex-col items-center justify-center pb-24 sm:pb-40">
        
        {activeState === AppState.WELCOME && (
          <div className="text-center space-y-8 sm:space-y-16 animate-in fade-in zoom-in duration-1000">
            <div className="space-y-4 sm:space-y-8 max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 sm:gap-3 px-4 py-1.5 sm:px-6 sm:py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-[9px] sm:text-[11px] font-black text-violet-300 uppercase tracking-widest mb-2 sm:mb-4">
                <Infinity size={12} /> قوة الوعي المراقب
              </div>
              <h2 className="text-4xl sm:text-7xl md:text-8xl font-black leading-[1.1] tracking-tight px-2">
                وجه <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400">وعيك</span> <br />
                لخلق واقعك
              </h2>
              <p className="text-sm sm:text-2xl text-gray-400 leading-relaxed font-light px-4 sm:px-24">
                منصة مبتكرة تساعدك على صياغة نياتك بدقة، وتوجيه وعيك لتركيز الاحتمالات الكمومية وفق مبادئ ميكانيكا الكم. 
                <span className="block mt-4 text-violet-300/60 text-base sm:text-xl font-medium">
                  اكتب نيتك، راقبها بوعي كامل، واختبر انهيار الدالة الموجية لصالحك.
                </span>
              </p>
            </div>
            <button 
              onClick={() => handleStateChange(AppState.FORMULATE)}
              className="px-10 sm:px-24 py-5 sm:py-8 bg-violet-600 hover:bg-violet-500 rounded-2xl sm:rounded-3xl font-black text-base sm:text-3xl transition-ultra transform active-quantum shadow-[0_20px_60px_rgba(124,58,237,0.4)] flex items-center justify-center gap-3 sm:gap-5 mx-auto group border border-violet-400/40"
            >
              ابدأ تأثير المراقب <ArrowLeft size={24} className="group-hover:-translate-x-2 transition-transform" />
            </button>
          </div>
        )}

        {activeState === AppState.FORMULATE && (
          <div className="w-full glass-card p-6 sm:p-14 rounded-[2rem] sm:rounded-[5rem] space-y-6 sm:space-y-10 animate-in slide-in-from-bottom-12 duration-700 shadow-2xl relative border-white/10 max-w-3xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-3xl font-black flex items-center gap-3 text-violet-100">
                <Eye size={20} className="text-violet-400 sm:size-[28px]" /> صياغة نية الرصد
              </h3>
              <button onClick={() => handleStateChange(AppState.WELCOME)} className="p-2 text-gray-500 hover:text-white transition-colors active:scale-90">
                <X size={20} />
              </button>
            </div>
            <div className="relative">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="ما هو الاحتمال الذي تود رصده وتثبيته في واقعك؟ (مثال: أتمتع الآن بصحة كاملة ووفرة مالية مستدامة)"
                className="w-full h-40 sm:h-72 bg-black/40 border border-white/10 rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-12 text-lg sm:text-3xl focus:outline-none focus:ring-2 ring-violet-500/40 transition-ultra resize-none text-right font-light placeholder:opacity-20 leading-relaxed"
                dir="rtl"
              />
            </div>
            <button
              disabled={loading || !userInput.trim()}
              onClick={handleRefine}
              className="w-full py-4 sm:py-8 active-quantum bg-gradient-to-l from-violet-600 to-indigo-700 rounded-xl sm:rounded-[3rem] font-black text-base sm:text-2xl flex items-center justify-center gap-3 sm:gap-4 transition-ultra disabled:opacity-30 shadow-2xl"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>تركيز الاحتمالات <Zap size={18} /></>}
            </button>
          </div>
        )}

        {activeState === AppState.REFINE && currentResult && (
          <div className="w-full space-y-6 sm:space-y-10 animate-in fade-in duration-700 max-w-5xl">
            <div className="glass-card p-6 sm:p-20 rounded-[2rem] sm:rounded-[6rem] border-violet-500/20 border-2 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-8 sm:p-12 opacity-[0.02] rotate-12 select-none pointer-events-none">
                <Target size={200} className="sm:size-[300px]" />
              </div>
              <div className="flex justify-between items-center mb-6 sm:mb-12 relative z-10">
                <div className="px-4 py-1.5 sm:px-6 sm:py-2.5 bg-violet-900/40 backdrop-blur-xl border border-violet-500/30 rounded-full flex items-center gap-2 sm:gap-4">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                  <span className="text-[8px] sm:text-[11px] font-black text-violet-100 uppercase tracking-widest">Resonance: {Math.round(currentResult.resonanceScore * 100)}%</span>
                </div>
                <Sparkles className="text-violet-400" size={20} />
              </div>
              <h4 className="text-violet-400/60 text-[8px] sm:text-[11px] font-black uppercase tracking-[0.4em] sm:tracking-[0.6em] mb-4 sm:mb-8">النية المحاذية طاقياً:</h4>
              <p className="text-xl sm:text-5xl md:text-6xl font-black text-white mb-8 sm:mb-14 leading-[1.2] text-right" dir="rtl">
                "{currentResult.refinedIntention}"
              </p>
              <div className="p-5 sm:p-10 bg-white/[0.03] rounded-2xl sm:rounded-[3rem] border border-white/5 space-y-4 sm:space-y-6">
                <span className="text-[9px] sm:text-[12px] uppercase tracking-widest text-violet-300 font-black block">تحليل ميكانيكا التجلي:</span>
                <p className="text-gray-400 text-sm sm:text-2xl leading-relaxed font-light text-right" dir="rtl">{currentResult.explanation}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
              <button
                onClick={() => handleStateChange(AppState.FORMULATE)}
                className="py-4 sm:py-8 active-quantum glass rounded-2xl sm:rounded-[3rem] hover:bg-white/10 transition-ultra font-black text-[10px] sm:text-[14px] uppercase tracking-widest border-white/10"
              >
                إعادة ضبط المتجهات
              </button>
              <button
                onClick={startFocusing}
                className="py-4 sm:py-8 active-quantum bg-violet-600 hover:bg-violet-500 rounded-2xl sm:rounded-[3rem] font-black text-base sm:text-2xl flex items-center justify-center gap-3 sm:gap-5 shadow-2xl transition-ultra border border-violet-400/20"
              >
                إرسال النية إلى الكون <Zap size={20} />
              </button>
            </div>
          </div>
        )}

        {activeState === AppState.FOCUS && currentResult && (
          <div className="w-full flex flex-col items-center justify-center space-y-10 sm:space-y-16 py-4 animate-in fade-in duration-1000 max-w-6xl">
            <div className="text-center px-2 max-w-4xl">
              <h2 className="text-xl sm:text-6xl font-black text-white animate-quantum-shimmer leading-tight mb-4 sm:mb-8 px-4">
                "{currentResult.refinedIntention}"
              </h2>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                 {currentResult.focusKeywords.map((kw, i) => (
                   <span key={i} className="px-3 py-1 sm:px-6 sm:py-2 bg-violet-500/10 rounded-full text-[8px] sm:text-[12px] font-bold text-violet-300 border border-violet-500/20">#{kw}</span>
                 ))}
              </div>
            </div>

            <div className="relative w-full max-w-5xl aspect-video sm:aspect-[21/9] mx-auto px-2">
              <div className="absolute inset-0 rounded-3xl sm:rounded-[6rem] overflow-hidden glass border-2 border-white/10 shadow-[0_0_60px_rgba(139,92,246,0.2)]">
                
                {focusProgress < 100 && (
                  <div 
                    className="absolute inset-0 z-10 pointer-events-none mix-blend-screen opacity-30"
                    style={{
                      background: `repeating-linear-gradient(${45 + focusProgress}deg, rgba(139, 92, 246, 0.1), transparent ${10 - (focusProgress/10)}px)`
                    }}
                  />
                )}

                {generatedImageUrl ? (
                  <img 
                    src={generatedImageUrl} 
                    className="w-full h-full object-cover transition-all duration-700 ease-out"
                    style={{ 
                      filter: focusProgress < 100 ? `blur(${20 - (focusProgress / 5)}px) brightness(${0.4 + (focusProgress/200)}) saturate(${0.2 + (focusProgress/100)})` : 'none',
                      opacity: (focusProgress / 100) + 0.2,
                      transform: `scale(${1.2 - (focusProgress / 500)})`
                    }}
                    alt="Reality Anchor"
                  />
                ) : (
                  <div className="w-full h-full relative flex flex-col items-center justify-center bg-black/60 backdrop-blur-3xl overflow-hidden">
                    <QuantumFocusVisualizer progress={focusProgress} />
                    <div className="relative z-10 flex flex-col items-center bg-black/40 p-6 rounded-full backdrop-blur-sm border border-white/5">
                      <Loader2 className="animate-spin text-violet-500 mb-4 sm:size-[60px]" size={32} />
                      <p className="text-[10px] sm:text-base text-violet-400 font-black tracking-[0.4em] uppercase text-center">رصد احتمالات الواقع...</p>
                    </div>
                  </div>
                )}
                
                {focusProgress < 100 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                     <span className="text-6xl sm:text-[15rem] font-black text-white/5 tracking-tighter select-none pointer-events-none animate-pulse">
                       {focusProgress}%
                     </span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center space-y-6 sm:space-y-10 max-w-3xl px-6">
              <div className="space-y-4">
                <p className="text-violet-400 font-black text-xs sm:text-2xl tracking-[0.3em] uppercase min-h-[1.5rem] animate-pulse">
                  {focusProgress < 100 ? QUANTUM_MESSAGES[currentMessageIndex] : "تم انهيار الدالة الموجية بنجاح."}
                </p>
                <p className="text-gray-400 text-[10px] sm:text-xl leading-relaxed opacity-80 font-light">
                  {focusProgress < 100 
                    ? "وعيك الآن هو المحرك الوحيد لهذا الاحتمال. حافظ على الرصد." 
                    : "لقد ثبت هذا الواقع الآن في مصفوفتك الشخصية. عش به كأنه حقيقة."}
                </p>
              </div>
              
              {focusProgress === 100 && (
                <div className="w-full animate-in slide-in-from-bottom-12 duration-1000">
                  <button
                    onClick={saveIntention}
                    disabled={isBursting}
                    className="w-full py-5 sm:py-8 active-quantum bg-white text-black rounded-2xl sm:rounded-[3rem] font-black text-lg sm:text-2xl hover:bg-gray-100 transition-ultra shadow-3xl flex items-center justify-center gap-3 sm:gap-5"
                  >
                    {isBursting ? 'تثبيت التردد...' : 'تثبيت الاحتمال المرصود'} <CheckCircle size={20} className="sm:size-[30px]" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeState === AppState.HISTORY && (
          <div className="w-full space-y-10 sm:space-y-16 animate-in fade-in duration-700 pb-20 sm:pb-24">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-2">
              <div>
                <h3 className="text-2xl sm:text-6xl font-black text-white">الأرشيف الكمي</h3>
                <p className="text-[8px] sm:text-[11px] text-gray-500 mt-2 uppercase tracking-[0.4em] font-black">Captured Realities Matrix</p>
              </div>
              <button 
                onClick={() => handleStateChange(AppState.FORMULATE)}
                className="bg-violet-600 hover:bg-violet-500 active-quantum text-white px-6 py-3 sm:px-12 sm:py-5 rounded-xl sm:rounded-[2.5rem] text-[10px] sm:text-[14px] font-black transition-ultra uppercase tracking-widest shadow-2xl"
              >
                + رصد احتمال جديد
              </button>
            </div>
            
            {history.length === 0 ? (
              <div className="glass p-12 sm:p-24 rounded-[2rem] sm:rounded-[6rem] text-center border-white/5 shadow-inner">
                <p className="text-gray-600 text-lg sm:text-2xl font-light italic">لا توجد احتمالات مرصودة في هذه المصفوفة حتى الآن.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12">
                {history.map((item) => (
                  <div key={item.id} className="glass-card group rounded-[2rem] sm:rounded-[4rem] overflow-hidden flex flex-col border-white/5 hover:border-violet-500/30 transition-ultra">
                    {item.imageUrl && (
                      <div className="w-full aspect-video overflow-hidden relative">
                        <img src={item.imageUrl} className="w-full h-full object-cover grayscale-[0.8] group-hover:grayscale-0 transition-ultra duration-[2s]" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                      </div>
                    )}
                    <div className="p-6 sm:p-10 flex-1 flex flex-col">
                      <div className="flex justify-between items-center mb-4 sm:mb-8">
                        <span className="text-[8px] sm:text-[11px] font-black text-gray-500 uppercase tracking-widest bg-white/5 px-3 py-1 sm:px-5 sm:py-2 rounded-full border border-white/5">
                          {new Date(item.timestamp).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                          <span className="text-[8px] text-green-500 font-bold tracking-widest">COLLAPSED</span>
                        </div>
                      </div>
                      <p className="text-lg sm:text-3xl font-black leading-relaxed mb-6">"{item.refined}"</p>
                      <div className="mt-auto pt-4 sm:pt-8 border-t border-white/10 flex items-center justify-between text-[7px] sm:text-[10px] font-black text-gray-600 uppercase tracking-widest">
                        <span>Resonance: {Math.round(item.resonance * 100)}%</span>
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => handleShare(item)}
                            className="flex items-center gap-2 bg-violet-600/10 hover:bg-violet-600/20 px-4 py-2 rounded-full border border-violet-500/20 transition-all active:scale-95 group relative"
                            title="مشاركة النية"
                          >
                            <Share2 size={14} className="text-violet-400" />
                            <span className="text-violet-300">{copiedId === item.id ? 'تم النسخ' : 'مشاركة'}</span>
                            {copiedId === item.id && (
                              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-[10px] px-3 py-1 rounded-lg animate-in fade-in slide-in-from-bottom-2">تم رصد النص!</span>
                            )}
                          </button>
                          <span className="text-violet-500 hidden sm:inline">REALITY ANCHORED</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer Navigation */}
      <footer className="fixed bottom-4 sm:bottom-10 left-0 w-full flex justify-center z-[100] px-4 pb-safe">
        <div className="glass px-8 sm:px-12 py-3 sm:py-5 rounded-full flex items-center gap-10 sm:gap-16 border-white/10 shadow-2xl backdrop-blur-[40px] w-full max-w-[320px] sm:max-w-none sm:w-auto">
           <button 
             onClick={() => handleStateChange(AppState.WELCOME)} 
             className={`flex active-quantum flex-col items-center gap-1.5 transition-ultra ${activeState === AppState.WELCOME ? 'text-violet-400 scale-110' : 'text-gray-500 hover:text-white'}`}
           >
             <Home size={20} className="sm:size-[24px]" />
             <span className="text-[7px] sm:text-[10px] font-black uppercase tracking-widest">الرئيسية</span>
           </button>
           
           <div className="w-px h-6 sm:h-10 bg-white/10" />
           
           <button 
             onClick={() => handleStateChange(AppState.FORMULATE)} 
             className={`flex active-quantum flex-col items-center gap-1.5 transition-ultra ${[AppState.FORMULATE, AppState.REFINE, AppState.FOCUS].includes(activeState) ? 'text-violet-400 scale-110' : 'text-gray-500 hover:text-white'}`}
           >
             <Target size={20} className="sm:size-[24px]" />
             <span className="text-[7px] sm:text-[10px] font-black uppercase tracking-widest">رصد</span>
           </button>

           <div className="w-px h-6 sm:h-10 bg-white/10" />

           <button 
             onClick={() => handleStateChange(AppState.HISTORY)} 
             className={`flex active-quantum flex-col items-center gap-1.5 transition-ultra ${activeState === AppState.HISTORY ? 'text-violet-400 scale-110' : 'text-gray-500 hover:text-white'}`}
           >
             <LayoutGrid size={20} className="sm:size-[24px]" />
             <span className="text-[7px] sm:text-[10px] font-black uppercase tracking-widest">الأرشيف</span>
           </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
