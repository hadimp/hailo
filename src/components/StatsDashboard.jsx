// StatsDashboard - Desktop and Mobile stats/results views
const { useState, useEffect } = React;

// Desktop Stats Dashboard
window.StatsDashboard = ({ hailoMetrics, classicMetrics, onClose }) => {
    const [globalStats, setGlobalStats] = useState(null);

    useEffect(() => {
        const loadGlobalStats = async () => {
            if (typeof window.fetchLeaderboard === 'function') {
                const stats = await window.fetchLeaderboard();
                setGlobalStats(stats);
            }
        };
        loadGlobalStats();
    }, []);

    const calculateAverage = (arr) => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : 0;

    const avgHailoWPM = calculateAverage(hailoMetrics.wpm);
    const avgClassicWPM = calculateAverage(classicMetrics.wpm);

    const avgHailoErrors = calculateAverage(hailoMetrics.errors);
    const avgClassicErrors = calculateAverage(classicMetrics.errors);

    return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-[#0b1120] border-[8px] border-slate-900 text-white animate-fade-in p-4 md:p-8 relative overflow-y-auto">
            <div className="absolute top-[20%] left-[50%] -translate-x-[50%] w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="p-4 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6 shadow-[0_0_30px_rgba(59,130,246,0.15)] z-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
                </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-10 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent z-10 tracking-tight text-center">Results</h1>
            
            
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 z-10">
                {/* Hailo Dashboard Card */}
                <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between group hover:border-emerald-500/40 transition-all duration-500">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-[120px] pointer-events-none group-hover:bg-emerald-500/10 transition-colors"></div>
                    <div>
                        <h3 className="text-emerald-500 text-xs font-bold uppercase tracking-[0.3em] mb-6">Hailo Paradigm Results</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl font-light text-emerald-300">{avgHailoWPM}</span>
                            <span className="text-sm font-bold text-emerald-500 uppercase tracking-widest">Words Per Minute</span>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-emerald-500/10 flex justify-between items-end">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-emerald-500/60 uppercase tracking-widest font-bold mb-1">Average Errors</span>
                            <span className="text-2xl font-light text-emerald-300/80">{avgHailoErrors}</span>
                        </div>
                        <div className="text-right min-h-[44px]">
                            {globalStats?.hailo && (
                                <>
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mb-1">Community Avg</span>
                                    <div className="flex flex-col items-end animate-fade-in">
                                        <span className="text-lg font-mono text-emerald-500/60">{globalStats.hailo.avgWpm} WPM</span>
                                        <span className="text-[12px] text-emerald-500/40 font-bold uppercase tracking-tighter">Errors: {globalStats.hailo.avgErrors}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Classic Dashboard Card */}
                <div className="bg-blue-900/10 border border-blue-500/20 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between group hover:border-blue-500/40 transition-all duration-500">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-[120px] pointer-events-none group-hover:bg-blue-500/10 transition-colors"></div>
                    <div>
                        <h3 className="text-blue-400 text-xs font-bold uppercase tracking-[0.3em] mb-6">Classic Paradigm Results</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl font-light text-blue-300">{avgClassicWPM}</span>
                            <span className="text-sm font-bold text-blue-400 uppercase tracking-widest">Words Per Minute</span>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-blue-500/10 flex justify-between items-end">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-blue-400/60 uppercase tracking-widest font-bold mb-1">Average Errors</span>
                            <span className="text-2xl font-light text-blue-300/80">{avgClassicErrors}</span>
                        </div>
                        <div className="text-right min-h-[44px]">
                            {(globalStats?.qwerty || globalStats?.classic) && (
                                <>
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mb-1">Community Avg</span>
                                    <div className="flex flex-col items-end animate-fade-in">
                                        <span className="text-lg font-mono text-blue-400/60">{(globalStats.qwerty || globalStats.classic).avgWpm} WPM</span>
                                        <span className="text-[12px] text-blue-400/40 font-bold uppercase tracking-tighter">Errors: {(globalStats.qwerty || globalStats.classic).avgErrors}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-4 mt-12 z-10 w-full max-w-lg text-center">
                <button
                    onClick={onClose}
                    className="px-10 py-4 rounded-full font-bold tracking-widest uppercase transition-all duration-300 bg-blue-600 hover:bg-blue-500 text-white shadow-[0_4px_20px_rgba(37,99,235,0.4)] active:scale-95 text-sm"
                >
                    Return to Home
                </button>
            </div>
        </div>
    );
};

// Mobile Stats Dashboard
window.MobileStatsDashboard = ({ hailoMetrics, classicMetrics, onClose }) => {
    const [globalStats, setGlobalStats] = useState(null);

    useEffect(() => {
        const loadGlobalStats = async () => {
            if (typeof window.fetchLeaderboard === 'function') {
                const stats = await window.fetchLeaderboard();
                setGlobalStats(stats);
            }
        };
        loadGlobalStats();
    }, []);

    const calculateAverage = (arr) => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : 0;
    const avgHailoWPM = calculateAverage(hailoMetrics.wpm);
    const avgClassicWPM = calculateAverage(classicMetrics.wpm);
    const avgHailoErrors = calculateAverage(hailoMetrics.errors);
    const avgClassicErrors = calculateAverage(classicMetrics.errors);

    return (
        <div className="flex flex-col items-center justify-center w-full h-full p-6 animate-fade-in text-white relative">
            <div className="p-4 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6 shadow-[0_0_30px_rgba(59,130,246,0.15)] z-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
                </svg>
            </div>
            <h2 className="text-4xl font-bold mb-10 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent z-10 tracking-tight">Results</h2>
            
            
            <div className="w-full max-w-[320px] flex flex-col gap-5 z-10">
                {/* Hailo Dashboard Card */}
                <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-3xl p-6 flex justify-between items-center text-emerald-300 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-[100px] pointer-events-none"></div>
                    <div className="flex flex-col relative z-10">
                        <div className="mb-2">
                            <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-emerald-500/60 block -mb-0.5">Hailo Paradigm</span>
                            <span className="text-[10px] uppercase tracking-[0.1em] font-black text-emerald-500">Words Per Minute</span>
                        </div>
                        <span className="text-4xl font-light">{avgHailoWPM}</span>
                        <div className="min-h-[24px]">
                            {globalStats?.hailo && (
                                <div className="mt-2 text-[10px] uppercase tracking-wider text-emerald-500/60 font-medium border-t border-emerald-500/10 pt-1 animate-fade-in flex justify-between gap-4">
                                    <span>Community Avg: {globalStats.hailo.avgWpm} WPM</span>
                                    <span className="text-emerald-500/40">Err: {globalStats.hailo.avgErrors}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col items-end relative z-10 -mt-[58px]">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-500 mb-1 font-bold">Errors</span>
                        <span className="text-2xl font-light opacity-80">{avgHailoErrors}</span>
                    </div>
                </div>

                {/* Classic Dashboard Card */}
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-3xl p-6 flex justify-between items-center text-blue-300 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-[100px] pointer-events-none"></div>
                    <div className="flex flex-col relative z-10">
                        <div className="mb-2">
                            <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-blue-500/60 block -mb-0.5">Classic Paradigm</span>
                            <span className="text-[10px] uppercase tracking-[0.1em] font-black text-blue-500">Words Per Minute</span>
                        </div>
                        <span className="text-4xl font-light">{avgClassicWPM}</span>
                        <div className="min-h-[24px]">
                            {(globalStats?.qwerty || globalStats?.classic) && (
                                <div className="mt-2 text-[10px] uppercase tracking-wider text-blue-500/60 font-medium border-t border-blue-500/10 pt-1 animate-fade-in flex justify-between gap-4">
                                    <span>Community Avg: {(globalStats.qwerty || globalStats.classic).avgWpm} WPM</span>
                                    <span className="text-blue-500/40">Err: {(globalStats.qwerty || globalStats.classic).avgErrors}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col items-end relative z-10 -mt-[58px]">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-blue-500 mb-1 font-bold">Errors</span>
                        <span className="text-2xl font-light opacity-80">{avgClassicErrors}</span>
                    </div>
                </div>

                <button 
                    onClick={onClose}
                    className="mt-6 w-full py-4 rounded-full font-bold tracking-wider uppercase bg-slate-800 hover:bg-slate-700 text-white shadow-xl active:scale-95 transition-all text-sm border border-slate-700/50"
                >
                    Return to Home
                </button>
            </div>
        </div>
    );
};

