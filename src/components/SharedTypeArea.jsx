// Shared Type Area Component - displays the target sentence and typed text
const { useState, useEffect, useRef, useCallback, useMemo } = React;

window.SharedTypeArea = ({ title, text, targetSentence, isActive, success, theme }) => {
    const currentTheme = THEMES[theme];
    const isMobile = useIsMobile();
    return (
        <div className={`w-full ${isMobile ? 'pt-0' : 'pt-14 md:pt-16'} px-2 sm:px-4 md:px-8 flex justify-center items-start z-30 shrink-0`}>
            <div className={`glass-panel px-3 sm:px-4 py-3 sm:py-4 w-full max-w-md text-center transition-all duration-300 ${isActive ? `${currentTheme.focusPanel} border-opacity-50` : 'shadow-lg border-slate-700/30'}`}>
                <h2 className={`text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase mb-2 sm:mb-4 transition-colors ${isActive ? currentTheme.text : 'text-slate-500'}`}>
                    TYPE THIS TEXT:
                </h2>
                {targetSentence && (
                    <div className="mb-2">
                        <div className="text-base md:text-xl font-bold text-white tracking-[0.05em] drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">
                            {targetSentence.split('').map((char, i) => {
                                const typedChar = text[i];
                                let className = "transition-all duration-200";
                                if (typedChar === undefined) {
                                    className += " text-slate-400";
                                } else if (typedChar === char) {
                                    className += ` ${currentTheme.text} font-bold`;
                                } else {
                                    className += " text-red-400 bg-red-900/30 rounded px-px";
                                }
                                return <span key={i} className={className}>{char}</span>;
                            })}
                        </div>
                    </div>
                )}
                <div className="text-2xl lg:text-4xl font-light text-white tracking-wide break-words min-h-[40px] flex items-center justify-center">
                    {text || <span className="opacity-20 italic">Type...</span>}
                </div>
            </div>
        </div>
    );
};
