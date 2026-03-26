// Shared Active Indicator - shows ACTIVE/SELECT badge on desktop
window.SharedActiveIndicator = ({ isActive, theme, title }) => {
    const currentTheme = THEMES[theme];
    const isMobile = useIsMobile();
    if (isMobile) return null;

    // Extract the base paradigm name from titles like "Tutorial: Intro" or "Arc Playground"
    const getDisplayTitle = () => {
        if (!title) return '';
        if (title.toLowerCase().includes('arc')) return 'ARC';
        if (title.toLowerCase().includes('classic')) return 'CLASSIC';
        return title;
    };

    return (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full flex justify-center z-50">
            <div className={`px-5 py-2 rounded-full text-[11px] sm:text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-500 shadow-xl border flex items-center gap-2
                ${isActive
                    ? currentTheme.active
                    : 'bg-transparent text-slate-600 border-transparent'}`}>
                <span>{getDisplayTitle()}</span>
                {isActive && <span className="opacity-50">|</span>}
                <span>{isActive ? '● ACTIVE' : 'SELECT'}</span>
            </div>
        </div>
    );
};
