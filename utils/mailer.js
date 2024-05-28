import nodemailer from 'nodemailer';
import { SMTP_CONFIG } from '../config.js';

const transporter = nodemailer.createTransport(SMTP_CONFIG);

export const sendEmail = async (to, subject, text, html) => {
    const mailOptions = {
        from: SMTP_CONFIG.auth.user,
        to,
        subject,
        text,
        html,
    };

    await transporter.sendMail(mailOptions);
};
