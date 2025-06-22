
const request = require('supertest');
const app = require('../app');  // path to your Express app file
const axios = require('axios');

jest.mock('axios');

describe('NEOWS API', () => {
  it('returns NEOWS data for valid dates', async () => {
    const mockData = {
      element_count: 5,
      near_earth_objects: {
        '2025-06-19': [{ id: '1', name: 'Asteroid 1' }],
        '2025-06-20': [{ id: '2', name: 'Asteroid 2' }],
      },
    };

    axios.get.mockResolvedValue({ data: mockData });

    const res = await request(app).get('/api/neows?start_date=2025-06-19&end_date=2025-06-20');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('element_count');
    expect(res.body.element_count).toBe(5);
    expect(res.body).toHaveProperty('near_earth_objects');
    expect(res.body.near_earth_objects).toHaveProperty('2025-06-19');
    expect(Array.isArray(res.body.near_earth_objects['2025-06-19'])).toBe(true);
  });
  it('returns 200 and fills default dates if start_date or end_date is missing', async () => {
    const res = await request(app).get('/api/neows?start_date=2025-06-19');  // or no params at all
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('near_earth_objects');
  });

  it('handles API failure gracefully', async () => {
    axios.get.mockRejectedValue(new Error('API failure'));

    const res = await request(app).get('/api/neows?start_date=2025-06-19&end_date=2025-06-20');

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});
