# Email Setup for Forgot Password Functionality

To enable the forgot password feature, you need to configure email settings in your `.env` file.

## Required Environment Variables

Add these variables to your `.env` file:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_NAME=LocalBites
FROM_EMAIL=noreply@localbites.com
FRONTEND_URL=http://localhost:5173
```

## Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password as `SMTP_PASSWORD`

## Other Email Providers

You can use other SMTP providers by changing the `SMTP_HOST` and `SMTP_PORT`:

- **Outlook/Hotmail**: `smtp-mail.outlook.com:587`
- **Yahoo**: `smtp.mail.yahoo.com:587`
- **Custom SMTP**: Use your provider's SMTP settings

## Testing

1. Start your backend server
2. Try the forgot password feature from the frontend
3. Check your email for the reset link
4. The reset link will expire in 10 minutes

## Security Notes

- Never commit your `.env` file to version control
- Use environment-specific email accounts for production
- Consider using email services like SendGrid or Mailgun for production 