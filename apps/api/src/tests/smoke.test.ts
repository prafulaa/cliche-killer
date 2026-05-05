import { describe, it, expect } from 'vitest';
import request from 'supertest';

const API_URL = process.env.API_URL || 'http://localhost:3001';

describe('Production Smoke Test', () => {
  it('should respond to health check', async () => {
    const response = await fetch(`${API_URL}/healthz`);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.status).toBe('ok');
  });

  it('should handle anonymous analysis within rate limits', async () => {
    const response = await fetch(`${API_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: "In today's landscape, we must delve into the tapestry." })
    });
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.clichesFound).toBeGreaterThan(0);
  });

  it('should reject invalid magic link requests', async () => {
    const response = await fetch(`${API_URL}/api/auth/request-magic-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'invalid-email' })
    });
    
    expect(response.status).toBe(400);
  });
});
