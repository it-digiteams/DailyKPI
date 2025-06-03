const nodemailer = require("nodemailer");

const emailTransporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "",
        pass: "",
    },
});

module.exports = {
    emailTransporter
};
