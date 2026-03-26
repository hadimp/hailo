// Theme definitions for Arc (emerald) and Classic (blue) paradigms
window.THEMES = {
    blue: {
        text: 'text-blue-400',
        hex: '#60a5fa',
        cursor: 'bg-blue-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]',
        active: 'bg-blue-500/20 text-blue-300 border-blue-400/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]',
        focusPanel: 'border-blue-500/30 shadow-[0_0_20px_rgba(56,189,248,0.1)]',
        accent: 'text-blue-300',
        particle: 'border-blue-400 text-blue-400 shadow-[0_0_20px_rgba(56,189,248,0.5)]',
        focusRing: 'border-blue-500/50',
        glow: 'bg-blue-500/10'
    },
    emerald: {
        text: 'text-emerald-400',
        hex: '#34d399',
        cursor: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]',
        active: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]',
        focusPanel: 'border-emerald-500/30 shadow-[0_0_20px_rgba(52,211,153,0.1)]',
        accent: 'text-emerald-300',
        particle: 'border-emerald-400 text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.5)]',
        focusRing: 'border-emerald-500/50',
        glow: 'bg-emerald-500/10'
    }
};

// Shuffled target sentences for typing tests
window.TARGET_SENTENCES = (() => {
    const sentences = [
        "the quick brown fox",
        "artificial intelligence is cool",
        "this is a complex typing test",
        "coffee helps me focus",
        "designing a new interface",
        "keyboard layout comparison",
        "efficiency matters for speed",
        "learning to type faster",
        "minimalist aesthetics are sleek",
        "pull back and release the focus"
    ];
    for (let i = sentences.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sentences[i], sentences[j]] = [sentences[j], sentences[i]];
    }
    return sentences;
})();
