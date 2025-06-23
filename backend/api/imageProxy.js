import axios from 'axios';

export default async function handler(req, res) {
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
}
