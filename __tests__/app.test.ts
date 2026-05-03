import request from 'supertest';
import app from '../src/app';

describe('API Routes', () => {
  it('should return welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
  });

  it('should return 404 for unknown route', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
  });

  it('should return 401 for protected route without token', async () => {
    const res = await request(app).get('/api/v1/emprunts');
    expect(res.statusCode).toEqual(401);
  });
});