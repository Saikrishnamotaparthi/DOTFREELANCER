import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, subject, html } = body;

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject, or html" },
        { status: 400 }
      );
    }

    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailPass) {
      console.warn("SMTP credentials not configured. Skipping email dispatch.");
      return NextResponse.json(
        { error: "SMTP credentials not configured" },
        { status: 500 }
      );
    }

    // Configure SMTP transport using Google App Passwords
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    const mailOptions = {
      from: `"dotentry Validation" <${gmailUser}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error("SMTP error sending email:", error);
    return NextResponse.json(
      { error: error.message || "Failed to dispatch email via SMTP" },
      { status: 500 }
    );
  }
}
