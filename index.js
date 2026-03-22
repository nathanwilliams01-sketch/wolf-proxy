const express = require('express');
const axios   = require('axios');
const app     = express();

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.all('/proxy', async (req, res) => {
  const target = req.query.url;
  if (!target) return res.status(400).json({ error: 'Missing url' });
  try {
    const response = await axios({
      method: req.method,
      url: target,
      data: req.method === 'POST' ? req.body : undefined,
      headers: { 'Content-Type': 'application/json' },
    });
    res.status(response.status).json(response.data);
  } catch(e) {
    const s = e.response?.status || 500;
    const d = e.response?.data  || { error: e.message };
    res.status(s).json(d);
  }
});

app.listen(process.env.PORT || 3000);
