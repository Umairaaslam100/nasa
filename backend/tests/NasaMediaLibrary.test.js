const request = require('supertest');
const app = require('../app');

describe('Nasa Media Library API', () => {
  it('returns media items for a valid query', async () => {
    const res = await request(app).get('/api/nasa-media?q=moon');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('collection.items');
    expect(Array.isArray(res.body.collection.items)).toBe(true);
  });

  it('returns 400 if query parameter is missing', async () => {
    const res = await request(app).get('/api/nasa-media');
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('handles API failure gracefully', async () => {
    // simulate bad external API request by querying with invalid URL
    const originalUrl = `https://images-api.nasa.gov/search?q=moon`;
    const temp = process.env.NASA_API_URL;
    process.env.NASA_API_URL = 'https://invalid-url.nasa.gov'; // simulate failure

    const res = await request(app).get('/api/nasa-media?q=moon');

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error');

    process.env.NASA_API_URL = temp; // restore
  });
});
