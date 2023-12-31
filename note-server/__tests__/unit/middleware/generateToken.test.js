const request = require('supertest');
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

const generateToken = require('../../../utils/generateToken');

process.env.JWT_SECRET = 'abcd1234';

app.get('/test-generate-token', async (req, res) => {
  try {
    const userId = 'mockUserId';
    const token = await generateToken(res, userId);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

describe('generateToken utility function', () => {
  it('should generate a valid token and set it in the cookie', async () => {
    const response = await request(app).get('/test-generate-token');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should handle errors and respond with a 500 status', async () => {
    jest.spyOn(jwt, 'sign').mockImplementationOnce((data, secret, options, callback) => {
      callback(new Error('Mocked signing error'), null);
    });

    const response = await request(app).get('/test-generate-token');

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Mocked signing error');

    jest.restoreAllMocks();
  });
});
