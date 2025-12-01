# Server README

This folder contains a minimal Express server that the front-end uses for storing items and sending notifications.

Local Development Guide
1. Install dependencies
```bash
cd server
npm install
```
2. Create an environment file for SMTP testing
```bash
cp .env.example .env
# Edit .env and fill values for Mailtrap or Gmail
```
3. Start server for development with nodemon (auto-reload)
```bash
npm run dev
```
4. Start server production mode
```bash
npm start
```

Mailtrap Test Setup
1. Create a Mailtrap account (https://mailtrap.io/), find your SMTP credentials.
2. Set the `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER` and `SMTP_PASS` environment variables (see `.env.example`).
3. Set `NOTIFY_EMAILS` to the email(s) that should receive notifications.
4. When the server is started with SMTP enabled, notifications will be sent via nodemailer.

Admin Notification Viewer
Visit `/admin/notifications` to view saved contact messages and their `emailResults`.
