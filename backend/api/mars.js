import axios from 'axios';

const API_KEY = 'iDjg7hm1AzslFja7bboe8gtO4xGhHdsUIFXwSJec';

export default async function handler(req, res) {
  const { sol = '1000' } = req.query;

  if (!/^\d+$/.test(sol)) {
    return res.status(400).json({ error: 'Invalid sol parameter. It must be a positive integer.' });
  }

  const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${sol}&api_key=${API_KEY}`;

  try {
    const { data } = await axios.get(url);
    res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching Mars photos:', err.message);
    res.status(err.response?.status || 500).json({ error: 'Failed to fetch Mars photos' });
  }
}
