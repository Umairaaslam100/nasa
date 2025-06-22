const request = require('supertest');
const app = require('../app');
const axios = require('axios');

jest.mock('axios');

describe('Mars Rover API', () => {
  it('returns photos for valid sol', async () => {
    axios.get.mockResolvedValue({
      data: { photos: [{ id: 1, img_src: 'http://example.com/photo.jpg' }] }
    });

    const res = await request(app).get('/api/mars?sol=1000');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('photos');
    expect(Array.isArray(res.body.photos)).toBe(true);
  });

  it('handles invalid sol parameter', async () => {
    const res = await request(app).get('/api/mars?sol=invalid');
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
