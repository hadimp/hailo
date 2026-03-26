// Device detection utility
window.getDeviceType = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) return "tablet";
    if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) return "mobile";
    return "computer";
};

// React hook for mobile/tablet detection
window.useIsMobile = () => {
    const device = window.getDeviceType();
    return device === "mobile" || device === "tablet";
};
