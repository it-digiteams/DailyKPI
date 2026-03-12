const { sheets, drive } = require("../config/googleAuth.js");

// Function to re-shift rows based on a predefined order of names, keeping the TOTAL row last
function reShiftRowsBasedOnName(rangeData) {
    // 1. Updated master list to include Allian and use base names
    const nameOrder = ["Saad", "Umar", "Faraz", "Hassan",  "Fahad", "Bilal", "Talha"];

    // 2. Identify TOTAL row
    const totalRow = rangeData.find((row) => row[1] && row[1].toString().trim().toUpperCase() === "TOTAL");
    
    // 3. Filter and normalize names
    let otherRows = rangeData.filter((row) => {
        const nameInSheet = row[1] ? row[1].toString().trim() : "";
        return nameInSheet !== "" && nameInSheet.toUpperCase() !== "TOTAL";
    });

    // 4. Improved Matching Logic
    otherRows = otherRows.filter(row => {
        const nameInSheet = row[1].toString().trim().toLowerCase();
        // Check if ANY name in our master list is contained within the sheet name (or vice versa)
        return nameOrder.some(target => 
            nameInSheet.includes(target.toLowerCase()) || 
            target.toLowerCase().includes(nameInSheet)
        );
    });

    // 5. Sort based on the index in nameOrder
    otherRows.sort((a, b) => {
        const nameA = a[1].toString().trim().toLowerCase();
        const nameB = b[1].toString().trim().toLowerCase();
        
        const indexA = nameOrder.findIndex(n => nameA.includes(n.toLowerCase()));
        const indexB = nameOrder.findIndex(n => nameB.includes(n.toLowerCase()));
        
        return indexA - indexB;
    });

    // 6. Reattach Total
    if (totalRow) {
        otherRows.push(totalRow);
    }

    return otherRows;
}

function getPreviousMonthNumber() {
    const today = new Date();
    let previousMonth = today.getMonth(); // JavaScript months are 0-based
    return previousMonth === 0 ? 12 : previousMonth; // If Jan (0), return 12 for Dec
}

// INSIDE services/helpers.js

async function fetchMonthlyData(sheetId, sheetName) {
    try {
        // ✅ Corrected starting range: S18
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: `${sheetName}!U18:AC1000`, 
        });

        const data = response.data.values || [];
        const previousMonth = getPreviousMonthNumber(); 

        let monthRows = [];
        let footerRow = [];

        // Scan rows until TOTAL is found
        for (let i = 0; i < data.length; i++) {
            const row = data[i];

            // Collect rows for the previous month
            if (row[0] === String(previousMonth)) {
                monthRows.push(row);
            }

            // Stop when TOTAL appears *after* month rows
            if (row[1]?.toUpperCase() === "TOTAL" && monthRows.length > 0) {
                footerRow = row;
                break;
            }
        }

        // ✅ SECURITY: Enforce strict name order (Allian, Hassan, Saad, etc.)
        if (monthRows.length > 0) {
            monthRows = reShiftRowsBasedOnName(monthRows);
        }

        return {
            monthRows,
            footerRow,
        };
    } catch (error) {
        console.error("Error fetching previous month's data:", error.message);
        throw error;
    }
}

// ✅ FIX 1: Robust ISO Week Calculation (Standard ISO-8601)
function getISOWeekNumber(date) {
    const tempDate = new Date(date.getTime());
    // Set to nearest Thursday: current date + 4 - current day number (Monday is 1)
    tempDate.setUTCDate(tempDate.getUTCDate() + 4 - (tempDate.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
    // Calculate full weeks to nearest Thursday
    const weekNo = Math.ceil((((tempDate - yearStart) / 86400000) + 1) / 7);
    return weekNo;
}
// ✅ FIX 2: Corrected Row Math based on Actual Sheet Structure
// Sheet Analysis:
//   - Week 1 starts at Row 18 (J18)
//   - Week 7 starts at Row 96 (J96)  
//   - Week 8 starts at Row 109 (J109)
//   - Stride calculation: (96 - 18) / (7 - 1) = 13 rows per week
function getPreviousWeekRange() {
    const today = new Date();
    const currentWeek = getISOWeekNumber(today);
    
    // Calculate previous week (last week's report)
    let previousWeek = currentWeek - 1; 

    // Handle edge case: if it's Week 1, fetch Week 52 of previous year
    if (previousWeek < 1) previousWeek = 52;

    // CORRECTED MATH:
    // Base row: 18 (where Week 1 starts)
    // Stride: 13 rows between each week
    // Each week spans 13 rows total (all members + blanks + total)
    const startRow = 18 + (previousWeek - 1) * 13;
    const endRow = startRow + 12;  // 13 rows total per week section

    console.log(`\n╔════════ WEEKLY RANGE CALCULATOR ════════╗`);
    console.log(`║ 📅 Today: ${today.toDateString().padEnd(34)} ║`);
    console.log(`║ 🔢 Current ISO Week: ${String(currentWeek).padEnd(23)} ║`);
    console.log(`║ 🔙 Fetching Week: ${String(previousWeek).padEnd(27)} ║`);
    console.log(`║ 📍 Excel Range: K${startRow}:S${endRow}${' '.repeat(Math.max(0, 27 - (startRow + ':S' + endRow).length))} ║`);
    console.log(`╚═══════════════════════════════════════════╝\n`);

    return `K${startRow}:S${endRow}`;
}

// Fetch data for the previous week
async function fetchWeeklySheetData(sheetId, sheetName) {
    try {
        const range = getPreviousWeekRange();
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: `${sheetName}!${range}`,
        });

        // Extract values and filter out empty rows
        const data = response.data.values || [];
        console.log(`\n📊 Raw data fetched (${data.length} rows):`);
        data.forEach((row, idx) => {
            console.log(`  Row ${idx}: [${row.join(' | ')}]`);
        });

        let filteredData = data.filter(row => row[1]); // Ensure column J (index 1) is not empty
        console.log(`\n✅ After filtering empty rows: ${filteredData.length} rows remain`);

        // Check if the second row is a duplicate header and remove it
        if (filteredData.length > 1) {
            const firstRow = filteredData[0].map(cell => String(cell).trim().toLowerCase());
            const secondRow = filteredData[1].map(cell => String(cell).trim().toLowerCase());

            if (JSON.stringify(firstRow) === JSON.stringify(secondRow)) {
                console.log(`⚠️  Removing duplicate header row`);
                filteredData.splice(1, 1); // Remove the second row if it's a duplicate header
            }
        }

        console.log(`\n🔄 Before reShiftRowsBasedOnName: ${filteredData.length} rows`);
        const updatedData = reShiftRowsBasedOnName(filteredData);
        console.log(`\n✅ After reShiftRowsBasedOnName: ${updatedData.length} rows\n`);
        
        return updatedData;
    } catch (error) {
        console.error("Error fetching previous week's data:", error.message);
        throw error;
    }
}

// Function to fetch daily data from multiple ranges
async function fetchDailySheetData(sheetId, sheetName) {
    try {
        // Define the ranges to fetch
        const ranges = [
            `${sheetName}!A5:I15`,
            `${sheetName}!A18:I28`,
            `${sheetName}!A31:I41`,
        ];

        // Fetch all data in a single batch request
        const response = await sheets.spreadsheets.values.batchGet({
            spreadsheetId: sheetId,
            ranges: ranges,
        });

        // const yesterday = new Date(2025, 2, 9); // Months are zero-based (March = 2)
        // Get yesterday's date in "DD/MM/YYYY" format
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1); // Set to yesterday's date
        const day = String(yesterday.getDate()).padStart(2, "0"); // Ensure two digits
        const month = String(yesterday.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are 0-based
        const year = yesterday.getFullYear();
        const yesterdayFormatted = `${day}/${month}/${year}`; // e.g., "28/01/2024"

        // Loop through all ranges and check if the date matches yesterday's date
        for (let i = 0; i < response.data.valueRanges.length; i++) {
            const range = response.data.valueRanges[i];
            const rangeData = range.values;

            // Check if range has values and if it contains the message "No data for yesterday"
            if (rangeData && rangeData.length > 0) {
                // Check if the first cell in the range contains the "No data" message
                const firstCell = rangeData[0][0];
                if (
                    firstCell &&
                    (firstCell === "No data for yesterday" || firstCell === "No data")
                ) {
                    console.log(`Skipping range due to no data: ${ranges[i]}`);
                    continue; // Skip this range if it has "No data"
                }

                // Check if the first row of the range (Date) matches yesterday's date
                if (rangeData[0][0] === yesterdayFormatted) {
                    // If the date matches, re-shift the rows based on names and return the updated data
                    const updatedRangeData = reShiftRowsBasedOnName(rangeData);
                    return updatedRangeData;
                }
            }
        }

        // If no matching date is found, return "No data found for yesterday"
        return "No data found for yesterday";
    } catch (error) {
        console.error("Error fetching daily sheet data:", error.message);
        return "Error fetching data";
    }
}

module.exports = { reShiftRowsBasedOnName, fetchDailySheetData, fetchWeeklySheetData, fetchMonthlyData };