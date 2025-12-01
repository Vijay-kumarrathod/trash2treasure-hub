const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// Folder for uploaded images
const uploadFolder = path.join(__dirname, "uploads");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Ensure folders exist
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder, { recursive: true });
const dataFolder = path.join(__dirname, "data");
const itemsFile = path.join(dataFolder, "items.json");
if (!fs.existsSync(dataFolder)) fs.mkdirSync(dataFolder, { recursive: true });
if (!fs.existsSync(itemsFile)) fs.writeFileSync(itemsFile, JSON.stringify([]));

function readItems() {
  try {
    const raw = fs.readFileSync(itemsFile, "utf8");
    return JSON.parse(raw || "[]");
  } catch (e) {
    return [];
  }
}

function writeItems(items) {
  fs.writeFileSync(itemsFile, JSON.stringify(items, null, 2));
}

// Notifications storage
const notificationsFile = path.join(dataFolder, "notifications.json");
if (!fs.existsSync(notificationsFile)) fs.writeFileSync(notificationsFile, JSON.stringify([]));

function readNotifications() {
  try {
    const raw = fs.readFileSync(notificationsFile, "utf8");
    return JSON.parse(raw || "[]");
  } catch (e) {
    return [];
  }
}

function writeNotifications(items) {
  fs.writeFileSync(notificationsFile, JSON.stringify(items, null, 2));
}

// Members to notify (phone numbers taken from Contact.tsx)
const MEMBERS = [
  { name: 'Vijaykumar', phone: '+916363325638' },
  { name: 'Chandan', phone: '+919686133711' },
  { name: 'Lekhana', phone: '+917019732659' },
  { name: 'Veenashree', phone: '+918217702676' },
];
let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  nodemailer = null;
}

async function notifyMembers(item) {
  const host = `http://localhost:5000`;
  const message = `New listing: ${item.title} - ₹${item.price} - ${host}/product/${item.id}`;

  // Try Twilio if configured
  const TW_SID = process.env.TWILIO_ACCOUNT_SID;
  const TW_AUTH = process.env.TWILIO_AUTH_TOKEN;
  const TW_FROM = process.env.TWILIO_FROM;

  const sent = [];

  console.log('notifyMembers: itemId=', item.id, 'TWILIO configured=', !!(TW_SID && TW_AUTH && TW_FROM));
  if (TW_SID && TW_AUTH && TW_FROM) {
    // Prefer Twilio SDK if available for better error handling
    let TwilioClient = null;
    try {
      const twilioLib = require('twilio');
      TwilioClient = twilioLib(TW_SID, TW_AUTH);
      console.log('notifyMembers: Twilio SDK loaded, using SDK for sends');
    } catch (e) {
      console.warn('notifyMembers: Twilio SDK not installed; falling back to HTTP API. Install `npm install twilio` for better support.');
    }

    for (const m of MEMBERS) {
      console.log('notifyMembers: sending to', m.phone);
      try {
        if (TwilioClient) {
          const resp = await TwilioClient.messages.create({ body: message, from: TW_FROM, to: m.phone });
          console.log('notifyMembers: Twilio SDK response for', m.phone, { sid: resp.sid, status: resp.status });
          sent.push({ to: m.phone, sid: resp.sid, status: resp.status });
        } else {
          // fallback to HTTP basic auth call
          const params = new URLSearchParams();
          params.append('To', m.phone);
          params.append('From', TW_FROM);
          params.append('Body', message);

          const resp = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TW_SID}/Messages.json`, {
            method: 'POST',
            headers: {
              Authorization: 'Basic ' + Buffer.from(`${TW_SID}:${TW_AUTH}`).toString('base64'),
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
          });

          console.log('notifyMembers: HTTP fallback response status', resp.status, 'for', m.phone);
          if (resp.ok) {
            const json = await resp.json();
            sent.push({ to: m.phone, sid: json.sid, status: json.status });
          } else {
            const text = await resp.text();
            console.error('notifyMembers: HTTP fallback error for', m.phone, text);
            sent.push({ to: m.phone, error: text, status: resp.status });
          }
        }
      } catch (e) {
        console.error('notifyMembers: SMS send error for', m.phone, e && e.stack ? e.stack : e);
        // try to extract Twilio error fields
        const errObj = {};
        if (e && e.code) errObj.code = e.code;
        if (e && e.message) errObj.message = e.message;
        sent.push({ to: m.phone, error: errObj });
      }
    }
  } else {
    // No Twilio: write to notifications.json as a simulation
    for (const m of MEMBERS) {
      sent.push({ to: m.phone, info: 'simulated' });
    }
  }

  // Send email notification if SMTP configured (or if NOTIFY_EMAILS provided)
  const SMTP_HOST = process.env.SMTP_HOST;
  const SMTP_PORT = process.env.SMTP_PORT;
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;
  const SMTP_FROM = process.env.SMTP_FROM || 'no-reply@trash2treasure.local';
  const notifyEmails = (process.env.NOTIFY_EMAILS || 'Vijaykumarrathod741@gmail.com').split(',').map(s => s.trim()).filter(Boolean);

  const emailResults = [];
  // Determine SMS failures: entries with an explicit error or status indicating failure
  const smsFailures = sent.filter(s => s && (s.error || (s.status && ['failed', 'undelivered'].includes(String(s.status).toLowerCase())))).length;

  if (nodemailer && SMTP_HOST && SMTP_USER && SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT) || 587,
        secure: false,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });

      const mailOptions = {
        from: SMTP_FROM,
        to: notifyEmails.join(','),
        subject: `New listing on Trash2Treasure: ${item.title}`,
        text: `${message}\n\nDescription:\n${item.description || ''}`,
      };

      const info = await transporter.sendMail(mailOptions);
      emailResults.push({ ok: true, info: info });
    } catch (e) {
      emailResults.push({ ok: false, error: String(e) });
    }
  } else if (notifyEmails.length) {
    // no SMTP configured: simulate email sends
    for (const em of notifyEmails) {
      emailResults.push({ to: em, info: 'simulated' });
    }
  }

  // If all SMS sends failed, send an urgent fallback email (or simulate) with details
  try {
    if (smsFailures >= MEMBERS.length) {
      const urgentSubject = `URGENT: SMS notification failed for listing ${item.title}`;
      const urgentBody = `All SMS notifications failed for item ${item.id}: ${item.title}\n\nMessage:\n${message}\n\nDetails:\n${JSON.stringify(sent, null, 2)}`;

      if (nodemailer && SMTP_HOST && SMTP_USER && SMTP_PASS) {
        try {
          const transporter2 = nodemailer.createTransport({ host: SMTP_HOST, port: Number(SMTP_PORT) || 587, secure: false, auth: { user: SMTP_USER, pass: SMTP_PASS } });
          const info2 = await transporter2.sendMail({ from: SMTP_FROM, to: notifyEmails.join(','), subject: urgentSubject, text: urgentBody });
          emailResults.push({ urgent: true, ok: true, info: info2 });
        } catch (e) {
          emailResults.push({ urgent: true, ok: false, error: String(e) });
        }
      } else if (notifyEmails.length) {
        for (const em of notifyEmails) {
          emailResults.push({ urgent: true, to: em, info: 'simulated' });
        }
      }
    }
  } catch (e) {
    console.error('Failed to send urgent fallback email', e);
    emailResults.push({ urgent: true, ok: false, error: String(e) });
  }

  // attach email results to sent results for persistence
  sent.push({ emailResults });

  // persist notification record
  try {
    const nots = readNotifications();
    nots.unshift({ createdAt: new Date().toISOString(), itemId: item.id, message, results: sent });
    writeNotifications(nots);
  } catch (e) {
    console.error('Failed to persist notification', e);
  }

  // console log for visibility
  console.log('Notification results for item', item.id, sent);
  return sent;
}

// Chat sessions storage
const sessionsFile = path.join(dataFolder, "chat_sessions.json");
if (!fs.existsSync(sessionsFile)) fs.writeFileSync(sessionsFile, JSON.stringify({}));

function readChatSessions() {
  try {
    const raw = fs.readFileSync(sessionsFile, "utf8");
    return JSON.parse(raw || "{}");
  } catch (e) {
    return {};
  }
}

function writeChatSessions(sessions) {
  fs.writeFileSync(sessionsFile, JSON.stringify(sessions, null, 2));
}

// Upload route: accept multiple images under field `images` and metadata fields
app.post("/upload", upload.array("images", 5), (req, res) => {
  try {
    const files = req.files || (req.file ? [req.file] : []);
    const images = files.map((f) => `/uploads/${f.filename}`);

    const { title = "Untitled", description = "", price = "", category = "", condition = "", location = "", sellerName = "", sellerContact = "" } = req.body || {};

    const items = readItems();
    const newItem = {
      id: Date.now().toString(),
      title,
      description,
      price,
      category,
      condition,
      location,
      sellerName,
      sellerContact,
      images,
      createdAt: new Date().toISOString(),
    };

    items.unshift(newItem);
    writeItems(items);

    // notify members about new item (best-effort, async)
    notifyMembers(newItem).catch((e) => console.error('notifyMembers error', e));

    // return full URLs for convenience
    const host = req.headers.host || `localhost:5000`;
    const base = req.protocol ? `${req.protocol}://${host}` : `http://${host}`;
    newItem.images = newItem.images.map((p) => `${base}${p}`);

    res.status(201).json({ success: true, item: newItem });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

// Serve uploaded images

app.use("/uploads", express.static(uploadFolder));

// GET items
app.get("/items", (req, res) => {
  try {
    const items = readItems();
    // ensure image URLs are absolute
    const host = req.headers.host || `localhost:5000`;
    const base = req.protocol ? `${req.protocol}://${host}` : `http://${host}`;
    const out = items.map((it) => ({ ...it, images: (it.images || []).map((p) => (p.startsWith("http") ? p : `${base}${p}`)) }));
    res.json({ items: out });
  } catch (err) {
    console.error("Get items error:", err);
    res.status(500).json({ items: [] });
  }
});

// Chat API - proxies to OpenAI if OPENAI_API_KEY present, otherwise returns canned reply
app.post("/api/chat", async (req, res) => {
  try {
    const { messages = [], userId } = req.body || {};

    // If an OpenAI API key is configured, proxy the conversation
    const key = process.env.OPENAI_API_KEY;
    if (key) {
      const outgoing = {
        model: "gpt-3.5-turbo",
        messages: Array.isArray(messages) ? messages : [],
        max_tokens: 512,
      };

      const fetchRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify(outgoing),
      });

      if (!fetchRes.ok) {
        const text = await fetchRes.text();
        console.error("OpenAI error:", text);
        return res.status(502).json({ reply: "Sorry, the AI service is unavailable right now." });
      }

      const data = await fetchRes.json();
      const reply = data?.choices?.[0]?.message?.content || "";
      // persist session if userId provided
      if (userId) {
        try {
          const sessions = readChatSessions();
          sessions[userId] = (messages || []).map((m) => ({ role: m.role || m.sender || 'user', content: m.content || m.text || '' }));
          // append assistant reply as well
          sessions[userId].push({ role: 'assistant', content: reply });
          writeChatSessions(sessions);
        } catch (e) {}
      }
      return res.json({ reply });
    }

    // No API key: return a helpful canned response including owner contact
    const canned = `Thank you for your message. Our support team will assist you shortly. For immediate help call +91 6363325638 or email Vijaykumarrathod741@gmail.com`;
    // persist canned reply into session if requested
    if (userId) {
      try {
        const sessions = readChatSessions();
        sessions[userId] = (messages || []).map((m) => ({ role: m.role || m.sender || 'user', content: m.content || m.text || '' }));
        sessions[userId].push({ role: 'assistant', content: canned });
        writeChatSessions(sessions);
      } catch (e) {}
    }
    return res.json({ reply: canned });
  } catch (err) {
    console.error("Chat API error:", err);
    res.status(500).json({ reply: "Internal error handling chat" });
  }
});

// Session endpoints: get or save a conversation session
app.get('/api/chat/session/:id', (req, res) => {
  try {
    const id = req.params.id;
    const sessions = readChatSessions();
    const sess = sessions[id] || [];
    res.json({ messages: sess });
  } catch (e) {
    res.status(500).json({ messages: [] });
  }
});

app.post('/api/chat/session', (req, res) => {
  try {
    const { sessionId, messages = [] } = req.body || {};
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
    const sessions = readChatSessions();
    sessions[sessionId] = messages.map((m) => ({ role: m.role || m.sender || 'user', content: m.content || m.text || '' }));
    writeChatSessions(sessions);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false });
  }
});

// Associate an anonymous sessionId with a userId (merge and remove anonymous)
app.post('/api/chat/session-associate', (req, res) => {
  try {
    const { sessionId, userId } = req.body || {};
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const sessions = readChatSessions();

    // Ensure target user session exists
    sessions[userId] = sessions[userId] || [];

    if (sessionId && sessions[sessionId]) {
      // merge anonymous into user session
      sessions[userId] = [...sessions[sessionId], ...sessions[userId]];
      // remove anonymous session
      delete sessions[sessionId];
      writeChatSessions(sessions);
      return res.json({ success: true });
    }

    // nothing to merge, ensure write
    writeChatSessions(sessions);
    res.json({ success: true });
  } catch (e) {
    console.error('session-associate error', e);
    res.status(500).json({ success: false });
  }
});

// Return stored notifications (most recent first)
app.get('/notifications', (req, res) => {
  try {
    const nots = readNotifications();
    res.json({ notifications: nots });
  } catch (e) {
    res.status(500).json({ notifications: [] });
  }
});

// One-off SMS send for testing: POST { to, body }
app.post('/send-sms', async (req, res) => {
  const { to, body: smsBody } = req.body || {};
  if (!to || !smsBody) return res.status(400).json({ error: 'missing "to" or "body" in request' });

  console.log('send-sms: request to=', to, 'body-preview=', smsBody.slice(0, 120));

  const TW_SID = process.env.TWILIO_ACCOUNT_SID;
  const TW_AUTH = process.env.TWILIO_AUTH_TOKEN;
  const TW_FROM = process.env.TWILIO_FROM;

  if (!(TW_SID && TW_AUTH && TW_FROM)) {
    console.error('send-sms: Twilio not configured. Missing TWILIO env vars.');
    return res.status(500).json({ error: 'Twilio not configured on server' });
  }

  try {
    let TwilioClient = null;
    try {
      const twilioLib = require('twilio');
      TwilioClient = twilioLib(TW_SID, TW_AUTH);
      console.log('send-sms: Twilio SDK loaded');
    } catch (e) {
      console.warn('send-sms: Twilio SDK not installed; will try HTTP fallback. Install with `npm install twilio`.');
    }

    if (TwilioClient) {
      const resp = await TwilioClient.messages.create({ to, from: TW_FROM, body: smsBody });
      console.log('send-sms: SDK resp', { sid: resp.sid, status: resp.status });
      return res.json({ ok: true, sid: resp.sid, status: resp.status });
    }

    // HTTP fallback
    const params = new URLSearchParams();
    params.append('To', to);
    params.append('From', TW_FROM);
    params.append('Body', smsBody);

    const resp = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TW_SID}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${TW_SID}:${TW_AUTH}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const text = await resp.text();
    if (!resp.ok) {
      console.error('send-sms: HTTP fallback error', resp.status, text);
      return res.status(resp.status).json({ error: text });
    }

    const json = JSON.parse(text);
    console.log('send-sms: HTTP fallback resp', json.sid, json.status);
    return res.json({ ok: true, sid: json.sid, status: json.status });
  } catch (e) {
    console.error('send-sms: unexpected error', e && e.stack ? e.stack : e);
    return res.status(500).json({ error: String(e) });
  }
});

// Test endpoint: trigger notifications for an existing item id
app.post('/notify/item/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const items = readItems();
    const item = items.find((it) => String(it.id) === String(id));
    if (!item) return res.status(404).json({ error: 'item not found' });
    const results = await notifyMembers(item);
    res.json({ success: true, results });
  } catch (e) {
    console.error('notify test error', e);
    res.status(500).json({ success: false, error: String(e) });
  }
});

// Admin UI: simple page to view recent notifications and download JSON
app.get('/admin/notifications', (req, res) => {
  const html = `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Notifications - Admin</title>
      <style>body{font-family:Arial,Helvetica,sans-serif;padding:20px}button{margin:6px}pre{background:#f6f8fa;padding:10px;border-radius:6px;overflow:auto}</style>
    </head>
    <body>
      <h1>Notifications (most recent first)</h1>
      <div>
        <button id="refresh">Refresh</button>
        <a id="download" href="/admin/notifications/download">Download JSON</a>
      </div>
      <div id="list">Loading...</div>
      <script>
        async function load(){
          document.getElementById('list').textContent = 'Loading...';
          try{
            const r = await fetch('/notifications');
            const j = await r.json();
            const nots = j.notifications || [];
            if(!nots.length){ document.getElementById('list').innerHTML = '<p>No notifications yet</p>'; return }
            const container = document.createElement('div');
            nots.forEach(n => {
              const el = document.createElement('div');
              el.style.border = '1px solid #ddd';
              el.style.padding = '10px';
              el.style.margin = '8px 0';
              const h = document.createElement('div'); h.innerHTML = '<strong>'+ (n.itemId || '') +'</strong> — '+ (n.createdAt || '');
              const p = document.createElement('pre'); p.textContent = JSON.stringify(n, null, 2);
              el.appendChild(h); el.appendChild(p); container.appendChild(el);
            });
            const list = document.getElementById('list'); list.innerHTML=''; list.appendChild(container);
          }catch(e){ document.getElementById('list').textContent = 'Failed to load: '+ String(e) }
        }
        document.getElementById('refresh').addEventListener('click', load);
        load();
      </script>
    </body>
  </html>`;
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// Download raw notifications JSON
app.get('/admin/notifications/download', (req, res) => {
  try{
    const nots = readNotifications();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="notifications.json"');
    res.send(JSON.stringify(nots, null, 2));
  }catch(e){
    res.status(500).json({ error: 'failed to read notifications' });
  }
});

// DELETE item
app.delete("/items/:id", (req, res) => {
  try {
    const id = req.params.id;
    let items = readItems();
    const item = items.find((it) => String(it.id) === String(id));
    if (!item) return res.status(404).json({ success: false, error: "Not found" });

    // No protection: allow deletion without seller verification (development mode)

    // remove image files (best-effort)
    (item.images || []).forEach((img) => {
      try {
        const parsed = new URL(img, `http://localhost`);
        const filePath = path.join(__dirname, parsed.pathname);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (e) {
        // ignore
      }
    });

    items = items.filter((it) => String(it.id) !== String(id));
    writeItems(items);
    res.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
//////


// serve production build
const clientDist = path.join(__dirname, '..', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}