// debug-data.js
const { sheets } = require("./config/googleAuth.js");

// 1. Copy these EXACTLY from your controllers/email.js
require('dotenv').config();
const sheetId = process.env.GOOGLE_SPREADSHEET_ID;
const sheetName = "REPORT";

// 2. The Math we fixed
function getISOWeekNumber(date) {
    const tempDate = new Date(date.getTime());
    tempDate.setHours(0, 0, 0, 0);
    tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
    const firstThursday = new Date(tempDate.getFullYear(), 0, 4);
    const weekNumber = Math.ceil(((tempDate - firstThursday) / 86400000 + firstThursday.getDay() - 3) / 7);
    return weekNumber;
}

const today = new Date();
// Get ISO week. If today is Monday Feb 16, this should be Week 8.
const currentWeek = getISOWeekNumber(today); 
const previousWeek = currentWeek - 1; 

// 3. Calculate Range (Stride 13, Start 18)
const startRow = 18 + (previousWeek - 1) * 13;
const endRow = startRow + 11;
const range = `J${startRow}:Q${endRow}`;

async function debugFetch() {
    console.log("--- DEBUGGING INFO ---");
    console.log(`📅 Today's Date: ${today.toDateString()}`);
    console.log(`🔢 Calculated Current Week: ${currentWeek}`);
    console.log(`🔙 Target Previous Week: ${previousWeek}`);
    console.log(`🎯 Target Range: ${range}`);
    console.log(`📂 Sheet ID: ${sheetId}`);
    console.log(`📄 Tab Name: ${sheetName}`);
    console.log("----------------------");

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: `${sheetName}!${range}`,
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) {
            console.log("❌ NO DATA FOUND at this range.");
        } else {
            console.log("✅ DATA FOUND! Here are the raw rows:");
            rows.forEach((row, index) => {
                // Print Row Number and the Name (Column 2) and Billable (Column 3)
                const rowNum = startRow + index;
                const weekNum = row[0] || "Empty";
                const name = row[1] || "Empty";
                const billable = row[2] || "Empty";
                console.log(`Row ${rowNum}: [Week: ${weekNum}] [Name: ${name}] [Billable: ${billable}]`);
            });
        }
    } catch (error) {
        console.error("❌ ERROR FETCHING DATA:", error.message);
        console.log("👉 Check if your Sheet ID is correct.");
        console.log("👉 Check if the Tab Name 'REPORT' actually exists.");
    }
}

debugFetch();