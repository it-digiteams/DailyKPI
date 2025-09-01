const nodemailer = require("nodemailer");

const emailTransporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "it@digital-accountant.co.uk",
        pass: "rklp pzsc mqgk heih",
    },
    tls: {
        rejectUnauthorized: false, // sometimes needed on VPS with self-signed certs
    },
});

module.exports = {
    emailTransporter
};
