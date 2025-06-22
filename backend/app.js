const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const API_KEY = 'iDjg7hm1AzslFja7bboe8gtO4xGhHdsUIFXwSJec';

// === Helper ===
const isValidDate = (date) => {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(new Date(date).getTime());
};

// === APOD Route ===
app.get('/api/apod', async (req, res) => {
  const { date } = req.query;

  if (date && !isValidDate(date)) {
    return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
  }

  const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}${date ? `&date=${date}` : ''}`;

  try {
    const { data } = await axios.get(url);
    res.json(data);
  } catch (err) {
    console.error('Error fetching APOD:', err.message);
    res.status(err.response?.status || 500).json({ error: 'Failed to fetch APOD' });
  }
});

// === Mars Rover Photos Route ===
app.get('/api/mars', async (req, res) => {
  const { sol = '1000' } = req.query;

  if (!/^\d+$/.test(sol)) {
    return res.status(400).json({ error: 'Invalid sol parameter. It must be a positive integer.' });
  }

  const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${sol}&api_key=${API_KEY}`;

  try {
    const { data } = await axios.get(url);
    res.json(data);
  } catch (err) {
    console.error('Error fetching Mars photos:', err.message);
    res.status(err.response?.status || 500).json({ error: 'Failed to fetch Mars photos' });
  }
});

// === Asteroids Data Route ===
app.get('/api/asteroids', async (req, res) => {
  const today = new Date();
  const start_date = req.query.start_date || new Date(today.getTime() - 6 * 86400000).toISOString().slice(0, 10);
  const end_date = req.query.end_date || today.toISOString().slice(0, 10);

  if (!isValidDate(start_date) || !isValidDate(end_date)) {
    return res.status(400).json({ error: 'Invalid start_date or end_date format. Use YYYY-MM-DD.' });
  }

  if (new Date(start_date) > new Date(end_date)) {
    return res.status(400).json({ error: 'start_date cannot be after end_date' });
  }

  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start_date}&end_date=${end_date}&api_key=${API_KEY}`;

  try {
    const { data } = await axios.get(url);
    res.json(data);
  } catch (err) {
    console.error('Error fetching asteroid data:', err.message);
    res.status(err.response?.status || 500).json({ error: 'Failed to fetch asteroid data' });
  }
});

// === Image Proxy Route ===
app.get('/api/image-proxy', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    const response = await axios.get(url, { responseType: 'stream' });
    res.setHeader('Content-Type', response.headers['content-type']);
    res.setHeader('Content-Disposition', 'attachment; filename=image.jpg');
    response.data.pipe(res);
  } catch (err) {
    console.error('Proxy error:', err.message);
    res.status(err.response?.status || 500).json({ error: 'Error fetching image' });
  }
});

// === NASA Media Search Route ===
// NOTE: Updated route to /api/nasamedia to match test expectations
app.get('/api/nasa-media', async (req, res) => {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
  
    const baseUrl = process.env.NASA_API_URL || 'https://images-api.nasa.gov/search';
    const url = `${baseUrl}?q=${encodeURIComponent(query)}`;
  
    try {
      const response = await axios.get(url);
      res.json(response.data);
    } catch (err) {
      console.error('Failed to fetch NASA media:', err.message);
      res.status(500).json({ error: 'Failed to fetch NASA media' });
    }
  });

  
app.get('/api/neows', async (req, res) => {
    const today = new Date();
    const maxRangeDays = 7;
  
    let { start_date, end_date } = req.query;
  
    // Default to last 7 days ending today if not provided
    if (!end_date) {
      end_date = today.toISOString().split('T')[0];
    }
  
    if (!start_date) {
      const pastDate = new Date(today.getTime() - maxRangeDays * 86400000);
      start_date = pastDate.toISOString().split('T')[0];
    }
  
    // Validate date format and range
    if (!isValidDate(start_date) || !isValidDate(end_date)) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
    }
  
    if (new Date(start_date) > new Date(end_date)) {
      return res.status(400).json({ error: 'start_date cannot be after end_date.' });
    }
  
    if (new Date(end_date) > today) {
      return res.status(400).json({ error: 'end_date cannot be in the future.' });
    }
  
    const diffDays = (new Date(end_date) - new Date(start_date)) / 86400000;
    if (diffDays > maxRangeDays) {
      return res.status(400).json({ error: `Date range cannot exceed ${maxRangeDays} days.` });
    }
  
    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start_date}&end_date=${end_date}&api_key=${API_KEY}`;
  
    try {
      const { data } = await axios.get(url);
      res.json(data);
    } catch (err) {
      console.error('Error fetching NeoWs:', err.message, err.response?.data);
      res.status(err.response?.status || 500).json({ error: 'Failed to fetch Near Earth Object data' });
    }
  });
  

// === EPIC Route ===
app.get('/api/epic', async (req, res) => {
  // Optionally accept a date query param to filter EPIC images
  const { date } = req.query;

  if (date && !isValidDate(date)) {
    return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
  }

  // EPIC API URL changes if date is provided
  const url = date
    ? `https://api.nasa.gov/EPIC/api/natural/date/${date}?api_key=${API_KEY}`
    : `https://api.nasa.gov/EPIC/api/natural?api_key=${API_KEY}`;

  try {
    const { data } = await axios.get(url);
    res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching EPIC data:', err.message);
    // Return 400 if bad request (e.g. invalid date), otherwise 500
    const status = err.response?.status;
    if (status === 400 || status === 404) {
      res.status(400).json({ error: 'Invalid or not found EPIC date' });
    } else {
      res.status(500).json({ error: 'Failed to fetch EPIC images' });
    }
  }
});

module.exports = app;
