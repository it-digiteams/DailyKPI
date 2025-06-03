const nodemailer = require("nodemailer");

const emailTransporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "it@digital-accountant.co.uk",
        pass: "seqb sxvs onkr sill",
    },
});

module.exports = {
    emailTransporter
};