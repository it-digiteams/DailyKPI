const { runWeeklyEmail } = require('../controllers/email');

console.log("⏳ Triggering Weekly Email manually...");

runWeeklyEmail()
    .then(() => {
        console.log("✅ Email sent! Check your inbox.");
    })
    .catch((err) => {
        console.error("❌ Error:", err);
    });