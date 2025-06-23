import axios from 'axios';

const API_KEY = 'iDjg7hm1AzslFja7bboe8gtO4xGhHdsUIFXwSJec';

const isValidDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(new Date(date).getTime());

export default async function handler(req, res) {
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
    res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching asteroid data:', err.message);
    res.status(err.response?.status || 500).json({ error: 'Failed to fetch asteroid data' });
  }
}
