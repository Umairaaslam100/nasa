import axios from 'axios';

export default async function handler(req, res) {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  const baseUrl = process.env.NASA_API_URL || 'https://images-api.nasa.gov/search';
  const url = `${baseUrl}?q=${encodeURIComponent(query)}`;

  try {
    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (err) {
    console.error('Failed to fetch NASA media:', err.message);
    res.status(500).json({ error: 'Failed to fetch NASA media' });
  }
}
