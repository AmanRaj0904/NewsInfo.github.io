const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const app = express();
let port = 3000;

app.use(express.static(path.join(__dirname, 'public'), {
  index: 'index.html'
}));

app.get('/api/news', async (req, res) => {
  const apiKey = '24af8a1b989f4dc3a731b8e5768e0405';
  const query = req.query.q || 'India';
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${apiKey}`;

  console.log('Fetching from:', url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`News API error! Status: ${response.status}, Details: ${errorText}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ error: 'Failed to fetch news', details: error.message });
  }
});

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${port} in use, trying ${port + 1}...`);
    port++;
    server.listen(port);
  } else {
    console.error('Server startup error:', err);
  }
});