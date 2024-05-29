const nodemailer = require('nodemailer')
require('dotenv').config();

module.exports.verifyEmail = (mail, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: process.env.MAIL,
                pass: process.env.MAIL_KEY
            }
        });

        const mailOptions = {
            from: 'echosphere@gmail.com',
            to: mail,
            subject: 'OTP Verification',
            text: `Your OTP for verification is: ${otp}. Please enter this OTP to verify your email.`
        };


        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: 'Failed to send email', error });
            } else {
                return res.status(200).json({ message: 'Verification email sent' });
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}


