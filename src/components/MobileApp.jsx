// MobileApp - mobile-specific app orchestrator
const { useState, useEffect } = React;

window.MobileApp = () => {
    const [appState, setAppState] = useState('landing');
    const [activeMode, setActiveMode] = useState('hailo');

    const [hailoIndex, setHailoIndex] = useState(0);
    const [classicIndex, setClassicIndex] = useState(0);

    const [hailoMetrics, setHailoMetrics] = useState(() => {
        const saved = localStorage.getItem('hailoMetrics');
        return saved ? JSON.parse(saved) : { wpm: [], errors: [] };
    });
    const [classicMetrics, setClassicMetrics] = useState(() => {
        const saved = localStorage.getItem('qwertyMetrics');
        return saved ? JSON.parse(saved) : { wpm: [], errors: [] };
    });

    useEffect(() => {
        localStorage.setItem('hailoMetrics', JSON.stringify(hailoMetrics));
    }, [hailoMetrics]);

    useEffect(() => {
        localStorage.setItem('qwertyMetrics', JSON.stringify(classicMetrics));
    }, [classicMetrics]);

    useEffect(() => {
        if (hailoIndex > 0 && classicIndex > 0 && hailoIndex >= TARGET_SENTENCES.length && classicIndex >= TARGET_SENTENCES.length) {
            setAppState('stats');
        }
    }, [hailoIndex, classicIndex]);

    const handleHailoNext = (metrics) => {
        if (metrics) {
            setHailoMetrics(prev => ({ wpm: [...prev.wpm, parseFloat(metrics.wpm)], errors: [...prev.errors, metrics.backspaceCount] }));
        }
        setHailoIndex(prev => prev + 1);
        setActiveMode('classic');
    };

    const handleClassicNext = (metrics) => {
        if (metrics) {
            setClassicMetrics(prev => ({ wpm: [...prev.wpm, parseFloat(metrics.wpm)], errors: [...prev.errors, metrics.backspaceCount] }));
        }
        setClassicIndex(prev => prev + 1);
        setActiveMode('hailo');
    };

    if (appState === 'landing') {
        return (
            <MobileLandingPage
                onStartTutorial={() => setAppState('tutorial')}
                onStartPractice={() => setAppState('playground')}
                onShowStats={() => setAppState('stats')}
            />
        );
    }

    if (appState === 'tutorial') {
        return <TutorialOverlay
            onComplete={() => setAppState('playground')}
            onHome={() => setAppState('landing')}
            mobileLayout={true}
        />;
    }

    if (appState === 'stats') {
        return (
            <div className="flex flex-col w-full h-full bg-[#0b1120] overflow-hidden fixed inset-0">
                <MobileStatsDashboard
                    hailoMetrics={hailoMetrics}
                    classicMetrics={classicMetrics}
                    onClose={() => setAppState('landing')}
                />
            </div>
        );
    }

    const hailoSentence = TARGET_SENTENCES[hailoIndex % TARGET_SENTENCES.length];
    const classicSentence = TARGET_SENTENCES[classicIndex % TARGET_SENTENCES.length];

    return (
        <div className="flex flex-col w-full h-full bg-[#0b1120] overflow-hidden fixed inset-0">
            <div className="w-full flex justify-between items-center px-6 py-2 bg-slate-900 border-b border-slate-800 z-50 shrink-0">
                <div className="text-[10px] items-center gap-2 flex text-emerald-500 uppercase tracking-[0.2em] font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></span>
                    Round {Math.min(hailoIndex, classicIndex) + 1}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setAppState('landing')}
                        className="px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 active:scale-90 transition-transform flex items-center gap-1.5 pointer-events-auto"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                        <span className="text-[9px] font-bold tracking-widest uppercase">Home</span>
                    </button>
                    <button
                        onClick={() => setAppState('stats')}
                        className="px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 active:scale-90 transition-transform flex items-center gap-1.5"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                        <span className="text-[9px] font-bold tracking-widest uppercase">Stats</span>
                    </button>
                </div>
            </div>
            <div className="w-full h-1 bg-slate-800 shrink-0">
                <div
                    className={`h-full transition-all duration-500 ${activeMode === 'hailo' ? 'bg-emerald-500' : 'bg-blue-500'}`}
                    style={{ width: `${((activeMode === 'hailo' ? hailoIndex : classicIndex) / TARGET_SENTENCES.length) * 100}%` }}
                ></div>
            </div>

            <div className="flex-1 overflow-hidden relative flex flex-col items-center justify-start mt-2 sm:mt-10 overflow-y-auto w-full pb-4">
                {activeMode === 'hailo' ? (
                    <div className="w-full flex flex-col items-center animate-[fadeIn_0.5s_ease-out]">
                        <HailoKeyboard
                            key={`hailo-${hailoIndex}`}
                            isActive={true}
                            targetSentence={hailoSentence}
                            onComplete={handleHailoNext}
                            attemptNumber={hailoIndex + 1}
                            hailoIndex={hailoIndex}
                            classicIndex={classicIndex}
                        />
                    </div>
                ) : (
                    <div className="w-full flex flex-col items-center animate-[fadeIn_0.5s_ease-out]">
                        <ClassicKeyboard
                            key={`classic-${classicIndex}`}
                            isActive={true}
                            targetSentence={classicSentence}
                            onComplete={handleClassicNext}
                            attemptNumber={classicIndex + 1}
                            hailoIndex={hailoIndex}
                            classicIndex={classicIndex}
                        />
                    </div>
                )}
            </div>

            <div className="shrink-0 w-full bg-slate-900/95 backdrop-blur-xl rounded-t-[2.5rem] border-t border-slate-700/80 shadow-[0_-15px_40px_rgba(0,0,0,0.6)] z-50 pt-3 pb-3 sm:py-6 flex flex-col">

                {/* Legend */}
                <div className="flex justify-center mb-2 px-2">
                    {activeMode === 'hailo' ? (
                        <div className="flex flex-wrap gap-2 justify-center text-[9px] text-slate-400 glass-panel px-3 py-1.5 shadow-lg">
                            <div className="flex items-center gap-1">
                                <div className="px-1 py-0.5 bg-slate-800/80 rounded border border-slate-700/50 font-mono text-[9px] text-emerald-400">↑←→</div>
                                <span>Select</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="px-1 py-0.5 bg-slate-800/80 rounded border border-slate-700/50 font-mono text-[9px]">↓</div>
                                <span>Cycle</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="px-1 py-0.5 bg-slate-800/80 rounded border border-slate-700/50 font-mono text-[9px] text-rose-300">Hold ↓</div>
                                <span>Del</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="px-1 py-0.5 bg-slate-800/80 rounded border border-slate-700/50 font-mono text-[9px] text-green-300">↵</div>
                                <span>Space</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2 justify-center text-[9px] text-slate-400 glass-panel px-3 py-1.5 shadow-lg">
                            <div className="flex items-center gap-1">
                                <div className="px-1 py-0.5 bg-slate-800/80 rounded border border-slate-700/50 font-mono text-[9px] text-blue-400">↑↓←→</div>
                                <span>Move</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="px-1 py-0.5 bg-slate-800/80 rounded border border-slate-700/50 font-mono text-[9px] text-green-300">↵</div>
                                <span>Select</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-center mb-2 sm:mb-5 shrink-0">
                    <button
                        onClick={() => setActiveMode(activeMode === 'hailo' ? 'classic' : 'hailo')}
                        className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-md active:scale-95
                            ${activeMode === 'hailo'
                                ? 'bg-blue-600/20 border border-blue-500/50 text-blue-300'
                                : 'bg-emerald-600/20 border border-emerald-500/50 text-emerald-300'}`}
                    >
                        {activeMode === 'hailo' ? 'Switch to Classic' : 'Switch to Hailo'}
                    </button>
                </div>

                <div className="flex justify-center w-full shrink-0 relative overflow-visible">
                    <MobileRemote isMobile={true} activeMode={activeMode} setActiveMode={setActiveMode} embedded={true} />
                </div>
            </div>
        </div>
    );
};

