import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Cliche } from '@cliche-killer/shared';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLICHES_PATH = path.join(process.cwd(), 'data/cliches.json');

// Cache cliches at module level to avoid repeated file I/O
let clichesCache: { cliches: Cliche[] } | null = null;

export function loadClichesFromJson(): { cliches: Cliche[] } {
  if (!clichesCache) {
    const data = fs.readFileSync(CLICHES_PATH, 'utf-8');
    clichesCache = JSON.parse(data);
  }
  return clichesCache!;
}

// Force reload for testing
export function clearClichesCache() {
  clichesCache = null;
}

export function detectClichesFast(text: string): Cliche[] {
  const db = loadClichesFromJson();
  const results: Cliche[] = [];
  const lowerText = text.toLowerCase();

  for (const cliche of db.cliches) {
    const escapedPhrase = cliche.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    let regex: RegExp;

    if (cliche.matchType === 'exact') {
      regex = new RegExp(`\\b${escapedPhrase}\\b`, 'gi');
    } else if (cliche.matchType === 'word') {
      regex = new RegExp(`\\b${escapedPhrase}\\b`, 'gi');
    } else {
      regex = new RegExp(`\\b${escapedPhrase}\\b`, 'gi');
    }

    const matches = text.match(regex);
    if (matches) {
      results.push({
        ...cliche,
        count: matches.length,
        positions: findPositions(text, regex)
      });
    }
  }

  return results.sort((a, b) => b.severity - (a.severity || 0));
}

export function mergeResults(fastResults: Cliche[], nuancedResults: { phrase: string, reason: string }[], text: string): Cliche[] {
  const merged = [...fastResults];
  
  for (const nuanced of nuancedResults) {
    // Check if phrase is already in fast results
    const exists = merged.some(f => f.phrase.toLowerCase() === nuanced.phrase.toLowerCase());
    
    if (!exists) {
      // Find positions for the nuanced result
      const regex = new RegExp(`\\b${nuanced.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      const positions = findPositions(text, regex);
      
      if (positions.length > 0) {
        merged.push({
          id: `ai-${Math.random().toString(36).substr(2, 9)}`,
          phrase: nuanced.phrase,
          category: 'other',
          severity: 7, // High default for AI-detected nuances
          matchType: 'phrase',
          alternatives: ["rewrite this manually", "use more direct language"],
          explanation: nuanced.reason,
          count: positions.length,
          positions: positions
        });
      }
    }
  }
  
  return merged.sort((a, b) => b.severity - (a.severity || 0));
}

function findPositions(text: string, regex: RegExp): number[] {
  const positions: number[] = [];
  let match;
  const localRegex = new RegExp(regex.source, regex.flags);
  while ((match = localRegex.exec(text)) !== null) {
    positions.push(match.index);
  }
  return positions;
}

export function calculateHealthScore(text: string, cliches: Cliche[]): number {
  const words = text.trim().split(/\s+/);
  const wordCount = words.length === 1 && words[0] === '' ? 0 : words.length;
  if (wordCount === 0) return 100;

  const clicheWordCount = cliches.reduce((sum, c) => {
    const phraseWords = c.phrase.split(/\s+/).length;
    return sum + (phraseWords * (c.count || 0));
  }, 0);

  const clicheRatio = clicheWordCount / wordCount;
  const score = Math.max(0, 100 - Math.floor(clicheRatio * 100));

  return Math.min(100, score);
}
