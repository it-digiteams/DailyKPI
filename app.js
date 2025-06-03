const express = require('express');
const cron = require('node-cron');
const ukdaRoutes = require("./routes/ukda.routes.js");
const { runDailyEmail, runWeeklyEmail, runMonthlyEmail } = require("./controllers/email.js");

const app = express();

app.use((req, res, next) => {
    const origin = req.get("Origin");
    if (
        origin &&
        (origin === "http://my.pandle.com" ||
            origin === "https://login.freeagent.com" ||
            origin === "http://192.168.1.201" ||
            origin === "*")
    ) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

app.use(express.json());
app.use("/UKDA", ukdaRoutes);

// ──────── CRON JOBS ────────
cron.schedule("0 3 * * *", async () => {
    console.log("Running dailyEmail");
    try {
        await runDailyEmail();
        console.log("Daily email sent via cron");
    } catch (err) {
        console.error("Daily email error:", err.message);
    }
});

cron.schedule("5 3 * * 1", async () => {
    console.log("Running weeklyEmail");
    try {
        await runWeeklyEmail();
        console.log("Weekly email sent via cron");
    } catch (err) {
        console.error("Weekly email error:", err.message);
    }
});

cron.schedule("10 3 1 * *", async () => {
    console.log("Running monthlyEmail");
    try {
        await runMonthlyEmail();
        console.log("Monthly email sent via cron");
    } catch (err) {
        console.error("Monthly email error:", err.message);
    }
});

app.listen(3003, () => {
    console.log("Server started on port 3003");
});
