import axios from 'axios';

const API_KEY = 'iDjg7hm1AzslFja7bboe8gtO4xGhHdsUIFXwSJec';

const isValidDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(new Date(date).getTime());

export default async function handler(req, res) {
  const { date } = req.query;

  if (date && !isValidDate(date)) {
    return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
  }

  const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}${date ? `&date=${date}` : ''}`;

  try {
    const { data } = await axios.get(url);
    res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching APOD:', err.message);
    res.status(err.response?.status || 500).json({ error: 'Failed to fetch APOD' });
  }
}
