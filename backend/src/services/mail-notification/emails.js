import nodemailer from "nodemailer";
import dotenv from "dotenv";

import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from "./emailTemplates.js";

dotenv.config();

export const sendVerificationEmail = async (email, verificationToken) => {
  if (!email || !verificationToken) {
    throw new Error("Email and verification token are required");
  }
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.BREVO_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_USERNAME,
        pass: process.env.BREVO_PASSWORD,
      },
    });

    transporter.sendMail({
      // from: `787adhikariroshan@gmail.com`,
      from: `"RippleHub" <787adhikariroshan@gmail.com>`,
      to: email,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });
    console.log("Verification email sent successfully");
  } catch (error) {
    console.log(`Error sending verification email`, error);
    throw new Error(`Error sending verification email: ${error}`);
  }

};

export const sendWelcomeEmail = async (email, firstName) => {
  if (!email || !firstName) {
    throw new Error("Email and Name are required");
  }
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.BREVO_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_USERNAME,
        pass: process.env.BREVO_PASSWORD,
      },
    });

    transporter.sendMail({
      // from: `787adhikariroshan@gmail.com`,
      from: `"RippleHub" <787adhikariroshan@gmail.com>`,
      to: email,
      subject: "Welcome on board - RippleHub",
      html: WELCOME_EMAIL_TEMPLATE.replace("{name}", firstName),
      category: "Welcome Email",
    });
  } catch (error) {
    console.log(`Error sending welcome email`, error);
    throw new Error(`Error sending welcome email:${error}`);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  if (!email || !resetURL) {
    throw new Error("Email and reset URL are not found");
  }
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.BREVO_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_USERNAME,
        pass: process.env.BREVO_PASSWORD,
      },
    });

    transporter.sendMail({
      // from: `787adhikariroshan@gmail.com`,
      from: `"RippleHub" <787adhikariroshan@gmail.com>`,
      to: email,
      subject: "Password Reset Request - RippleHub",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });
  } catch (error) {
    console.log(`Error sending password reset email`, error);
    throw new Error(`Error sending password reset email: ${error}`);
  }
};

export const sendResetSuccessEmail = async (email) => {
  if (!email) {
    throw new Error("Email not found");
  }
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.BREVO_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_USERNAME,
        pass: process.env.BREVO_PASSWORD,
      },
    });

    transporter.sendMail({
      // from: `787adhikariroshan@gmail.com`,
      from: `"RippleHub" <787adhikariroshan@gmail.com>`,
      to: email,
      subject: "Password Reset Successful - RippleHub",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset Success",
    });
  } catch (error) {
    console.log(`Error sending password reset success email`, error);
    throw new Error(`Error sending password reset success email: ${error}`);
  }
};