require("dotenv").config(); // Load environment variables
const { google } = require("googleapis");

// Retrieve credentials from environment variables
const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
const privateKey = process.env.GOOGLE_PRIVATE_KEY
    ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n") // Fix newlines for JWT
    : undefined;

// Validate that keys exist
if (!clientEmail || !privateKey) {
    console.error("❌ CRITICAL ERROR: Google Credentials missing from .env file.");
    process.exit(1);
}

const auth = new google.auth.JWT(
    clientEmail,
    null,
    privateKey,
    [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/spreadsheets",
    ]
);

module.exports = {
    drive: google.drive({ version: "v3", auth }),
    sheets: google.sheets({ version: "v4", auth }),
};