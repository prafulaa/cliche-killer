import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Cliche } from '@cliche-killer/shared';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLICHES_PATH = path.join(__dirname, '../../data/cliches.json');

export function loadClichesFromJson(): { cliches: Cliche[] } {
  const data = fs.readFileSync(CLICHES_PATH, 'utf-8');
  return JSON.parse(data);
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
