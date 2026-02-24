/**
 * Google Apps Script Webhook for Slingshot Telemetry
 * 
 * INSTRUCTIONS:
 * 1. Go to script.google.com and create a new project.
 * 2. Paste this code into the editor.
 * 3. Replace the `SPREADSHEET_ID` and `SHEET_NAME` with your actual Google Sheet details.
 * 4. Click "Deploy" -> "New Deployment".
 * 5. Select type "Web app".
 * 6. Set "Execute as" to "Me".
 * 7. Set "Who has access" to "Anyone".
 * 8. Copy the Web app URL and paste it into `src/engine/Analytics.js` as the GOOGLE_SHEETS_WEBHOOK_URL.
 */

const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE"; // The ID from the Google Sheet URL
const SHEET_NAME = "Sheet1";

function doPost(e) {
    try {
        const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);

        // Parse the JSON payload sent from Analytics.js
        const data = JSON.parse(e.postData.contents);

        // If the sheet is empty, add headers first
        if (sheet.getLastRow() === 0) {
            sheet.appendRow([
                "Timestamp",
                "User ID",
                "Paradigm",
                "Sentence",
                "Keystrokes",
                "Backspace Count",
                "Time (Seconds)",
                "WPM",
                "Efficiency (keys/char)",
                "Intervals Payload (JSON)"
            ]);
        }

        // Append the telemetry data as a new row
        sheet.appendRow([
            data.timestamp || new Date().toISOString(),
            data.userId || "anonymous",
            data.paradigm || "unknown",
            data.sentence || "",
            data.keystrokes || 0,
            data.backspaceCount || 0,
            data.timeSeconds || 0,
            data.wpm || 0,
            data.efficiency || 0,
            JSON.stringify(data.intervals || []) // Store the micro-timing arrays as a JSON string
        ]);

        return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// Handle preflight OPTIONS request
function doOptions() {
    return ContentService.createTextOutput("")
        .setMimeType(ContentService.MimeType.TEXT);
}
