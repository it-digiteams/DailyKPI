// tests/test-monthly.js
require('dotenv').config(); // Loads your .env credentials
const { runMonthlyEmail } = require('../controllers/email.js');

async function triggerMonthlyTest() {
    try {
        console.log("🚀 Starting manual Monthly KPI fetch...");
        await runMonthlyEmail();
        console.log("✅ Monthly Email generated and sent successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Test failed:", error);
        process.exit(1);
    }
}

triggerMonthlyTest();
