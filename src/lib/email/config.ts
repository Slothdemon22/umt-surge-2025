// Resend Email Service Configuration
import { Resend } from 'resend';

export const RESEND_API_KEY = process.env.RESEND_API_KEY!
export const SENDER_EMAIL = 'onboarding@zalnex.me' // Your verified Resend sender email

// Email configuration
export const EMAIL_CONFIG = {
  appName: 'CampusConnect',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  supportEmail: 'support@zalnex.me',
}

export const isEmailEnabled = (): boolean => {
  return !!RESEND_API_KEY;
}

export const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

if (!RESEND_API_KEY) {
  console.warn('⚠️ RESEND_API_KEY is not set in environment variables. Email service will not function.')
}
