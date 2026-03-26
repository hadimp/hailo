// MainApp - desktop split-screen orchestrator
// AppRoot - entry point that decides between mobile/desktop
const { useState, useEffect, useRef } = React;

window.MainApp = () => {
    const [appState, setAppState] = useState('landing'); // 'landing', 'tutorial', 'playground', 'stats'
    const [activeMode, setActiveMode] = useState('arc'); // 'arc' or 'classic'
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [showMobileWarning, setShowMobileWarning] = useState(false);
    const isMobile = useIsMobile();

    // Track sentences independently so they can be compared fairly side-by-side
    const [arcIndex, setArcIndex] = useState(0);
    const [classicIndex, setClassicIndex] = useState(0);

    const [arcMetrics, setArcMetrics] = useState(() => {
        const saved = localStorage.getItem('arcMetrics');
        return saved ? JSON.parse(saved) : { wpm: [], errors: [] };
    });
    const [classicMetrics, setClassicMetrics] = useState(() => {
        const saved = localStorage.getItem('qwertyMetrics');
        return saved ? JSON.parse(saved) : { wpm: [], errors: [] };
    });

    useEffect(() => {
        localStorage.setItem('arcMetrics', JSON.stringify(arcMetrics));
    }, [arcMetrics]);

    useEffect(() => {
        localStorage.setItem('qwertyMetrics', JSON.stringify(classicMetrics));
    }, [classicMetrics]);

    // Auto-scroll effect for mobile when active mode changes
    const arcRef = useRef(null);
    const classicRef = useRef(null);

    useEffect(() => {
        if (isMobile && appState === 'playground') {
            setTimeout(() => {
                if (activeMode === 'arc' && arcRef.current) {
                    try {
                        arcRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } catch (e) { }
                } else if (activeMode === 'classic' && classicRef.current) {
                    try {
                        classicRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } catch (e) { }
                }
            }, 150);
        }
    }, [activeMode, isMobile, appState]);

    // If user finishes both tests, go to Stats
    useEffect(() => {
        if (arcIndex >= TARGET_SENTENCES.length && classicIndex >= TARGET_SENTENCES.length) {
            setAppState('stats');
        }
    }, [arcIndex, classicIndex]);

    // Add Tab listener to switch panels
    useEffect(() => {
        const handleTab = (e) => {
            if (e.key === 'Tab' && appState === 'playground') {
                e.preventDefault();
                setActiveMode(prev => prev === 'arc' ? 'classic' : 'arc');
            }
        };
        window.addEventListener('keydown', handleTab);
        return () => window.removeEventListener('keydown', handleTab);
    }, [appState]);

    const handleArcNext = (metrics) => {
        if (metrics) {
            setArcMetrics(prev => ({
                wpm: [...prev.wpm, parseFloat(metrics.wpm)],
                errors: [...prev.errors, metrics.backspaceCount]
            }));
        }
        setArcIndex(prev => prev + 1);
    };

    const handleClassicNext = (metrics) => {
        if (metrics) {
            setClassicMetrics(prev => ({
                wpm: [...prev.wpm, parseFloat(metrics.wpm)],
                errors: [...prev.errors, metrics.backspaceCount]
            }));
        }
        setClassicIndex(prev => prev + 1);
    };

    if (appState === 'landing') {
        return <LandingPage
            onStartTutorial={() => setAppState('tutorial')}
            onSkip={() => {
                localStorage.setItem('hasCompletedTutorial', 'true');
                setAppState('playground');
                if (isMobile) setShowMobileWarning(true);
            }}
            onShowStats={() => setAppState('stats')}
        />;
    }

    if (appState === 'tutorial') {
        return <TutorialOverlay
            onComplete={() => {
                localStorage.setItem('hasCompletedTutorial', 'true');
                setAppState('playground');
                if (isMobile) setShowMobileWarning(true);
            }}
            onHome={() => setAppState('landing')}
            mobileLayout={isMobile}
        />;
    }

    if (appState === 'stats') {
        return (
            <StatsDashboard 
                arcMetrics={arcMetrics} 
                classicMetrics={classicMetrics} 
                onClose={() => setAppState('landing')}
            />
        );
    }

    const arcSentence = TARGET_SENTENCES[arcIndex % TARGET_SENTENCES.length];
    const classicSentence = TARGET_SENTENCES[classicIndex % TARGET_SENTENCES.length];

    return (
        <div className="flex flex-col w-full h-full bg-slate-900 border-[8px] border-slate-900 overflow-hidden box-border">
            {/* Header informing users of dual paradigm test */}
            <div className="w-full bg-slate-900 p-2 md:p-3 flex justify-between items-center text-xs md:text-sm font-medium tracking-wide border-b border-slate-800 overflow-x-auto">
                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    <h1 className="text-sm sm:text-lg md:text-xl font-bold tracking-wider uppercase text-emerald-400">
                        Arc
                    </h1>
                    <div className="h-3 sm:h-4 w-px bg-slate-700"></div>
                    <div className="text-[10px] sm:text-xs md:text-sm font-medium tracking-wide text-slate-300">
                        Practice Area <span className="text-amber-400 font-bold block md:inline mt-0.5 md:mt-0">&mdash; Test BOTH paradigms to compare metrics objectively.</span>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-2">
                    <button
                        onClick={() => setShowLeaderboard(true)}
                        className="px-1.5 py-1 sm:px-3 sm:py-1 bg-slate-800 hover:bg-slate-700 text-yellow-400 border border-slate-700 rounded text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
                    >
                        <span>🏆 Leaderboard</span>
                    </button>
                    <button
                        onClick={() => {
                            setAppState('landing');
                            setArcIndex(0);
                            setClassicIndex(0);
                            setArcMetrics({ wpm: [], errors: [] });
                            setClassicMetrics({ wpm: [], errors: [] });
                        }}
                        className="px-1.5 py-1 sm:px-3 sm:py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
                    >
                        <span className="flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                            Home
                        </span>
                    </button>
                </div>
            </div>

            <div className={`flex flex-col md:flex-row flex-1 gap-2 md:gap-4 p-2 md:p-0 pt-2 md:pt-4 ${isMobile ? 'pb-64' : ''}`}>
                {/* Left Panel: Arc */}
                <div
                    ref={arcRef}
                    className={`flex-1 relative transition-all duration-500 cursor-pointer overflow-hidden rounded-xl border transition-all duration-300 ${activeMode === 'arc' ? `bg-[#0b1120] border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)]` : 'bg-slate-900 border-slate-800/50'} ${isMobile && activeMode !== 'arc' ? 'hidden' : ''}`}
                    onClick={() => {
                        setActiveMode('arc');
                        window.focus();
                    }}
                >
                    <ArcKeyboard
                        isActive={activeMode === 'arc'}
                        targetSentence={arcSentence}
                        onComplete={handleArcNext}
                        attemptNumber={arcIndex + 1}
                    />
                </div>

                {/* Right Panel: Classic */}
                <div
                    ref={classicRef}
                    className={`flex-1 relative transition-all duration-500 cursor-pointer overflow-hidden rounded-xl border transition-all duration-300 ${activeMode === 'classic' ? `bg-[#0b1120] border-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.1)]` : 'bg-slate-900 border-slate-800/50'} ${isMobile && activeMode !== 'classic' ? 'hidden' : ''}`}
                    onClick={() => {
                        setActiveMode('classic');
                        window.focus();
                    }}
                >
                    <ClassicKeyboard
                        isActive={activeMode === 'classic'}
                        targetSentence={classicSentence}
                        onComplete={handleClassicNext}
                        attemptNumber={classicIndex + 1}
                    />
                </div>
            </div>
            {showLeaderboard && <LeaderboardOverlay onClose={() => setShowLeaderboard(false)} />}
            {showMobileWarning && <MobilePlaygroundWarning onProceed={() => setShowMobileWarning(false)} />}
            <MobileRemote isMobile={isMobile} activeMode={activeMode} setActiveMode={setActiveMode} />
        </div>
    );
};

// AppRoot - entry point
window.AppRoot = () => {
    const isMobile = useIsMobile();
    return isMobile ? <MobileApp /> : <MainApp />;
};
