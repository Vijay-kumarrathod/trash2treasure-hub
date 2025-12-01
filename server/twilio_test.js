// twilio_test.js
// Simple standalone test to verify Twilio credentials and SMS sending.
// Usage (bash):
// TWILIO_ACCOUNT_SID="AC..." TWILIO_AUTH_TOKEN="..." TWILIO_FROM="+1..." TWILIO_TEST_TO="+91..." node twilio_test.js

const sid = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;
const from = process.env.TWILIO_FROM;
const to = process.env.TWILIO_TEST_TO; // set this env to one of team numbers
const text = 'Test SMS from Trash2Treasure at ' + new Date().toISOString();

if (!sid || !token || !from || !to) {
  console.error('Missing env vars. Need TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM, TWILIO_TEST_TO');
  process.exit(1);
}

(async () => {
  try {
    const twilio = require('twilio')(sid, token);
    const msg = await twilio.messages.create({ body: text, from, to });
    console.log('Twilio response:', { sid: msg.sid, status: msg.status, to: msg.to });
  } catch (e) {
    console.error('Twilio send error:', e);
    process.exit(2);
  }
})();
