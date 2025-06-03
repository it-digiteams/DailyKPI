const { fetchDailySheetData, fetchWeeklySheetData, fetchMonthlyData } = require("../services/helpers.js");
const { sendEmail } = require("../services/emailService.js");
const { generateHTMLRows, generateHTMLTemplate } = require("../services/htmlGen.js");

// Core logic functions (no req/res)
const runDailyEmail = async () => {
    const sheetId = "1I-xdqVGpAGU0hqlVSAyu1tUDVuMxMf0GX50wHmXXTEE";
    const sheetName = "REPORT";

    const data = await fetchDailySheetData(sheetId, sheetName);
    if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error("No data found in the specified range.");
    }

    const tableRows = data.slice(-11, -1);
    const footerRow = data.slice(-1)[0];

    const htmlTableRows = generateHTMLRows(tableRows, footerRow);
    const htmlContent = generateHTMLTemplate(htmlTableRows, "Timesheet Daily Update", "Date");

    return new Promise((resolve, reject) => {
        sendEmail("Daily", htmlContent, (error, info) => {
            if (error) return reject(error);
            resolve(info);
        });
    });
};

const runWeeklyEmail = async () => {
    const sheetId = "1I-xdqVGpAGU0hqlVSAyu1tUDVuMxMf0GX50wHmXXTEE";
    const sheetName = "REPORT";

    const data = await fetchWeeklySheetData(sheetId, sheetName);
    if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error("No data found in the specified range.");
    }

    const tableRows = data.slice(-11, -1);
    const footerRow = data.slice(-1)[0];

    const htmlTableRows = generateHTMLRows(tableRows, footerRow);
    const htmlContent = generateHTMLTemplate(htmlTableRows, "Timesheet Weekly Update", "Week");

    return new Promise((resolve, reject) => {
        sendEmail("Weekly", htmlContent, (error, info) => {
            if (error) return reject(error);
            resolve(info);
        });
    });
};

const runMonthlyEmail = async () => {
    const sheetId = "1I-xdqVGpAGU0hqlVSAyu1tUDVuMxMf0GX50wHmXXTEE";
    const sheetName = "REPORT";

    const { monthRows, footerRow } = await fetchMonthlyData(sheetId, sheetName);
    if (!monthRows || !Array.isArray(monthRows) || monthRows.length === 0) {
        throw new Error("No data found for the previous month.");
    }

    const htmlTableRows = generateHTMLRows(monthRows, footerRow);
    const htmlContent = generateHTMLTemplate(htmlTableRows, "Timesheet Monthly Update", "Month");

    return new Promise((resolve, reject) => {
        sendEmail("Monthly", htmlContent, (error, info) => {
            if (error) return reject(error);
            resolve(info);
        });
    });
};

// API handlers (still use req, res)
const dailyEmail = async (req, res) => {
    try {
        const info = await runDailyEmail();
        console.log("Email sent:", info.response);
        res.status(200).send("Daily email sent.");
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).send(err.message);
    }
};

const weeklyEmail = async (req, res) => {
    try {
        const info = await runWeeklyEmail();
        console.log("Email sent:", info.response);
        res.status(200).send("Weekly email sent.");
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).send(err.message);
    }
};

const monthlyEmail = async (req, res) => {
    try {
        const info = await runMonthlyEmail();
        console.log("Email sent:", info.response);
        res.status(200).send("Monthly email sent.");
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).send(err.message);
    }
};

module.exports = { dailyEmail, weeklyEmail, monthlyEmail, runDailyEmail,runWeeklyEmail, runMonthlyEmail };