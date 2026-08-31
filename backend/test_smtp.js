require('dotenv').config({ path: __dirname + '/.env' });
const nodemailer = require('nodemailer');
const crypto = require('crypto');

async function sendTestOtp() {
    console.log("------------------------------------------");
    console.log("Starting SMTP Test for New Registration");
    console.log("------------------------------------------");
    console.log("Sender Account :", process.env.EMAIL_USER);
    console.log("Target Email   : babinbid05@gmail.com");
    console.log("Candidate Name : Babin Bid");
    console.log("Mobile Number  : 9123777679");
    console.log("District/State : Howrah, West Bengal");
    console.log("Location Mode  : Auto-Detect GPS (Lat/Lng)");
    console.log("------------------------------------------");

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const otp = crypto.randomInt(100000, 999999).toString();

    try {
        console.log("Connecting to smtp.gmail.com:587...");
        const info = await transporter.sendMail({
            from: `"SurakshaDrishti Auth" <${process.env.EMAIL_USER}>`,
            to: "babinbid05@gmail.com",
            subject: "SurakshaDrishti Portal - Account Verification OTP",
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #050914; color: #e2e8f0; padding: 24px; border-radius: 12px; max-width: 500px; margin: auto; border: 1px solid rgba(6, 182, 212, 0.3);">
                    <h2 style="color: #06b6d4; margin-top: 0; font-family: Cambria, Georgia, serif;">SurakshaDrishti Decision Support Portal</h2>
                    <p style="font-size: 15px; color: #94a3b8;">Hello <strong>Babin Bid</strong>,</p>
                    <p style="font-size: 14px; color: #cbd5e1;">Your test registration request from <strong>Howrah, West Bengal</strong> has been received.</p>
                    <div style="background-color: #08111f; border: 1px dashed #06b6d4; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
                        <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #06b6d4; display: block; margin-bottom: 6px;">Your 6-Digit OTP</span>
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #ffffff; font-family: monospace;">${otp}</span>
                    </div>
                    <p style="font-size: 12px; color: #64748b;">This OTP is valid for 5 minutes. If you did not initiate this request, please disregard this email.</p>
                    <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.08); margin: 20px 0;" />
                    <p style="font-size: 11px; color: #475569; text-align: center;">Smart India Hackathon 2026 • Ministry of Home Affairs • NDRF DM Division</p>
                </div>
            `
        });

        console.log("✅ Email sent successfully!");
        console.log("Message ID:", info.messageId);
        console.log("Generated OTP:", otp);
        console.log("------------------------------------------");
        return { success: true, messageId: info.messageId, otp };
    } catch (error) {
        console.error("❌ Failed to send email:", error.message);
        return { success: false, error: error.message };
    }
}

sendTestOtp();
