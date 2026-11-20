import request from 'supertest';
import app from '../src/app.js';

describe('Health and System Endpoints', () => {
  it('GET /health returns 200 with UP status, serverTime, uptime, and database state', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('status', 'UP');
    expect(response.body).toHaveProperty('serverTime');
    expect(response.body).toHaveProperty('uptime');
    expect(response.body).toHaveProperty('database');
    expect(new Date(response.body.serverTime).toString()).not.toBe('Invalid Date');
  });

  it('GET /api returns 200 with API info', async () => {
    const response = await request(app).get('/api');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('name', 'VELoop Rewards API');
  });

  it('GET /unknown-route returns 404 with standard error structure', async () => {
    const response = await request(app).get('/non-existent-endpoint');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body.error).toHaveProperty('code', 'NOT_FOUND');
    expect(response.body.error).toHaveProperty('message');
    expect(response.headers).toHaveProperty('x-request-id');
  });
});
