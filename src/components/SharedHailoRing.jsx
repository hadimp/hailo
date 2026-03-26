// Shared Hailo Visual Ring - circular letter display with particle animations
window.SharedHailoRing = ({ isActive, success, theme, letters, layer, particles, cycleKey }) => {
    const currentTheme = THEMES[theme];

    const maxLayers = Math.ceil((letters.length || 26) / 3);
    const offset = layer * 3;
    const nextOffset = ((layer + 1) % maxLayers) * 3;

    const getRawChar = (idx) => {
        const c = letters[idx % letters.length];
        return c ? c.toLowerCase() : '';
    };
    const getDisplayChar = (c) => c === ' ' ? '␣' : (c || '').toUpperCase();

    const rawUp = getRawChar(offset);
    const rawRight = getRawChar(offset + 1);
    const rawLeft = getRawChar(offset + 2);

    const predUp = getRawChar(nextOffset);
    const predRight = getRawChar(nextOffset + 1);
    const predLeft = getRawChar(nextOffset + 2);

    return (
        <div className="w-full flex justify-center items-center pt-4 sm:pt-20 md:pt-[15vh] pb-0 sm:pb-4 relative transform-gpu scale-100 sm:scale-[0.8] lg:scale-100 z-20 origin-center sm:flex-1">
            <div className={`focus-ring ${isActive ? currentTheme.focusRing : ''} ${success ? 'success' : ''}`}>
                {success && (
                    <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                )}
                {!success && <div className={`w-2 h-2 rounded-full ${isActive ? currentTheme.cursor.split(' ')[0] : 'bg-slate-600'} shadow-[0_0_10px_rgba(255,255,255,0.2)]`}></div>}
            </div>

            <div key={cycleKey} className="charWrapper cycle-flash">
                <div className={`letter-node slot-up ${isActive ? `${currentTheme.focusPanel.split(' ')[0]}` : ''}`}>
                    {getDisplayChar(rawUp)}
                    <div className="ghost-node" style={{
                        transform: 'translate(-50%, calc(-50% - 48px))',
                        opacity: isActive ? 0.4 : 0.2,
                        color: currentTheme.hex
                    }}>
                        {getDisplayChar(predUp)}
                    </div>
                </div>
                <div className={`letter-node slot-right ${isActive ? `${currentTheme.focusPanel.split(' ')[0]}` : ''}`}>
                    {getDisplayChar(rawRight)}
                    <div className="ghost-node" style={{
                        transform: 'translate(calc(-50% + 48px), -50%)',
                        opacity: isActive ? 0.4 : 0.2,
                        color: currentTheme.hex
                    }}>
                        {getDisplayChar(predRight)}
                    </div>
                </div>
                <div className={`letter-node slot-left ${isActive ? `${currentTheme.focusPanel.split(' ')[0]}` : ''}`}>
                    {getDisplayChar(rawLeft)}
                    <div className="ghost-node" style={{
                        transform: 'translate(calc(-50% - 48px), -50%)',
                        opacity: isActive ? 0.4 : 0.2,
                        color: currentTheme.hex
                    }}>
                        {getDisplayChar(predLeft)}
                    </div>
                </div>
            </div>

            <div className="charWrapper">
                {(particles || []).map(p => (
                    <div key={p.id} className={`letter-node particle ${currentTheme.particle} anim-${p.dir}`}>
                        {p.char.toUpperCase()}
                    </div>
                ))}
            </div>
        </div>
    );
};

