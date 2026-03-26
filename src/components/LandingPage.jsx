// LandingPage - Desktop and Mobile landing pages

// Desktop Landing Page
window.LandingPage = ({ onStartTutorial, onSkip, onShowStats }) => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-[#0b1120] border-[8px] border-slate-900 overflow-hidden relative p-8 animate-fade-in">
            <div className="absolute top-[20%] left-[50%] -translate-x-[50%] w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="z-10 flex flex-col items-center text-center max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-emerald-300 to-emerald-600 bg-clip-text text-transparent mb-6 tracking-tight">
                    Arc Paradigm
                </h1>
                <p className="text-lg text-slate-300/80 mb-6 leading-relaxed font-light">
                    Welcome! Typing on Smart TVs, game consoles, and VR devices with older paradigms is slow and frustrating. This platform is designed to introduce you to a faster way to type using only directional inputs. Learn the fundamentals of the <strong className="text-emerald-400 font-medium">Arc</strong> paradigm, and test your skills against a <strong className="text-blue-400 font-medium">Classic</strong> baseline.
                </p>

                <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 mb-10 w-full max-w-lg text-sm text-slate-400">
                    <span className="text-blue-400 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mb-0.5"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                    </span>
                    For research purposes, we record anonymous typing metrics (speed, keystrokes, accuracy) during the research suite. No personal information is collected.
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <button
                        onClick={onStartTutorial}
                        className="px-8 py-4 rounded-full font-bold tracking-wider uppercase transition-all duration-300 bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:scale-105 hover:bg-emerald-500/30"
                    >
                        Start Tutorial
                    </button>
                    <button
                        onClick={onSkip}
                        className="px-8 py-4 rounded-full font-bold tracking-wider uppercase transition-all duration-300 bg-blue-500/10 text-blue-300 border border-blue-400/50 shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:scale-105 hover:bg-blue-500/20"
                    >
                        Enter Research Suite
                    </button>
                    <button
                        onClick={onShowStats}
                        className="px-8 py-4 rounded-full font-bold tracking-wider uppercase transition-all duration-300 bg-slate-800 text-slate-400 border border-slate-700/50 hover:bg-slate-700 hover:text-white"
                    >
                        View Stats
                    </button>
                </div>
            </div>
        </div>
    );
};

// Mobile Landing Page
window.MobileLandingPage = ({ onStartTutorial, onStartPractice, onShowStats }) => (
    <div className="flex flex-col items-center justify-start pt-[10vh] w-full h-full p-6 relative animate-fade-in overflow-y-auto pb-10">
        <div className="fixed top-[20%] left-[50%] -translate-x-[50%] w-[400px] h-[400px] bg-emerald-500/10 blur-[90px] rounded-full pointer-events-none"></div>

        <div className="z-10 flex flex-col items-center text-center max-w-sm">
            <h1 className="text-5xl font-bold bg-gradient-to-br from-emerald-300 to-emerald-600 bg-clip-text text-transparent mb-6 tracking-tight drop-shadow-lg">
                Arc
            </h1>
            <div className="w-16 h-1 bg-emerald-500/50 mb-6 rounded-full"></div>

            <p className="text-sm text-slate-300/90 mb-6 leading-relaxed font-light px-2 text-left">
                Welcome! Typing on Smart TVs, game consoles, and VR devices with older paradigms is slow and frustrating. This platform is designed to introduce you to a faster way to type using only directional inputs. Learn the fundamentals of the <strong className="text-emerald-400 font-medium">Arc</strong> paradigm, and test your skills against a <strong className="text-blue-400 font-medium">Classic</strong> baseline.
            </p>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg px-4 py-4 mb-10 w-full text-xs text-slate-400 text-left shadow-lg flex items-start gap-2">
                <span className="text-blue-400 mt-0.5 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                </span>
                <span>For research purposes, we record anonymous typing metrics (speed, keystrokes, accuracy) during the research suite session. No personal information is collected.</span>
            </div>

            <div className="w-full flex flex-col gap-3 shrink-0">
                <button
                    onClick={onStartTutorial}
                    className="w-full py-4 rounded-3xl font-bold text-[15px] tracking-widest uppercase transition-all duration-300 bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 shadow-[0_0_30px_rgba(16,185,129,0.2)] active:scale-95 active:bg-emerald-500/30"
                >
                    Start Tutorial
                </button>
                <button
                    onClick={onStartPractice}
                    className="w-full py-4 rounded-3xl font-bold text-[15px] tracking-widest uppercase transition-all duration-300 bg-blue-500/10 text-blue-300 border border-blue-400/50 shadow-[0_0_25px_rgba(59,130,246,0.15)] active:scale-95 active:bg-blue-500/20"
                >
                    Enter Research Suite
                </button>
                <button
                    onClick={() => onShowStats && onShowStats()}
                    className="w-full py-4 rounded-3xl font-bold text-[15px] tracking-widest uppercase transition-all duration-300 bg-slate-800/40 text-slate-400 border border-slate-700/50 hover:bg-slate-700/60 active:scale-95"
                >
                    View Performance Stats
                </button>
            </div>
        </div>
    </div>
);
