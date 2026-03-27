// TutorialOverlay - multi-stage interactive tutorial for the Hailo paradigm
const { useState, useEffect } = React;

window.TutorialOverlay = ({ onComplete, onHome, mobileLayout = false }) => {
    const [stage, setStage] = useState(0);
    const [resetKey, setResetKey] = useState(0);
    const isMobile = useIsMobile();

    useEffect(() => {
        if (stage === 5) {
            setResetKey(prev => prev + 1);
        }
    }, [stage]);

    const handleInterceptKey = (e, { text, layer }) => {
        if (e.key === 'Escape' || e.key === 'Backspace') {
            if (stage > 0 && !(stage === 4 && text.length > 0 && e.key === 'Backspace')) {
                setStage(prev => prev - 1);
                return true;
            }
        }

        if (e.key === 'Enter') {
            if (stage >= 0 && stage < 3) {
                setStage(prev => prev + 1);
                return true;
            }
            if (stage === 3) {
                setTimeout(() => setStage(4), 300);
                return false;
            }
            if (stage === 4) {
                setStage(5);
                return true;
            }
            if (stage === 6) {
                onComplete();
                return true;
            }
        }

        if (stage === 0) return true;
        if (stage === 1) {
            if (e.key === 'ArrowDown') return false;
            return true;
        }
        if (stage === 2) {
            if (['ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                setTimeout(() => setStage(3), 500);
                return false;
            }
            if (e.key === 'ArrowDown') return false;
            return true;
        }
        if (stage === 3) {
            return true;
        }
        if (stage === 4) {
            if (e.key === 'ArrowDown' || e.key === 'Backspace') {
                return false;
            }
            return true;
        }
        if (stage === 6) {
            return true;
        }

        return false;
    };

    const handleInterceptKeyUp = (e, { text, layer }) => {
        if (stage === 1 && e.key === 'ArrowDown') {
            setTimeout(() => setStage(2), 200);
            return false;
        }
        return false;
    };

    const handleTextChange = (text, setSuccess) => {
        if (stage === 4 && text.length === 0) {
            setStage(5);
        }
        if (stage === 5 && text.toLowerCase().trim() === 'sun') {
            setStage(6);
            setSuccess(true);
        } else {
            setSuccess(false);
        }
    };

    const renderTutorialLegend = () => (
        <div className={`absolute ${mobileLayout ? 'top-4' : 'top-8'} left-1/2 -translate-x-1/2 transition-all duration-1000 z-50 flex flex-col items-center w-[95%] sm:w-full px-1 sm:px-4 text-center max-w-xl pointer-events-auto`}>
            {stage > 0 && stage < 6 && (
                <div className={`absolute ${mobileLayout ? '-top-4' : '-top-6'} left-0 text-slate-500 text-[10px] sm:text-xs flex items-center gap-1 cursor-pointer hover:text-slate-300 transition-colors`} onClick={() => setStage(prev => prev - 1)}>
                    <span>←</span> Back (Esc)
                </div>
            )}
            {stage === 0 && (
                <div className={`animate-fade-in glass-panel ${mobileLayout ? 'py-2.5 px-3' : 'p-6'} border-emerald-500/30 shadow-2xl w-full`}>
                    <p className={`text-slate-300 ${mobileLayout ? 'text-[13px] leading-tight' : 'text-sm'} mb-2`}>Instead of hunting for letters, Hailo predicts what you want to type. You only need the four arrow keys.</p>
                    <button onClick={() => setStage(1)} className="px-6 py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 rounded-full font-bold hover:bg-emerald-500/30 transition-colors uppercase tracking-wider text-xs sm:text-base shadow-[0_0_15px_rgba(16,185,129,0.2)]">Got It (Enter)</button>
                </div>
            )}
            {stage === 1 && (
                <div className={`animate-fade-in glass-panel ${mobileLayout ? 'py-2.5 px-3' : 'p-6'} border-emerald-500/30 shadow-2xl w-full`}>
                    <p className={`text-slate-300 ${mobileLayout ? 'text-sm' : 'text-sm'} mb-1.5`}>Press the <strong className="text-emerald-300">DOWN Arrow</strong> to flip through layers of predictions.</p>
                    <div className="text-emerald-400/80 font-bold uppercase tracking-widest text-[11px] sm:text-xs animate-pulse border border-emerald-500/30 px-4 py-1.5 rounded-full inline-block text-xs">Press Down Arrow</div>
                    {!mobileLayout && <div className="text-slate-500 text-[10px] uppercase tracking-widest mt-3">Or press Enter to skip</div>}
                </div>
            )}
            {stage === 2 && (
                <div className={`animate-fade-in glass-panel ${mobileLayout ? 'py-2.5 px-3' : 'p-6'} border-emerald-500/30 shadow-2xl w-full`}>
                    <p className={`text-slate-300 ${mobileLayout ? 'text-sm' : 'text-sm'} mb-1.5`}>Press <strong className="text-emerald-300">UP, RIGHT, or LEFT</strong> to instantly type the letter in that slot.</p>
                    <div className="text-emerald-400/80 font-bold uppercase tracking-widest text-[11px] sm:text-xs animate-pulse border border-emerald-500/30 px-4 py-1.5 rounded-full inline-block text-xs">Press Up, Left, Right</div>
                    {!mobileLayout && <div className="text-slate-500 text-[10px] uppercase tracking-widest mt-3">Or press Enter to skip</div>}
                </div>
            )}
            {stage === 3 && (
                <div className={`animate-fade-in glass-panel ${mobileLayout ? 'py-2.5 px-3' : 'p-6'} border-emerald-500/30 shadow-2xl w-full`}>
                    <p className={`text-slate-300 ${mobileLayout ? 'text-sm' : 'text-sm'} mb-1.5`}>Press <strong className="text-emerald-300">ENTER</strong> to type a space.</p>
                    <div className="text-emerald-400/80 font-bold uppercase tracking-widest text-[11px] sm:text-xs animate-pulse border border-emerald-500/30 px-4 py-1.5 rounded-full inline-block text-xs">Press Enter</div>
                </div>
            )}
            {stage === 4 && (
                <div className={`animate-fade-in glass-panel ${mobileLayout ? 'py-2.5 px-3' : 'p-6'} border-emerald-500/30 shadow-2xl w-full`}>
                    <p className={`text-slate-300 ${mobileLayout ? 'text-sm' : 'text-sm'} mb-1.5`}>Press and <strong className="text-rose-300">Hold DOWN Arrow</strong> to delete characters.</p>
                    <div className="text-rose-400/80 font-bold uppercase tracking-widest text-[11px] sm:text-xs animate-pulse border border-rose-500/30 px-4 py-1.5 rounded-full inline-block text-xs">Hold Down Arrow</div>
                    {!mobileLayout && <div className="text-slate-500 text-[10px] uppercase tracking-widest mt-3">Clear the text to continue, or press Enter</div>}
                </div>
            )}
            {stage === 5 && (
                <div className={`animate-fade-in glass-panel ${mobileLayout ? 'py-2.5 px-3' : 'p-6'} border-emerald-500/30 shadow-2xl w-full`}>
                    <p className={`text-slate-300 ${mobileLayout ? 'text-sm' : 'text-sm'} mb-1.5`}>Use the arrow keys to cycle and type.</p>
                    <div className={`text-emerald-300 ${mobileLayout ? 'text-sm' : 'text-sm'}`}>Try typing the word: <span className="text-white font-bold ml-1 tracking-[0.2em] bg-slate-800/80 px-2 py-1 rounded">SUN</span></div>
                </div>
            )}
            {stage === 6 && (
                <div className={`animate-fade-in glass-panel ${mobileLayout ? 'py-2.5 px-3' : 'p-6'} border-emerald-500/30 shadow-2xl w-full`}>
                    <p className={`text-slate-300 ${mobileLayout ? 'text-sm' : 'text-sm'} mb-4`}>You successfully mastered the Hailo paradigm.</p>
                    <button onClick={onComplete} className="px-6 py-2 bg-blue-500/10 text-blue-300 border border-blue-400/50 rounded-full font-bold hover:bg-blue-500/20 transition-colors uppercase tracking-wider shadow-[0_0_15px_rgba(59,130,246,0.15)] pointer-events-auto text-xs sm:text-base">Enter Research Suite</button>
                </div>
            )}
        </div>
    );

    const renderMobileHeader = () => mobileLayout && (
        <div className="w-full flex justify-between items-center px-6 py-2 bg-slate-900 border-b border-slate-800 z-50 shrink-0 pointer-events-auto">
            <div className="text-[10px] items-center gap-2 flex text-emerald-500 uppercase tracking-[0.2em] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></span>
                Tutorial Mode
            </div>
            <button
                onClick={onHome}
                className="px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 active:scale-90 transition-transform flex items-center gap-1.5"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                <span className="text-[9px] font-bold tracking-widest uppercase">Home</span>
            </button>
        </div>
    );

    return (
        <div className={`w-full h-full bg-[#0b1120] ${mobileLayout ? 'fixed inset-0' : 'relative border-[8px] border-slate-900'} overflow-hidden pointer-events-none flex flex-col`}>
            {renderMobileHeader()}
            <div className="w-full pointer-events-none relative flex-1">
                {renderTutorialLegend()}
                <div className={`w-full pointer-events-auto flex flex-col items-center flex-1 ${mobileLayout ? 'pt-[110px]' : 'pt-64'}`}>
                    <HailoCore
                        key={`core-${resetKey}`}
                        isActive={true}
                        targetSentence={stage >= 5 ? "sun" : ""}
                        title={`Tutorial: ${stage === 0 ? 'Intro' : stage === 1 ? 'Cycling' : stage === 2 ? 'Typing' : stage === 3 ? 'Space' : stage === 4 ? 'Delete' : 'Practice'}`}
                        interceptKey={handleInterceptKey}
                        interceptKeyUp={handleInterceptKeyUp}
                        onTextChange={handleTextChange}
                        removeSpecials={true}
                        showMetricsScreen={false}
                        onComplete={onComplete}
                        renderOverlay={mobileLayout ? () => null : null}
                    />
                </div>
            </div>
            {mobileLayout ? (
                <div className="shrink-0 w-full bg-slate-900/95 backdrop-blur-xl rounded-t-[2.5rem] border-t border-slate-700/80 shadow-[0_-15px_40px_rgba(0,0,0,0.6)] z-50 pt-3 pb-3 sm:py-6 flex flex-col pointer-events-auto">
                    <div className="flex justify-center w-full shrink-0 relative overflow-visible">
                        <MobileRemote isMobile={true} activeMode="hailo" setActiveMode={() => { }} embedded={true} />
                    </div>
                </div>
            ) : (
                !mobileLayout && <MobileRemote isMobile={isMobile} />
            )}
        </div>
    );
};

