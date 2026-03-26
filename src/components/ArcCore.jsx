// ArcCore - the core Arc keyboard engine with prediction, key handling, and metrics
const { useState, useEffect, useRef, useCallback, useMemo } = React;

const ArcCore = ({
    isActive,
    targetSentence,
    onComplete,
    title = "Arc",
    interceptKey = null,
    interceptKeyUp = null,
    onTextChange = null,
    renderOverlay = null,
    removeSpecials = false,
    showMetricsScreen = true,
    attemptNumber = 1,
    arcIndex = 0,
    classicIndex = 0
}) => {
    const [text, setText] = useState("");
    const [layer, setLayer] = useState(0);
    const [success, setSuccess] = useState(false);
    const [particles, setParticles] = useState([]);
    const [showLegend, setShowLegend] = useState(true);
    const [cycleKey, setCycleKey] = useState(0);
    const isMobileDevice = useIsMobile();

    // Metrics State
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [keystrokes, setKeystrokes] = useState(0);
    const [backspaceCount, setBackspaceCount] = useState(0);
    const [intervals, setIntervals] = useState([]);
    const [isCompleted, setIsCompleted] = useState(false);

    const downTimerRef = useRef(null);
    const downHandledRef = useRef(false);
    const isDownPressedRef = useRef(false);
    const lastEnterRef = useRef(0);
    const lastSelectionRef = useRef(null);

    const theme = 'emerald';
    const currentTheme = THEMES[theme];

    const letters = useMemo(() => {
        const baseProbs = getBaseProbabilities(text);

        if (removeSpecials) {
            [' ', 'DEL'].forEach(special => {
                const idx = baseProbs.indexOf(special.toLowerCase());
                if (idx !== -1) baseProbs.splice(idx, 1);
            });
        }

        if (lastSelectionRef.current && layer === 0) {
            const { char, dir } = lastSelectionRef.current;
            const charIndex = baseProbs.indexOf(char.toLowerCase());

            if (charIndex !== -1 && charIndex < 3) {
                let targetIndex;
                if (dir === 'up') targetIndex = 0;
                else if (dir === 'right') targetIndex = 1;
                else if (dir === 'left') targetIndex = 2;

                if (targetIndex !== undefined && charIndex !== targetIndex) {
                    const temp = baseProbs[targetIndex];
                    baseProbs[targetIndex] = baseProbs[charIndex];
                    baseProbs[charIndex] = temp;
                }
            }
        }
        return baseProbs;
    }, [text, layer, removeSpecials]);

    const handleSelect = (dir, char) => {
        if (!char) return;

        const id = Date.now() + Math.random();
        setParticles(prev => [...prev, { id, dir, char }]);
        setTimeout(() => setParticles(prev => prev.filter(p => p.id !== id)), 250);

        lastSelectionRef.current = { char, dir };
        setText(prev => prev + char);
        setLayer(0);
        setShowLegend(false);
    };

    const handleBackspace = () => {
        lastSelectionRef.current = null;
        setText(prev => prev.slice(0, -1));
        setLayer(0);
        setCycleKey(prev => prev + 1);
        setBackspaceCount(prev => prev + 1);
    };

    const stateRef = useRef({ layer, letters, text, success, interceptKey, interceptKeyUp });
    useEffect(() => {
        stateRef.current = { layer, letters, text, success, interceptKey, interceptKeyUp };
    }, [layer, letters, text, success, interceptKey, interceptKeyUp]);

    // Check for custom text completion logic
    useEffect(() => {
        if (onTextChange) {
            onTextChange(text, setSuccess);
        }

        if (targetSentence && text === targetSentence && !isCompleted) {
            setIsCompleted(true);
            setEndTime(Date.now());
        }
    }, [text, targetSentence, isCompleted, onTextChange]);

    useEffect(() => {
        if (!isActive || isCompleted) return;

        const handleKeyDown = (e) => {
            const { layer: currentLayer, letters: currentLetters, text: currentText, success: currentSuccess, interceptKey: currentInterceptKey } = stateRef.current;
            const offset = currentLayer * 3;
            const getChar = (idx) => currentLetters[idx % currentLetters.length];

            const validKeys = ['ArrowUp', 'ArrowRight', 'ArrowLeft', 'ArrowDown', 'Enter', 'Backspace', 'Escape'];

            if (validKeys.includes(e.key)) {
                if (currentInterceptKey) {
                    const prevent = currentInterceptKey(e, { text: currentText, layer: currentLayer, success: currentSuccess });
                    if (prevent) {
                        e.preventDefault();
                        return;
                    }
                }

                e.preventDefault();

                const now = Date.now();
                setIntervals(prev => [...prev, now]);
                setKeystrokes(prev => prev + 1);
                setStartTime(prev => prev === null ? now : prev);
            }

            if (e.key === 'ArrowUp') {
                handleSelect('up', getChar(offset));
            } else if (e.key === 'ArrowRight') {
                handleSelect('right', getChar(offset + 1));
            } else if (e.key === 'ArrowLeft') {
                handleSelect('left', getChar(offset + 2));
            } else if (e.key === 'ArrowDown') {
                if (isDownPressedRef.current) return;
                isDownPressedRef.current = true;
                downHandledRef.current = false;

                downTimerRef.current = setTimeout(() => {
                    downHandledRef.current = true;
                    handleBackspace();
                    downTimerRef.current = setTimeout(() => {
                        downTimerRef.current = setInterval(() => handleBackspace(), 75);
                    }, 400);
                }, 350);
            } else if (e.key === 'Enter') {
                const now = Date.now();
                if (now - lastEnterRef.current < 300) {
                    setSuccess(true);
                    setTimeout(() => setSuccess(false), 1000);
                } else {
                    lastSelectionRef.current = null;
                    setText(prev => prev + " ");
                    setLayer(0);
                }
                lastEnterRef.current = now;
            } else if (e.key === 'Backspace') {
                handleBackspace();
            }
        };

        const handleKeyUp = (e) => {
            const { layer: currentLayer, text: currentText, success: currentSuccess, interceptKeyUp: currentInterceptKeyUp } = stateRef.current;
            if (currentInterceptKeyUp) {
                const prevent = currentInterceptKeyUp(e, { text: currentText, layer: currentLayer, success: currentSuccess });
                if (prevent) {
                    e.preventDefault();
                    return;
                }
            }

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                isDownPressedRef.current = false;
                clearInterval(downTimerRef.current);
                clearTimeout(downTimerRef.current);

                if (!downHandledRef.current) {
                    const { letters: currentLetters } = stateRef.current;
                    const maxLayers = Math.ceil((currentLetters.length || 26) / 3);

                    // Visual feedback for cycle
                    const id = Date.now() + Math.random();
                    setParticles(prev => [...prev, { id, dir: 'down', char: '▼' }]);
                    setTimeout(() => setParticles(prev => prev.filter(p => p.id !== id)), 300);

                    setLayer(prev => (prev + 1) % maxLayers);
                    setCycleKey(prev => prev + 1);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            clearInterval(downTimerRef.current);
            clearTimeout(downTimerRef.current);
        };
    }, [isActive, isCompleted, startTime]);

    if (isCompleted && showMetricsScreen) {
        const timeInSeconds = ((endTime - startTime) / 1000).toFixed(2);
        const wpm = ((text.length / 5) / (timeInSeconds / 60)).toFixed(1);

        return (
            <div className={`flex flex-col items-center justify-center w-full h-full relative transition-all duration-500`}>
                <div className={`absolute top-[-20%] left-[-10%] w-[50%] h-[50%] ${currentTheme.glow} blur-[120px] rounded-full pointer-events-none`}></div>

                <div className={`glass-panel ${isMobileDevice ? 'p-6' : 'p-8'} flex flex-col items-center gap-6 ${currentTheme.focusPanel} border-opacity-50 max-w-sm w-full z-20`}>
                    <h2 className={`text-xl font-bold tracking-widest uppercase ${currentTheme.text}`}>{isMobileDevice ? (arcIndex > classicIndex ? "Arc Phase Complete" : "Success!") : "Arc Completed"}</h2>

                    {isMobileDevice ? (
                        <div className="flex flex-col items-center gap-2 mb-2">
                            <div className="text-4xl font-light text-white">{wpm} <span className="text-sm uppercase opacity-60">WPM</span></div>
                            <div className="text-xs text-slate-400 uppercase tracking-widest">{arcIndex > classicIndex ? "Phase 1: Arc Done" : "Speed Evaluated"}</div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 w-full text-slate-300">
                            <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
                                <span className="text-sm uppercase tracking-wider opacity-60">Time</span>
                                <span className="text-2xl font-light">{timeInSeconds}s</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
                                <span className="text-sm uppercase tracking-wider opacity-60">Speed</span>
                                <span className="text-2xl font-light">{wpm} WPM</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
                                <span className="text-sm uppercase tracking-wider opacity-60">Keystrokes</span>
                                <span className="text-2xl font-light">{keystrokes}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
                                <span className="text-sm uppercase tracking-wider opacity-60">Efficiency</span>
                                <span className="text-2xl font-light">{(keystrokes / text.length).toFixed(2)} keys/char</span>
                            </div>
                            <div className="flex justify-between items-center pb-2">
                                <span className="text-sm text-red-300 uppercase tracking-wider opacity-80">Errors/Bckspcs</span>
                                <span className="text-2xl text-red-200 font-light">{backspaceCount}</span>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => {
                            const payload = {
                                paradigm: 'arc',
                                attemptNumber,
                                sentence: targetSentence,
                                keystrokes,
                                backspaceCount,
                                timeSeconds: timeInSeconds,
                                wpm: wpm,
                                efficiency: (keystrokes / text.length).toFixed(2),
                                intervals,
                                deviceType: getDeviceType()
                            };

                            try {
                                if (typeof window.recordSession === 'function') {
                                    window.recordSession(payload);
                                } else {
                                    console.warn("Analytics module not loaded. Skipping recordSession.");
                                }
                            } catch (e) {
                                console.error("Error calling recordSession:", e);
                            }

                            setText("");
                            setStartTime(null);
                            setEndTime(null);
                            setKeystrokes(0);
                            setBackspaceCount(0);
                            setIntervals([]);
                            setIsCompleted(false);

                            if (onComplete) onComplete(payload);
                        }}
                        className={`mt-4 px-8 py-4 rounded-full font-bold tracking-[0.2em] uppercase transition-all duration-300 ${currentTheme.active} hover:scale-105 shadow-xl`}
                    >
                        {isMobileDevice ?
                            (arcIndex > classicIndex ? "Try Next: Classic (Same Text)" : "Finish Round & Start Next")
                            : "Next Sentence"}
                    </button>
                </div>
            </div >
        );
    }

    return (
        <div className={`flex flex-col items-center gap-6 sm:gap-4 pt-[10px] w-full h-auto relative transition-all duration-500 ${isActive ? 'opacity-100 scale-100' : 'opacity-40 grayscale-[0.8] mix-blend-screen pointer-events-none scale-[0.97]'}`}>
            <div className={`absolute top-[-20%] left-[-10%] w-[50%] h-[50%] ${currentTheme.glow} blur-[120px] rounded-full pointer-events-none`}></div>

            <SharedActiveIndicator isActive={isActive} theme={theme} title={title} />
            <SharedTypeArea title={title} text={text} targetSentence={targetSentence} isActive={isActive} success={success} theme={theme} />

            <div className={isMobileDevice ? 'mt-[130px] sm:mt-32' : 'mt-[140px] sm:mt-[145px]'}>
                <SharedArcRing
                    isActive={isActive}
                    success={success}
                    theme={theme}
                    letters={letters}
                    layer={layer}
                    particles={particles}
                    cycleKey={cycleKey}
                />
            </div>

            {renderOverlay ? (
                renderOverlay()
            ) : (
                <div className={`${isMobileDevice ? 'hidden' : 'mt-6 sm:mt-10'} transition-all duration-1000 z-30 w-full flex justify-center px-4 pb-8 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="flex flex-row flex-nowrap gap-3 md:gap-6 justify-center text-[10px] lg:text-[12px] text-slate-400 glass-panel px-6 py-2 shadow-xl whitespace-nowrap">
                        <div className="flex items-center gap-2">
                            <div className={`px-1.5 py-0.5 bg-slate-800/80 rounded border border-slate-700/50 shadow-inner font-mono text-xs ${currentTheme.accent}`}>↑←→</div>
                            <span>Select</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="px-1.5 py-0.5 bg-slate-800/80 rounded border border-slate-700/50 shadow-inner font-mono text-xs">↓</div>
                            <span>Cycle</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="px-1.5 py-0.5 bg-slate-800/80 rounded border border-slate-700/50 shadow-inner font-mono text-[10px] text-rose-300">Hold ↓</div>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Del</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 opacity-60">
                            <div className="px-1.5 py-0.5 bg-slate-800/80 rounded border border-slate-700/50 shadow-inner font-mono text-[10px]">Enter</div>
                            <span className="text-[10px]">Space</span>
                        </div>
                    </div>
                </div>
            )}

            {!isActive && !isMobileDevice && (
                <div className="absolute inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300">
                    <div className="flex flex-col items-center gap-3 transform hover:scale-105 transition-transform duration-300">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"></path><path d="M12 22V12"></path><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"></path><path d="m7.5 4.21 4.5 2.6a2 2 0 0 0 2 0l4.5-2.6"></path></svg>
                        </div>
                        <span className="text-emerald-300 font-bold uppercase tracking-widest text-sm bg-slate-900/80 px-4 py-2 rounded-full border border-emerald-500/30">Tap to Switch to Arc</span>
                    </div>
                </div>
            )}
        </div>
    );
};

// ArcKeyboard wrapper
window.ArcCore = ArcCore;
window.ArcKeyboard = (props) => {
    return <ArcCore {...props} title="Arc Paradigm" showMetricsScreen={true} />;
};
