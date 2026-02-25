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
    let uid = localStorage.getItem('arc_user_id');
    if (!uid) {
        uid = window.generateSessionId();
        localStorage.setItem('arc_user_id', uid);
    }
    return uid;
};

// Replace this URL with your actual Google Apps Script Webhook URL once deployed
window.GOOGLE_SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwk6yRdHp-S_dGUJG_Dx4Uyy85EQZCSnB-L5hCq-8fzFAT6nnFWHHj1L5iiO2ly71wLIQ/exec";

/**
 * Format and send telemetry data for a completed typing trial
 * @param {Object} metrics - Data object emitted by ArcCore or QwertyCore
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

/**
 * Fetch the global leaderboard statistics from the webhook
 * Returns an object containing top scores and averages for both paradigms
 */
window.fetchLeaderboard = async function () {
    if (!window.GOOGLE_SHEETS_WEBHOOK_URL) {
        console.warn("Analytics: GOOGLE_SHEETS_WEBHOOK_URL is empty. Cannot fetch leaderboard.");
        return null;
    }

    try {
        const response = await fetch(window.GOOGLE_SHEETS_WEBHOOK_URL);
        const data = await response.json();
        console.log("[Analytics] Successfully fetched global leaderboard.", data);
        return data;
    } catch (error) {
        console.error("[Analytics] Failed to fetch leaderboard data:", error);
        return null;
    }
};
