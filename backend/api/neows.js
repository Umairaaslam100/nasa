import axios from 'axios';

const API_KEY = 'iDjg7hm1AzslFja7bboe8gtO4xGhHdsUIFXwSJec';

const isValidDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(new Date(date).getTime());

export default async function handler(req, res) {
  const today = new Date();
  const maxRangeDays = 7;

  let { start_date, end_date } = req.query;

  if (!end_date) {
    end_date = today.toISOString().split('T')[0];
  }

  if (!start_date) {
    const pastDate = new Date(today.getTime() - maxRangeDays * 86400000);
    start_date = pastDate.toISOString().split('T')[0];
  }

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
    res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching NeoWs:', err.message, err.response?.data);
    res.status(err.response?.status || 500).json({ error: 'Failed to fetch Near Earth Object data' });
  }
}
