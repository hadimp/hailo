// LeaderboardOverlay - global leaderboard modal
const { useState, useEffect } = React;

window.LeaderboardOverlay = ({ onClose }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            if (typeof window.fetchLeaderboard === 'function') {
                const stats = await window.fetchLeaderboard();
                setData(stats);
            }
            setLoading(false);
        };
        loadData();
    }, []);

    return (
        <div className="absolute inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-[#0b1120] border border-slate-700/50 rounded-2xl p-6 md:p-8 max-w-4xl w-full shadow-2xl relative flex flex-col max-h-[90vh]">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors bg-slate-800/50 hover:bg-slate-700 rounded-full w-8 h-8 flex items-center justify-center">✕</button>

                <div className="flex items-center gap-3 mb-8">
                    <span className="text-3xl">🏆</span>
                    <h2 className="text-2xl font-bold text-white tracking-widest uppercase">Global Leaderboard</h2>
                </div>

                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
                        <div className="w-12 h-12 border-4 border-slate-700/50 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-400 uppercase tracking-widest text-sm">Fetching Community Data...</p>
                    </div>
                ) : !data ? (
                    <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] text-rose-400">
                        <p>Failed to load leaderboard data.</p>
                        <p className="text-sm text-slate-500 mt-2">Check console for webhook errors.</p>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto flex flex-col md:flex-row gap-8 min-h-[300px]">
                        {/* Hailo Column */}
                        <div className="flex-1 bg-emerald-900/10 border border-emerald-500/20 rounded-xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full pointer-events-none"></div>
                            <h3 className="text-xl font-bold text-emerald-400 mb-6 uppercase tracking-wider relative z-10">Hailo Top 5</h3>
                            <div className="space-y-3 relative z-10">
                                {data.hailo?.top?.map((wpm, i) => (
                                    <div key={i} className="flex justify-between items-center bg-slate-900/50 px-4 py-3 rounded-lg border border-emerald-500/10">
                                        <span className="text-slate-500 font-mono">#{i + 1}</span>
                                        <span className="text-emerald-300 font-bold text-xl">{wpm.toFixed(1)} <span className="text-xs text-emerald-500 font-normal uppercase">WPM</span></span>
                                    </div>
                                ))}
                                {(!data.hailo?.top || data.hailo.top.length === 0) && <p className="text-slate-500 italic">No runs recorded.</p>}
                            </div>
                            <div className="mt-8 pt-6 border-t border-emerald-500/20 relative z-10">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm uppercase tracking-wider text-slate-400">Community Avg Speed</span>
                                    <span className="text-slate-200 font-mono text-lg">{data.hailo.avgWpm} wpm</span>
                                </div>
                                <div className="flex justify-end mb-4">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">Words Per Minute</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm uppercase tracking-wider text-slate-400">Community Avg Errors</span>
                                    <span className="text-slate-200 font-mono text-lg">{data.hailo.avgErrors}</span>
                                </div>
                            </div>
                        </div>

                        {/* Classic Column */}
                        <div className="flex-1 bg-blue-900/10 border border-blue-500/20 rounded-xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full pointer-events-none"></div>
                            <h3 className="text-xl font-bold text-blue-400 mb-6 uppercase tracking-wider relative z-10">Classic Top 5</h3>
                            <div className="space-y-3 relative z-10">
                                {(data.qwerty || data.classic)?.top?.map((wpm, i) => (
                                    <div key={i} className="flex justify-between items-center bg-slate-900/50 px-4 py-3 rounded-lg border border-blue-500/10">
                                        <span className="text-slate-500 font-mono">#{i + 1}</span>
                                        <span className="text-blue-300 font-bold text-xl">{wpm.toFixed(1)} <span className="text-xs text-blue-500 font-normal uppercase">WPM</span></span>
                                    </div>
                                ))}
                                {(!(data.qwerty || data.classic)?.top || (data.qwerty || data.classic).top.length === 0) && <p className="text-slate-500 italic">No runs recorded.</p>}
                            </div>
                            <div className="mt-8 pt-6 border-t border-blue-500/20 relative z-10">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm uppercase tracking-wider text-slate-400">Community Avg Speed</span>
                                    <span className="text-slate-200 font-mono text-lg">{(data.qwerty || data.classic)?.avgWpm} wpm</span>
                                </div>
                                <div className="flex justify-end mb-4">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">Words Per Minute</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm uppercase tracking-wider text-slate-400">Community Avg Errors</span>
                                    <span className="text-slate-200 font-mono text-lg">{(data.qwerty || data.classic)?.avgErrors}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

