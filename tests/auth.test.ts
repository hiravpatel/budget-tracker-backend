import request from 'supertest';
import app from '../src/app'; // Make sure app is exported from app.ts

// Mock the user model
jest.mock('../src/models/User', () => {
  return {
    findOne: jest.fn(),
    create: jest.fn()
  };
});

describe('Auth Endpoints', () => {
  it('should return 400 if login credentials are not provided', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({});
      
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Email and password are required');
  });
});
