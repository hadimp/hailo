// ClassicKeyboard - QWERTY grid keyboard with arrow-key navigation
const { useState, useEffect, useRef, useCallback, useMemo } = React;

window.ClassicKeyboard = ({ isActive, targetSentence, onComplete, attemptNumber = 1, arcIndex = 0, classicIndex = 0 }) => {
    const [text, setText] = useState("");
    const [isCompleted, setIsCompleted] = useState(false);
    const isMobileDevice = useIsMobile();

    // Metrics
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [keystrokes, setKeystrokes] = useState(0);
    const [backspaceCount, setBackspaceCount] = useState(0);
    const [intervals, setIntervals] = useState([]);

    const keyboardLayout = useMemo(() => [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'DEL'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '?'],
        ['SPACE', 'SPACE', 'SPACE', 'SPACE', 'SPACE', 'SPACE', 'SPACE', 'SPACE', 'SPACE', 'SPACE']
    ], []);

    const [focusRow, setFocusRow] = useState(1);
    const [focusCol, setFocusCol] = useState(4);

    const theme = 'blue';
    const currentTheme = THEMES[theme];
    const title = "Classic Paradigm";

    // Check for completion
    useEffect(() => {
        if (targetSentence && text === targetSentence && !isCompleted) {
            setIsCompleted(true);
            setEndTime(Date.now());
        }
    }, [text, targetSentence, isCompleted]);

    useEffect(() => {
        if (!isActive || isCompleted) return;

        const handleKeyDown = (e) => {
            const ROWS = keyboardLayout.length;
            const COLS = keyboardLayout[0].length;

            const validKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Backspace'];
            const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ '.split('');

            if (ALPHABET.includes(e.key) && !e.metaKey && !e.ctrlKey && !e.altKey) {
                e.preventDefault();
                return;
            }

            if (validKeys.includes(e.key)) {
                e.preventDefault();

                setKeystrokes(prev => prev + 1);
                setStartTime(prev => prev === null ? Date.now() : prev);
                setIntervals(prev => [...prev, Date.now()]);
            }

            if (e.key === 'ArrowUp') {
                setFocusRow(r => Math.max(0, r - 1));
            } else if (e.key === 'ArrowDown') {
                setFocusRow(r => Math.min(ROWS - 1, r + 1));
            } else if (e.key === 'ArrowLeft') {
                setFocusCol(c => Math.max(0, c - 1));
            } else if (e.key === 'ArrowRight') {
                setFocusCol(c => Math.min(COLS - 1, c + 1));
            } else if (e.key === 'Enter') {
                const char = keyboardLayout[focusRow][focusCol];
                if (char === 'DEL') {
                    setText(prev => prev.slice(0, -1));
                    setBackspaceCount(prev => prev + 1);
                } else if (char === 'SPACE') {
                    setText(prev => prev + ' ');
                } else {
                    setText(prev => prev + char.toLowerCase());
                }
            } else if (e.key === 'Backspace') {
                setText(prev => prev.slice(0, -1));
                setBackspaceCount(prev => prev + 1);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isActive, isCompleted, startTime, focusRow, focusCol, keyboardLayout]);

    if (isCompleted) {
        const timeInSeconds = ((endTime - startTime) / 1000).toFixed(2);
        const wpm = ((text.length / 5) / (timeInSeconds / 60)).toFixed(1);

        return (
            <div className={`flex flex-col items-center justify-center w-full h-full relative transition-all duration-500`}>
                <div className={`absolute top-[-20%] right-[-10%] w-[50%] h-[50%] ${currentTheme.glow} blur-[120px] rounded-full pointer-events-none`}></div>

                <div className={`glass-panel ${isMobileDevice ? 'p-6' : 'p-8'} flex flex-col items-center gap-6 ${currentTheme.focusPanel} border-opacity-50 max-w-sm w-full z-20`}>
                    <h2 className={`text-xl font-bold tracking-widest uppercase ${currentTheme.text}`}>{isMobileDevice ? (classicIndex > arcIndex ? "Classic Phase Complete" : "Success!") : "Classic Completed"}</h2>

                    {isMobileDevice ? (
                        <div className="flex flex-col items-center gap-2 mb-2">
                            <div className="text-4xl font-light text-white">{wpm} <span className="text-sm uppercase opacity-60">WPM</span></div>
                            <div className="text-xs text-slate-400 uppercase tracking-widest">{classicIndex > arcIndex ? "Phase 1: Classic Done" : "Speed Evaluated"}</div>
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
                                paradigm: 'classic',
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
                            (classicIndex > arcIndex ? "Try Next: Arc (Same Text)" : "Finish Round & Start Next")
                            : "Next Sentence"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col items-center gap-6 sm:gap-4 pt-[10px] w-full h-auto relative transition-all duration-500 ${isActive ? 'opacity-100 scale-100' : 'opacity-40 grayscale-[0.8] mix-blend-screen pointer-events-none scale-[0.97]'}`}>
            <div className={`absolute top-[-20%] right-[-10%] w-[50%] h-[50%] ${currentTheme.glow} blur-[120px] rounded-full pointer-events-none`}></div>

            <SharedActiveIndicator isActive={isActive} theme={theme} title={title} />
            <SharedTypeArea title="Classic Paradigm" text={text} targetSentence={targetSentence} isActive={isActive} success={false} theme={theme} />

            <div className={`${isMobileDevice ? 'hidden' : 'mt-2 sm:mt-12'} z-40 bg-blue-500/10 border border-blue-500/30 text-blue-300 rounded px-3 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-sm font-medium tracking-wide shadow-lg text-center mx-4`}>
                ⚠️ Please use <strong className="text-blue-400">Arrow Keys</strong> to navigate and <strong className="text-blue-400">Enter</strong> to select.
            </div>

            <div className={`flex-1 w-full flex flex-col justify-start items-center ${isMobileDevice ? 'pt-2 scale-[0.85] origin-top' : 'pt-4 sm:pt-20 md:pt-[15vh] scale-100 origin-top'} pb-0 sm:pb-4 relative z-20 ${isMobileDevice ? 'mt-0' : 'mt-[-22px] sm:mt-[2px]'} lg:min-h-[300px]`}>
                <div className={`glass-panel p-2 sm:p-4 md:p-6 flex flex-col gap-1 sm:gap-2 md:gap-3 ${isActive ? `${currentTheme.focusPanel.split(' ')[0]}` : ''}`}>
                    {/* Row 1 */}
                    <div className="flex gap-1 sm:gap-1.5 md:gap-2 justify-center">
                        {keyboardLayout[0].map((k, idx) => (
                            <div key={'r0' + idx}
                                className={`w-7 h-9 sm:w-8 sm:h-10 md:w-10 md:h-12 text-[10px] sm:text-xs md:text-sm classic-key ${focusRow === 0 && focusCol === idx ? `${currentTheme.active.split(' ')[0]} border-${theme}-400 shadow-[0_0_15px_rgba(59,130,246,0.4)] text-white scale-105 z-10` : ''}`}>
                                {k}
                            </div>
                        ))}
                    </div>
                    {/* Row 2 */}
                    <div className="flex gap-1 sm:gap-1.5 md:gap-2 justify-center ml-2 md:ml-4">
                        {keyboardLayout[1].map((k, idx) => (
                            <div key={'r1' + idx}
                                className={`w-7 h-9 sm:w-8 sm:h-10 md:w-10 md:h-12 text-[10px] sm:text-xs md:text-sm classic-key ${focusRow === 1 && focusCol === idx ? `${currentTheme.active.split(' ')[0]} border-${theme}-400 shadow-[0_0_15px_rgba(59,130,246,0.4)] text-white scale-105 z-10` : ''}`}>
                                {k === 'DEL' ? <span className="text-lg md:text-xl">⌫</span> : k}
                            </div>
                        ))}
                    </div>
                    {/* Row 3 */}
                    <div className="flex gap-1 sm:gap-1.5 md:gap-2 justify-center ml-4 md:ml-10">
                        {keyboardLayout[2].map((k, idx) => (
                            <div key={'r2' + idx}
                                className={`w-7 h-9 sm:w-8 sm:h-10 md:w-10 md:h-12 text-[10px] sm:text-xs md:text-sm classic-key ${focusRow === 2 && focusCol === idx ? `${currentTheme.active.split(' ')[0]} border-${theme}-400 shadow-[0_0_15px_rgba(59,130,246,0.4)] text-white scale-105 z-10` : ''}`}>
                                {k}
                            </div>
                        ))}
                    </div>
                    {/* Row 4 (Space) */}
                    <div className="flex gap-1 sm:gap-1.5 md:gap-2 justify-center mt-1 sm:mt-2">
                        <div className={`w-[240px] sm:w-[280px] md:w-80 h-9 sm:h-10 md:h-12 text-[10px] sm:text-xs md:text-sm classic-key ${focusRow === 3 ? `${currentTheme.active.split(' ')[0]} border-${theme}-400 shadow-[0_0_15px_rgba(59,130,246,0.4)] text-white scale-105 z-10` : ''}`}>
                            SPACE
                        </div>
                    </div>
                </div>
            </div>

            <div className={`mt-2 sm:mt-4 transition-all duration-1000 z-30 w-full flex justify-center px-2 pb-8 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="flex flex-wrap gap-3 sm:gap-4 justify-center text-[9px] sm:text-[11px] lg:text-[13px] text-slate-400 glass-panel px-3 sm:px-4 py-2 sm:py-3 shadow-xl">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className={`px-1.5 py-0.5 bg-slate-800/80 rounded border border-slate-700/50 shadow-inner font-mono text-[9px] sm:text-xs ${currentTheme.accent}`}>↑↓←→</div>
                        <span>Move Focus</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className="px-1.5 py-0.5 bg-slate-800/80 rounded border border-slate-700/50 shadow-inner font-mono text-[9px] sm:text-[10px] text-green-300">Enter</div>
                        <span>Press Key</span>
                    </div>
                </div>
            </div>

            {!isActive && !isMobileDevice && (
                <div className="absolute inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300">
                    <div className="flex flex-col items-center gap-3 transform hover:scale-105 transition-transform duration-300">
                        <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><rect width="20" height="16" x="2" y="4" rx="2" ry="2"></rect><path d="M6 8h.001"></path><path d="M10 8h.001"></path><path d="M14 8h.001"></path><path d="M18 8h.001"></path><path d="M8 12h.001"></path><path d="M12 12h.001"></path><path d="M16 12h.001"></path><path d="M7 16h10"></path></svg>
                        </div>
                        <span className="text-blue-300 font-bold uppercase tracking-widest text-sm bg-slate-900/80 px-4 py-2 rounded-full border border-blue-500/30">Tap to Switch to Classic</span>
                    </div>
                </div>
            )}
        </div>
    );
};
