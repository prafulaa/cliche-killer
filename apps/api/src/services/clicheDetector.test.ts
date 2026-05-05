import { describe, it, expect } from 'vitest';
import { detectClichesFast, calculateHealthScore } from './clicheDetector.js';

describe('clicheDetector', () => {
  it('should detect cliches correctly', () => {
    const text = "In today's landscape, cutting-edge technology is a game-changer.";
    const results = detectClichesFast(text);
    
    expect(results.length).toBeGreaterThan(0);
    const phrases = results.map(r => r.phrase);
    expect(phrases).toContain("in today's landscape");
    expect(phrases).toContain("cutting-edge");
    expect(phrases).toContain("a game-changer");
  });

  it('should calculate health score correctly', () => {
    const text = "This is a normal sentence without any issues.";
    const results = detectClichesFast(text);
    const score = calculateHealthScore(text, results);
    expect(score).toBe(100);
  });

  it('should handle text with many cliches', () => {
    const text = "In today's landscape, it's crucial to use cutting-edge solutions for unlocking the potential of our team. This is a game-changer.";
    const results = detectClichesFast(text);
    const score = calculateHealthScore(text, results);
    expect(score).toBeLessThan(100);
    expect(results.length).toBe(5);
  });
});
