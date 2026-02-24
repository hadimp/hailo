// src/engine/Analytics.js

// Generate a random UUID-like string for anonymous session tracking
window.generateSessionId = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

// Ensure the user has a cross-session anonymous ID stored
window.getOrCreateUserId = function () {
    let uid = localStorage.getItem('slingshot_user_id');
    if (!uid) {
        uid = window.generateSessionId();
        localStorage.setItem('slingshot_user_id', uid);
    }
    return uid;
};

// Replace this URL with your actual Google Apps Script Webhook URL once deployed
window.GOOGLE_SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbx88q2zEr7TREh9HqVcixFCZJjPvXAEtXnopC0EdmMi6llutaR6ij2HFYwi5swpJ7TI6A/exec";

/**
 * Format and send telemetry data for a completed typing trial
 * @param {Object} metrics - Data object emitted by SlingshotCore or QwertyCore
 */
window.recordSession = async function (metrics) {
    if (!window.GOOGLE_SHEETS_WEBHOOK_URL) {
        console.warn("Analytics: GOOGLE_SHEETS_WEBHOOK_URL is empty. Data was NOT sent. Payload was:", metrics);
        return;
    }

    try {
        const payload = {
            timestamp: new Date().toISOString(),
            userId: window.getOrCreateUserId(),
            ...metrics
        };

        const response = await fetch(window.GOOGLE_SHEETS_WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors', // Google Apps Script web apps often require no-cors when accessed from frontend JS
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        console.log(`[Analytics] Successfully recorded ${metrics.paradigm} trial.`);
    } catch (error) {
        console.error("[Analytics] Failed to record session data:", error);
    }
};
