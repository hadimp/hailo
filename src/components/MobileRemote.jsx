// MobileRemote - on-screen D-pad remote control
// MobilePlaygroundWarning - warning modal for mobile testing

window.MobilePlaygroundWarning = ({ onProceed }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
            <div className="glass-panel max-w-sm w-full p-6 space-y-6 text-center shadow-2xl border border-amber-500/30">
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-500/50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                    </div>
                </div>
                <div className="space-y-2">
                    <h2 className="text-xl font-bold tracking-tight text-amber-400 uppercase">Mobile Testing Guard</h2>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        To compare these paradigms objectively, we recommend testing <span className="text-emerald-400 font-bold">BOTH</span> Arc and Classic.
                    </p>
                    <p className="text-slate-400 text-xs italic">
                        Note: This website isn't optimized for mobile testing.
                    </p>
                </div>
                <button
                    onClick={onProceed}
                    className="w-full py-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 font-bold tracking-widest uppercase rounded-xl transition-all duration-300 active:scale-95 shadow-lg"
                >
                    Proceed to Training
                </button>
            </div>
        </div>
    );
};

window.MobileRemote = ({ isMobile, activeMode, setActiveMode, embedded = false, compact = false }) => {
    if (!isMobile) return null;

    const Button = ({ icon, label, keyName, sizeClass = "w-12 h-12 md:w-16 md:h-16", colorClass = "bg-slate-800/80 border-slate-600/50 text-slate-300", extraClass = "" }) => (
        <button
            className={`${sizeClass} ${colorClass} ${extraClass} border rounded-full flex items-center justify-center font-bold shadow-[0_4px_20px_rgba(0,0,0,0.3)] active:bg-emerald-500/30 active:border-emerald-500/50 active:text-emerald-300 transition-colors select-none touch-manipulation`}
            onPointerDown={(e) => {
                e.preventDefault();
                e.currentTarget.setPointerCapture(e.pointerId);
                window.dispatchEvent(new KeyboardEvent('keydown', { key: keyName, bubbles: true }));
                if (navigator.vibrate) navigator.vibrate(15);
            }}
            onPointerUp={(e) => {
                e.preventDefault();
                e.currentTarget.releasePointerCapture(e.pointerId);
                window.dispatchEvent(new KeyboardEvent('keyup', { key: keyName, bubbles: true }));
            }}
            onPointerCancel={(e) => {
                e.preventDefault();
                window.dispatchEvent(new KeyboardEvent('keyup', { key: keyName, bubbles: true }));
            }}
            onContextMenu={(e) => e.preventDefault()}
        >
            {icon || label}
        </button>
    );

    const UpIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>;
    const DownIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>;
    const LeftIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>;
    const RightIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>;

    const containerClasses = embedded
        ? `flex flex-col items-center gap-1.5 sm:gap-4 ${compact ? 'scale-[0.85] origin-center' : 'scale-[0.95] sm:scale-105'}`
        : "fixed bottom-4 left-1/2 -translate-x-1/2 md:bottom-8 z-50 flex flex-col items-center gap-2 p-3 md:p-4 bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/80 shadow-[0_10px_40px_rgba(0,0,0,0.5)] scale-[0.85] sm:scale-100 origin-bottom";

    return (
        <div className={containerClasses}>
            <Button icon={UpIcon} keyName="ArrowUp" />
            <div className="flex items-center gap-1.5 sm:gap-4">
                <Button icon={LeftIcon} keyName="ArrowLeft" />
                <Button label="OK" keyName="Enter" sizeClass="w-14 h-14 md:w-[72px] md:h-[72px]" colorClass="text-emerald-400 bg-emerald-900/40 border-emerald-500/50" extraClass="text-[13px] md:text-[18px] tracking-wider md:tracking-widest" />
                <Button icon={RightIcon} keyName="ArrowRight" />
            </div>
            <Button icon={DownIcon} keyName="ArrowDown" />
            {!embedded && (
                <>
                    <button
                        onClick={() => setActiveMode(activeMode === 'arc' ? 'classic' : 'arc')}
                        className={`mt-1 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] border transition-all duration-300 select-none touch-manipulation shadow-lg animate-pulse-subtle
                            ${activeMode === 'arc'
                                ? 'bg-blue-600/20 border-blue-500/50 text-blue-300 hover:bg-blue-600/30'
                                : 'bg-emerald-600/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-600/30'}`}
                    >
                        {activeMode === 'arc' ? 'Switch to Classic' : 'Switch to Arc'}
                    </button>
                    <div className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1 opacity-60">Control Panel</div>
                </>
            )}
        </div>
    );
};
