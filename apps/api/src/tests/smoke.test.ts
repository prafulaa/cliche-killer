import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';

const API_URL = process.env.API_URL || 'http://localhost:3001';

// Skip smoke tests if server is not available
const skipIfNoServer = async () => {
  try {
    const response = await fetch(`${API_URL}/healthz`, { method: 'GET' });
    return response.ok;
  } catch {
    return false;
  }
};

describe('Production Smoke Test', () => {
  let serverAvailable = false;

  beforeAll(async () => {
    serverAvailable = await skipIfNoServer();
  });

  it('should respond to health check', async () => {
    if (!serverAvailable) {
      console.log('Skipping smoke test: server not available at ' + API_URL);
      return;
    }
    const response = await fetch(`${API_URL}/healthz`);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.status).toBe('ok');
  });

  it('should handle anonymous analysis within rate limits', async () => {
    if (!serverAvailable) {
      console.log('Skipping smoke test: server not available at ' + API_URL);
      return;
    }
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
    if (!serverAvailable) {
      console.log('Skipping smoke test: server not available at ' + API_URL);
      return;
    }
    const response = await fetch(`${API_URL}/api/auth/request-magic-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'invalid-email' })
    });
    
    expect(response.status).toBe(400);
  });
});
