import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn (className utility)', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
  });

  it('handles undefined and null', () => {
    expect(cn('base', undefined, null, 'extra')).toBe('base extra');
  });

  it('merges tailwind classes correctly', () => {
    expect(cn('px-4 py-2', 'py-4')).toBe('px-4 py-4');
  });

  it('returns empty string for no inputs', () => {
    expect(cn()).toBe('');
  });
});
