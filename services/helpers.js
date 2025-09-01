const { sheets, drive } = require("../config/googleAuth.js");

// Function to re-shift rows based on a predefined order of names, keeping the TOTAL row last
function reShiftRowsBasedOnName(rangeData) {
    const nameOrder = ["Saad", "Umar", "Faraz Ali", "Aitzaz", "Fahad", "Bilal", "Shariq", "Talha Ali", "Sami Ullah", "Usama"];

    // Separate the TOTAL row and other rows
    const totalRow = rangeData.find((row) => row[1] === "TOTAL");
    let otherRows = rangeData.filter((row) => row[1] !== "TOTAL");

    // Remove rows with names not in nameOrder
    otherRows = otherRows.filter(row => nameOrder.includes(row[1]));

    // Sort the remaining rows based on nameOrder
    otherRows.sort((a, b) => nameOrder.indexOf(a[1]) - nameOrder.indexOf(b[1]));

    // Reattach the TOTAL row at the end of the sorted data
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

async function fetchMonthlyData(sheetId, sheetName) {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: `${sheetName}!R22:X1000`, // start where your report actually begins
        });

        const data = response.data.values || [];
        const previousMonth = getPreviousMonthNumber();

        const monthRows = [];
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

        return {
            monthRows,
            footerRow,
        };
    } catch (error) {
        console.error("Error fetching previous month's data:", error.message);
        throw error;
    }
}

// Function to get the ISO week number (ISO-8601 standard)
function getISOWeekNumber(date) {
    const tempDate = new Date(date.getTime());
    tempDate.setHours(0, 0, 0, 0);
    tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7)); // Align with Thursday
    const firstThursday = new Date(tempDate.getFullYear(), 0, 4);
    const weekNumber = Math.ceil(((tempDate - firstThursday) / 86400000 + firstThursday.getDay() - 3) / 7);
    return weekNumber;
}

// Function to determine the previous week's row range
function getPreviousWeekRange() {
    const today = new Date();
    let previousWeek = getISOWeekNumber(today) - 1; // Get last week's ISO number

    // Handle edge case: If the previous week is < 1, set it to week 53
    if (previousWeek < 1) previousWeek = 53;

    let startRow, endRow;

    if (previousWeek === 1) {
        startRow = 22;
        endRow = 32;
    } else if (previousWeek === 2) {
        startRow = 35;
        endRow = 45;
    } else {
        startRow = 48 + (previousWeek - 3) * 14;
        endRow = 58 + (previousWeek - 3) * 14;
    }

    return `I${startRow}:O${endRow}`;
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
        let filteredData = data.filter(row => row[1]); // Ensure column J (index 1) is not empty

        // Check if the second row is a duplicate header and remove it
        if (filteredData.length > 1) {
            const firstRow = filteredData[0].map(cell => cell.trim().toLowerCase());
            const secondRow = filteredData[1].map(cell => cell.trim().toLowerCase());

            if (JSON.stringify(firstRow) === JSON.stringify(secondRow)) {
                filteredData.splice(1, 1); // Remove the second row if it's a duplicate header
            }
        }

        const updatedData = reShiftRowsBasedOnName(filteredData);
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
            `${sheetName}!A6:G16`,
            `${sheetName}!A19:G29`,
            `${sheetName}!A32:G42`,
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