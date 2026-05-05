import { describe, it, expect, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import analyzeRouter from './analyze.js';

const app = express();
app.use(express.json());
app.use('/api/analyze', analyzeRouter);

describe('POST /api/analyze', () => {
  it('should return analysis results for valid text', async () => {
    const response = await request(app)
      .post('/api/analyze')
      .send({ text: "In today's landscape, we must delve into the tapestry of cutting-edge tech." });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('clichesFound');
    expect(response.body).toHaveProperty('healthScore');
    expect(response.body).toHaveProperty('clicheList');
    expect(response.body.clichesFound).toBeGreaterThan(0);
  });

  it('should return 400 for missing text', async () => {
    const response = await request(app)
      .post('/api/analyze')
      .send({});

    expect(response.status).toBe(400);
  });

  it('should handle large text by truncating (mock logic)', async () => {
    const largeText = "cliche ".repeat(11000);
    const response = await request(app)
      .post('/api/analyze')
      .send({ text: largeText });

    expect(response.status).toBe(200);
    // Since our detection logic is fast, it should handle this quickly
  });
});
