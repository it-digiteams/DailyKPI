const { emailTransporter } = require("../config/email.js");

function sendEmail(timeText, htmlContent, callback) {
    const mailToJanis = setMailOption(
        "info@digital-accountant.co.uk",
        htmlContent,
        timeText
    );
    emailTransporter.sendMail(mailToJanis, callback);

    const mailToIT = setMailOption(
        "it@digital-accountant.co.uk",
        htmlContent,
        timeText
    );
    emailTransporter.sendMail(mailToIT, callback);
}

// Send email using Nodemailer
function setMailOption(receiver, htmlContent, timeText) {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
    }); // Format: DD/MM/YY
    const mailOptions = {
        from: "info@digital-accountant.uk",
        to: receiver,
        subject: `${timeText} Summary - ${formattedDate}`,
        html: htmlContent,
    };
    return mailOptions;
}

module.exports = { sendEmail };