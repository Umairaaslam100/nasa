const request = require('supertest');
const app = require('../app');
const axios = require('axios');

jest.mock('axios');

describe('APOD API', () => {
  it('returns APOD data without date (defaults to today)', async () => {
    axios.get.mockResolvedValue({
      data: {
        title: 'Astronomy Picture of the Day',
        url: 'http://example.com/apod.jpg'
      }
    });

    const res = await request(app).get('/api/apod');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('title');
  });
});
