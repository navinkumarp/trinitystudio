# EmailJS Setup Instructions for Trinity Studio Contact Form

The contact form is now configured to send emails to `bookings@trinitystudiochennai.com` using EmailJS. Follow these steps to complete the setup:

## 1. Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (allows 200 emails/month)
3. Verify your email address

## 2. Add Email Service

1. Go to **Email Services** in your EmailJS dashboard
2. Click **Add New Service**
3. Choose **Gmail** (recommended) or your preferred email provider
4. Connect your email account (the one that will send emails)
5. Note the **Service ID** (you'll need this)

## 3. Create Email Template

1. Go to **Email Templates**
2. Click **Create New Template**
3. Use this template:

```
Subject: New Booking Request - Trinity Studio

From: {{from_name}} <{{from_email}}>
Phone: {{phone}}
Booking Type: {{booking_type}}
Preferred Date: {{preferred_date}}

Message:
{{message}}

---
This booking request was submitted through the Trinity Studio website.
Reply to this email to respond directly to the customer.
```

4. Note the **Template ID**

## 4. Get Public Key

1. Go to **Account** → **General**
2. Copy your **Public Key**

## 5. Update Website Files

Replace the placeholder values in these files:

### In `contact.html` (line 249):
```javascript
publicKey: "YOUR_ACTUAL_PUBLIC_KEY_HERE"
```

### In `assets/js/script.js` (line 120):
```javascript
emailjs.send('YOUR_ACTUAL_SERVICE_ID', 'YOUR_ACTUAL_TEMPLATE_ID', templateParams)
```

## 6. Test the Contact Form

1. Submit a test booking through your website
2. Check if the email arrives at `bookings@trinitystudiochennai.com`
3. Verify all form data is included correctly

## 7. Optional: Custom Domain Setup

For better email deliverability, you can:
1. Set up a custom email domain
2. Configure SPF/DKIM records
3. Use a professional email service

## Troubleshooting

- **Emails not sending**: Check browser console for errors
- **Emails going to spam**: Set up proper email authentication
- **Rate limits**: Free plan allows 200 emails/month, upgrade if needed

## Security Note

Your EmailJS public key will be visible in the website code. This is normal and safe - the public key only allows sending emails, not accessing your account.