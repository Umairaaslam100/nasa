const request = require('supertest');
const app = require('../app'); // ✅ go up one level
 // Adjust the path to your Express app


 
describe('EPIC API', () => {
    it('should handle errors gracefully', async () => {
        const res = await request(app).get('/api/epic?date=invalid-date');
      
        // 👇 Add this line to log the actual status code
        console.log('Received status:', res.statusCode);
      
        expect([400, 500]).toContain(res.statusCode);  
        if (res.statusCode === 400) {
          expect(res.body).toHaveProperty('error');
        }
      });
      

  it('should handle errors gracefully', async () => {
    // Simulate error by calling with invalid params or mocking failure if possible
    // For now, just a simple test to cover the error path if any

    // Example: if your route supports query params for date, test invalid date
    const res = await request(app).get('/api/epic?date=invalid-date');
    expect([400, 500]).toContain(res.statusCode);
    if (res.statusCode === 400) {
      expect(res.body).toHaveProperty('error');
    }
  });
});
