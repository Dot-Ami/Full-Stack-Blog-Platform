import { Resend } from "resend";

// Initialize Resend client
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Email sender configuration
const FROM_EMAIL = process.env.EMAIL_FROM || "Blogify <noreply@resend.dev>";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email using Resend
 */
export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  if (!resend) {
    console.warn("Resend not configured. Email not sent:", { to, subject });
    // In development, log the email content
    if (process.env.NODE_ENV === "development") {
      console.log("Email content:", { to, subject, html });
    }
    return { success: false, error: "Email service not configured" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      text,
    });

    if (error) {
      console.error("Failed to send email:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email send error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #334155; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Reset Your Password</h1>
        </div>
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="margin-bottom: 20px;">Hi there,</p>
          <p style="margin-bottom: 20px;">You requested to reset your password for your Blogify account. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 600;">Reset Password</a>
          </div>
          <p style="margin-bottom: 10px; color: #64748b; font-size: 14px;">This link will expire in 1 hour for security reasons.</p>
          <p style="margin-bottom: 20px; color: #64748b; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">
            Can't click the button? Copy and paste this URL into your browser:<br>
            <a href="${resetUrl}" style="color: #6366f1;">${resetUrl}</a>
          </p>
        </div>
      </body>
    </html>
  `;

  const text = `
Reset Your Password

Hi there,

You requested to reset your password for your Blogify account. Visit the link below to create a new password:

${resetUrl}

This link will expire in 1 hour for security reasons.

If you didn't request this, you can safely ignore this email.
  `;

  return sendEmail({
    to: email,
    subject: "Reset Your Password - Blogify",
    html,
    text,
  });
}

/**
 * Send email verification email
 */
export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #334155; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to Blogify! 🎉</h1>
        </div>
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="margin-bottom: 20px;">Hi there,</p>
          <p style="margin-bottom: 20px;">Thanks for signing up! Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 600;">Verify Email</a>
          </div>
          <p style="margin-bottom: 10px; color: #64748b; font-size: 14px;">This link will expire in 24 hours.</p>
          <p style="margin-bottom: 20px; color: #64748b; font-size: 14px;">If you didn't create an account, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">
            Can't click the button? Copy and paste this URL into your browser:<br>
            <a href="${verifyUrl}" style="color: #6366f1;">${verifyUrl}</a>
          </p>
        </div>
      </body>
    </html>
  `;

  const text = `
Welcome to Blogify! 🎉

Hi there,

Thanks for signing up! Please verify your email address by visiting the link below:

${verifyUrl}

This link will expire in 24 hours.

If you didn't create an account, you can safely ignore this email.
  `;

  return sendEmail({
    to: email,
    subject: "Verify Your Email - Blogify",
    html,
    text,
  });
}
