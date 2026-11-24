const express = require('express');
const path = require('path');

const trackVisitHandler = require('./api/track-visit');
const trackVisitEndHandler = require('./api/track-visit-end');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.text({ type: 'text/plain' }));

// API routes (migrated from Vercel serverless functions)
app.all('/api/track-visit', trackVisitHandler);
app.all('/api/track-visit-end', trackVisitEndHandler);

// Expose public Firebase web config from environment variables
app.get('/api/firebase-config', (req, res) => {
  res.json({
    apiKey: process.env.FIREBASE_API_KEY || '',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.FIREBASE_APP_ID || '',
  });
});

// Block access to server/config files before static serving
app.use((req, res, next) => {
  const blockedPrefixes = [
    '/server.js',
    '/package.json',
    '/package-lock.json',
    '/vercel.json',
    '/.env',
    '/api/',
    '/.git',
    '/.vscode',
  ];
  if (blockedPrefixes.some((prefix) => req.path.startsWith(prefix))) {
    return res.status(404).end();
  }
  next();
});

// Serve static site from project root
app.use(express.static(path.join(__dirname)));

// Fallback to index.html for root or unknown GET routes
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`ARCUS Editorial server listening on http://0.0.0.0:${PORT}`);
});
