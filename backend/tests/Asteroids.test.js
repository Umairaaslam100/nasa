const request = require('supertest');
const app = require('../app');

describe('Asteroids API', () => {
  it('returns asteroid data for valid date range', async () => {
    const res = await request(app).get('/api/asteroids?start_date=2022-01-01&end_date=2022-01-03');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('near_earth_objects');
  });

  it('returns 400 for invalid start_date', async () => {
    const res = await request(app).get('/api/asteroids?start_date=invalid-date');
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 for invalid end_date', async () => {
    const res = await request(app).get('/api/asteroids?end_date=2022-99-99');
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 if start_date is after end_date', async () => {
    const res = await request(app).get('/api/asteroids?start_date=2022-01-05&end_date=2022-01-01');
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('works with no date params (uses defaults from NASA API)', async () => {
    const res = await request(app).get('/api/asteroids');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('near_earth_objects');
  });
});
