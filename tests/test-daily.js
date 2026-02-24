// tests/test-daily.js
require('dotenv').config(); // Loads your .env credentials
const { runDailyEmail } = require('../controllers/email.js');

async function triggerDailyTest() {
    try {
        console.log("🚀 Starting manual Daily KPI fetch...");
        await runDailyEmail();
        console.log("✅ Daily Email generated and sent successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Test failed:", error);
        process.exit(1);
    }
}

triggerDailyTest();