# Email Confirmation Setup Guide

## Overview
This guide will help you configure email confirmation for user signups in your CampusConnect application using Supabase.

## Step 1: Configure SMTP in Supabase

### Option A: Use Supabase's Built-in Email Service (Development)
Supabase provides a basic email service for development. However, it has limitations:
- Limited to 3 emails per hour per project
- May end up in spam folders
- Not recommended for production

To use it:
1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Email Templates**
3. The default settings will use Supabase's email service
4. Test by signing up with a real email address

### Option B: Configure Custom SMTP (Recommended for Production)

#### Using Gmail SMTP
1. **Enable 2-Factor Authentication on your Gmail account**
2. **Generate an App Password:**
   - Go to https://myaccount.google.com/security
   - Under "Signing in to Google", enable 2-Step Verification
   - Go to https://myaccount.google.com/apppasswords
   - Generate a new app password for "Mail"
   - Save this password (you'll need it in the next step)

3. **Configure in Supabase:**
   - Go to **Project Settings** → **Authentication**
   - Scroll down to **SMTP Settings**
   - Enable custom SMTP
   - Fill in the following:
     ```
     Host: smtp.gmail.com
     Port: 587
     Username: your-email@gmail.com
     Password: [Your App Password from step 2]
     Sender email: your-email@gmail.com
     Sender name: CampusConnect
     ```
   - Click "Save"

#### Using SendGrid (Recommended for Production Scale)
1. **Create a SendGrid account** at https://sendgrid.com/
2. **Get your API Key:**
   - Go to Settings → API Keys
   - Create a new API key with "Mail Send" permissions
   - Copy the API key

3. **Configure in Supabase:**
   - Go to **Project Settings** → **Authentication**
   - Scroll down to **SMTP Settings**
   - Enable custom SMTP
   - Fill in the following:
     ```
     Host: smtp.sendgrid.net
     Port: 587
     Username: apikey
     Password: [Your SendGrid API Key]
     Sender email: noreply@yourdomain.com
     Sender name: CampusConnect
     ```
   - Click "Save"

#### Using Amazon SES
1. **Set up Amazon SES** in your AWS account
2. **Verify your domain or email**
3. **Get SMTP credentials** from the SES console
4. **Configure in Supabase:**
   ```
   Host: email-smtp.[region].amazonaws.com
   Port: 587
   Username: [Your SMTP Username]
   Password: [Your SMTP Password]
   Sender email: noreply@yourdomain.com
   Sender name: CampusConnect
   ```

## Step 2: Enable Email Confirmation

1. Go to **Authentication** → **Providers** → **Email**
2. Make sure **"Confirm email"** is **ENABLED**
3. Click "Save"

## Step 3: Customize Email Templates (Optional)

1. Go to **Authentication** → **Email Templates**
2. Select "Confirm signup"
3. Customize the email template with your branding
4. Available variables:
   - `{{ .ConfirmationURL }}` - The confirmation link
   - `{{ .SiteURL }}` - Your site URL
   - `{{ .Token }}` - The confirmation token

Example custom template:
```html
<h2>Welcome to CampusConnect!</h2>
<p>Thanks for signing up. Please confirm your email address by clicking the link below:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm Email</a></p>
<p>If you didn't sign up for CampusConnect, you can safely ignore this email.</p>
```

## Step 4: Test the Flow

1. Clear your browser cookies/cache
2. Try signing up with a real email address
3. Check your inbox (and spam folder)
4. Click the confirmation link
5. You should be redirected to the login page
6. Now you can log in

## Step 5: Handle Existing Unconfirmed Users

If you have users who signed up before enabling email confirmation:

### Option 1: Manually Confirm Them
1. Go to **Authentication** → **Users**
2. Find the user
3. Click on them
4. Check "Email Confirmed"
5. Save

### Option 2: Delete and Re-signup
1. Go to **Authentication** → **Users**
2. Delete the unconfirmed user
3. Have them sign up again

## Troubleshooting

### Emails Not Being Sent
- Check SMTP settings are correct
- Verify sender email is authenticated
- Check Supabase logs for errors
- Ensure port 587 or 465 is not blocked by firewall

### Emails Going to Spam
- Add SPF and DKIM records to your domain
- Use a verified domain (not Gmail)
- Use a professional email service (SendGrid, SES)

### Confirmation Link Not Working
- Check that `emailRedirectTo` is set correctly in signup code
- Verify your site URL in Supabase settings
- Check that the callback route exists: `/auth/callback`

### Rate Limiting
If using Supabase's built-in email:
- Limited to 3 emails per hour
- Upgrade to custom SMTP for higher limits

## Current Implementation Status

✅ Signup form now shows appropriate message based on confirmation status
✅ Users are redirected to login after email confirmation
✅ Clear instructions shown to users about checking their email
✅ Callback route properly configured

## Next Steps After Setup

1. Test the complete signup → confirm → login flow
2. Customize email templates with your branding
3. Set up a custom domain for professional emails
4. Monitor email delivery rates in your SMTP provider dashboard

## Support

If you need help:
- Check Supabase logs: **Project Settings** → **API** → **Logs**
- Review SMTP provider documentation
- Test with different email providers (Gmail, Outlook, etc.)

