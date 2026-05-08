import { describe, it, expect } from 'vitest';
import { detectClichesFast, calculateHealthScore, mergeResults } from './clicheDetector.js';

describe('clicheDetector', () => {
  describe('detectClichesFast', () => {
    // Exact match tests
    it('should detect exact phrase: in today s landscape', () => {
      const text = "In today's landscape, technology is advancing.";
      const results = detectClichesFast(text);
      const phrases = results.map(r => r.phrase.toLowerCase());
      expect(phrases).toContain("in today's landscape");
    });

    it('should be case insensitive for exact matches', () => {
      const text = "IN TODAY'S LANDSCAPE we see changes.";
      const results = detectClichesFast(text);
      const phrases = results.map(r => r.phrase.toLowerCase());
      expect(phrases).toContain("in today's landscape");
    });

    it('should detect exact phrase: a game-changer', () => {
      const text = 'This solution is a game-changer for the industry.';
      const results = detectClichesFast(text);
      const phrases = results.map(r => r.phrase.toLowerCase());
      expect(phrases).toContain('a game-changer');
    });

    // Word match tests
    it('should detect word match: cutting-edge', () => {
      const text = 'Our cutting-edge technology leads the market.';
      const results = detectClichesFast(text);
      const phrases = results.map(r => r.phrase.toLowerCase());
      expect(phrases).toContain('cutting-edge');
    });

    it('should detect word match with hyphens', () => {
      const text = 'Cutting-edge solutions are the future.';
      const results = detectClichesFast(text);
      expect(results.some(r => r.phrase === 'cutting-edge')).toBe(true);
    });

    it('should detect word match: synergy', () => {
      const text = 'We need synergy between teams.';
      const results = detectClichesFast(text);
      const phrases = results.map(r => r.phrase.toLowerCase());
      expect(phrases).toContain('synergy');
    });

    it('should detect word match: leverage', () => {
      const text = 'We can leverage our resources.';
      const results = detectClichesFast(text);
      const phrases = results.map(r => r.phrase.toLowerCase());
      expect(phrases).toContain('leverage');
    });

    // Phrase match tests
    it('should detect phrase match: it is crucial to', () => {
      const text = "It's crucial to understand the implications.";
      const results = detectClichesFast(text);
      const phrases = results.map(r => r.phrase.toLowerCase());
      expect(phrases).toContain("it's crucial to");
    });

    it('should detect phrase match: unlocking the potential', () => {
      const text = 'This will help in unlocking the potential of our team.';
      const results = detectClichesFast(text);
      const phrases = results.map(r => r.phrase.toLowerCase());
      expect(phrases).toContain('unlocking the potential');
    });

    it('should detect phrase match: delve into', () => {
      const text = 'Let me delve into the details.';
      const results = detectClichesFast(text);
      const phrases = results.map(r => r.phrase.toLowerCase());
      expect(phrases).toContain('delve into');
    });

    it('should detect phrase match: not only but also', () => {
      const text = "not only... but also this is common";
      const results = detectClichesFast(text);
      const phrases = results.map(r => r.phrase.toLowerCase());
      expect(phrases).toContain('not only... but also');
    });

    it('should detect phrase match: in conclusion', () => {
      const text = 'In conclusion, we should proceed with the plan.';
      const results = detectClichesFast(text);
      const phrases = results.map(r => r.phrase.toLowerCase());
      expect(phrases).toContain('in conclusion');
    });

    it('should detect phrase match: testament to', () => {
      const text = 'This success is a testament to our hard work.';
      const results = detectClichesFast(text);
      const phrases = results.map(r => r.phrase.toLowerCase());
      expect(phrases).toContain('testament to');
    });

    it('should detect phrase match: transformative journey', () => {
      const text = 'It has been a transformative journey for the company.';
      const results = detectClichesFast(text);
      const phrases = results.map(r => r.phrase.toLowerCase());
      expect(phrases).toContain('transformative journey');
    });

    it('should detect phrase match: beacon of', () => {
      const text = 'The company is a beacon of innovation.';
      const results = detectClichesFast(text);
      const phrases = results.map(r => r.phrase.toLowerCase());
      expect(phrases).toContain('beacon of');
    });

    it('should detect phrase match: paradigm shift', () => {
      const text = 'This represents a paradigm shift in the industry.';
      const results = detectClichesFast(text);
      const phrases = results.map(r => r.phrase.toLowerCase());
      expect(phrases).toContain('paradigm shift');
    });

    it('should detect phrase match: holistic approach', () => {
      const text = 'We need a holistic approach to solve this.';
      const results = detectClichesFast(text);
      const phrases = results.map(r => r.phrase.toLowerCase());
      expect(phrases).toContain('holistic approach');
    });

    it('should detect phrase match: seamlessly integrate', () => {
      const text = 'Our systems seamlessly integrate with existing tools.';
      const results = detectClichesFast(text);
      const phrases = results.map(r => r.phrase.toLowerCase());
      expect(phrases).toContain('seamlessly integrate');
    });

    it('should detect phrase match: vibrant ecosystem', () => {
      const text = 'We built a vibrant ecosystem of partners.';
      const results = detectClichesFast(text);
      const phrases = results.map(r => r.phrase.toLowerCase());
      expect(phrases).toContain('vibrant ecosystem');
    });

    it('should detect phrase match: robust solution', () => {
      const text = 'We offer a robust solution for your needs.';
      const results = detectClichesFast(text);
      const phrases = results.map(r => r.phrase.toLowerCase());
      expect(phrases).toContain('robust solution');
    });

    it('should detect phrase match: thought leader', () => {
      const text = 'She is considered a thought leader in AI.';
      const results = detectClichesFast(text);
      const phrases = results.map(r => r.phrase.toLowerCase());
      expect(phrases).toContain('thought leader');
    });

    it('should detect phrase match: core competencies', () => {
      const text = 'We focus on our core competencies.';
      const results = detectClichesFast(text);
      const phrases = results.map(r => r.phrase.toLowerCase());
      expect(phrases).toContain('core competencies');
    });

    it('should detect phrase match: value-added', () => {
      const text = 'We provide value-added services.';
      const results = detectClichesFast(text);
      const phrases = results.map(r => r.phrase.toLowerCase());
      expect(phrases).toContain('value-added');
    });

    it('should detect phrase match: best-in-class', () => {
      const text = 'We deliver best-in-class performance.';
      const results = detectClichesFast(text);
      const phrases = results.map(r => r.phrase.toLowerCase());
      expect(phrases).toContain('best-in-class');
    });

    // Multiple cliches in single text
    it('should detect multiple cliches in one text', () => {
      const text = "In today's landscape, cutting-edge technology is a game-changer. It's crucial to unlock the potential.";
      const results = detectClichesFast(text);
      expect(results.length).toBeGreaterThanOrEqual(4);
    });

    it('should count occurrences of same cliche', () => {
      const text = 'This is a game-changer. That was also a game-changer.';
      const results = detectClichesFast(text);
      const gameChanger = results.find(r => r.phrase.toLowerCase() === 'a game-changer');
      expect(gameChanger?.count).toBe(2);
    });

    // No cliches
    it('should return empty for text with no cliches', () => {
      const text = 'This is a simple sentence with normal words.';
      const results = detectClichesFast(text);
      expect(results.length).toBe(0);
    });

    it('should return empty for clean professional writing', () => {
      const text = 'Our team completed the project on time and under budget. The client was satisfied with the results.';
      const results = detectClichesFast(text);
      expect(results.length).toBe(0);
    });

    // Word boundary tests
    it('should not match partial words', () => {
      const text = "The landscape is beautiful today.";
      const results = detectClichesFast(text);
      const phrases = results.map(r => r.phrase.toLowerCase());
      expect(phrases).not.toContain('in today&apos;s landscape');
    });

    it('should match at word boundaries with punctuation', () => {
      const text = 'This is cutting-edge technology!';
      const results = detectClichesFast(text);
      expect(results.some(r => r.phrase === 'cutting-edge')).toBe(true);
    });

    // Severity sorting
    it('should sort results by severity descending', () => {
      const text = "In today's landscape, we need synergy.";
      const results = detectClichesFast(text);
      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].severity).toBeGreaterThanOrEqual(results[i].severity);
      }
    });

    // Category detection
    it('should detect business category cliches', () => {
      const text = "In today's landscape, synergy is crucial for leveraging our core competencies.";
      const results = detectClichesFast(text);
      const business = results.filter(r => r.category === 'business');
      expect(business.length).toBeGreaterThan(0);
    });

    it('should detect tech category cliches', () => {
      const text = 'Our cutting-edge solution provides scalability and seamless integration.';
      const results = detectClichesFast(text);
      const tech = results.filter(r => r.category === 'tech');
      expect(tech.length).toBeGreaterThan(0);
    });

    it('should detect academic category cliches', () => {
      const text = 'In conclusion, this tapestry of research demonstrates delve into methods.';
      const results = detectClichesFast(text);
      const academic = results.filter(r => r.category === 'academic');
      expect(academic.length).toBeGreaterThan(0);
    });

    it('should detect marketing category cliches', () => {
      const text = 'This transformative journey empowers you with value-added best-in-class solutions.';
      const results = detectClichesFast(text);
      const marketing = results.filter(r => r.category === 'marketing');
      expect(marketing.length).toBeGreaterThan(0);
    });

    // Empty and edge cases
    it('should handle empty string', () => {
      const results = detectClichesFast('');
      expect(results).toEqual([]);
    });

    it('should handle very long text', () => {
      const repeated = "In today's landscape, cutting-edge technology. ";
      const text = repeated.repeat(1000);
      const results = detectClichesFast(text);
      expect(results.length).toBeGreaterThan(0);
    });

    it('should handle text with only whitespace', () => {
      const results = detectClichesFast('   \n\t  ');
      expect(results).toEqual([]);
    });

    it('should handle unicode text', () => {
      const text = "In today's landscape cutting-edge tech";
      const results = detectClichesFast(text);
      expect(results.some(r => r.phrase === 'cutting-edge')).toBe(true);
    });

    // Additional business cliches
    it('should detect foster', () => {
      const text = 'We foster innovation in our team.';
      const results = detectClichesFast(text);
      const phrases = results.map(r => r.phrase.toLowerCase());
      expect(phrases).toContain('foster');
    });

    it('should detect pivot', () => {
      const text = 'The company had to pivot its strategy.';
      const results = detectClichesFast(text);
      const phrases = results.map(r => r.phrase.toLowerCase());
      expect(phrases).toContain('pivot');
    });

    it('should detect scalability', () => {
      const text = 'Scalability is key to our architecture.';
      const results = detectClichesFast(text);
      const phrases = results.map(r => r.phrase.toLowerCase());
      expect(phrases).toContain('scalability');
    });

    it('should detect disruptive', () => {
      const text = 'This is a disruptive technology.';
      const results = detectClichesFast(text);
      const phrases = results.map(r => r.phrase.toLowerCase());
      expect(phrases).toContain('disruptive');
    });

    it('should detect empower as standalone word', () => {
      const text = 'This tool will empower you to succeed.';
      const results = detectClichesFast(text);
      const phrases = results.map(r => r.phrase.toLowerCase());
      expect(phrases).toContain('empower');
    });

    it('should detect streamline', () => {
      const text = 'We streamline our processes.';
      const results = detectClichesFast(text);
      const phrases = results.map(r => r.phrase.toLowerCase());
      expect(phrases).toContain('streamline');
    });

    it('should detect reimagine', () => {
      const text = 'We reimagine what is possible.';
      const results = detectClichesFast(text);
      const phrases = results.map(r => r.phrase.toLowerCase());
      expect(phrases).toContain('reimagine');
    });

    it('should detect tapestry', () => {
      const text = 'The tapestry of our history is rich.';
      const results = detectClichesFast(text);
      const phrases = results.map(r => r.phrase.toLowerCase());
      expect(phrases).toContain('tapestry');
    });
  });

  describe('calculateHealthScore', () => {
    it('should return 100 for text with no cliches', () => {
      const text = 'This is a perfectly normal sentence.';
      const results = detectClichesFast(text);
      const score = calculateHealthScore(text, results);
      expect(score).toBe(100);
    });

    it('should return lower score for text with many cliches', () => {
      const text = "In today's landscape, cutting-edge synergy leverage holistic approach transformative journey.";
      const results = detectClichesFast(text);
      const score = calculateHealthScore(text, results);
      expect(score).toBeLessThan(100);
    });

    it('should return 100 for empty text', () => {
      const score = calculateHealthScore('', []);
      expect(score).toBe(100);
    });

    it('should return 100 for whitespace-only text', () => {
      const score = calculateHealthScore('   \n\t  ', []);
      expect(score).toBe(100);
    });

    it('should not exceed 100 even with many cliches', () => {
      const text = "in today's landscape, ".repeat(20);
      const results = detectClichesFast(text);
      const score = calculateHealthScore(text, results);
      expect(score).toBeLessThanOrEqual(100);
      expect(score).toBeGreaterThanOrEqual(0);
    });

    it('should be lower when cliche count increases', () => {
      const normalText = 'Normal sentence here.';
      const clicheText = "In today's landscape cutting-edge game-changer synergy leverage pivot disruptive empower streamline.";
      
      const normalResults = detectClichesFast(normalText);
      const clicheResults = detectClichesFast(clicheText);
      
      const normalScore = calculateHealthScore(normalText, normalResults);
      const clicheScore = calculateHealthScore(clicheText, clicheResults);
      
      expect(clicheScore).toBeLessThan(normalScore);
    });

    it('should account for cliche count in scoring', () => {
      const singleCliche = 'This is a game-changer with synergy.';
      const multipleCliche = 'This game-changer synergy leverage pivot streamline fosters synergy empowers.';
      
      const singleResults = detectClichesFast(singleCliche);
      const multipleResults = detectClichesFast(multipleCliche);
      
      const singleScore = calculateHealthScore(singleCliche, singleResults);
      const multipleScore = calculateHealthScore(multipleCliche, multipleResults);
      
      expect(multipleScore).toBeLessThan(singleScore);
    });
  });

  describe('mergeResults', () => {
    it('should merge nuanced results that are not in fast results', () => {
      const fastResults = [{
        id: 'c001',
        phrase: 'cutting-edge',
        category: 'tech' as const,
        severity: 8,
        matchType: 'word' as const,
        alternatives: ['latest'],
        explanation: 'lazy'
      }];

      const nuancedResults = [
        { phrase: 'utilize', reason: 'Avoid filler verbs' }
      ];

      const text = 'We utilize cutting-edge technology.';
      const merged = mergeResults(fastResults, nuancedResults, text);
      
      expect(merged.length).toBe(2);
      expect(merged.some(r => r.phrase === 'utilize')).toBe(true);
    });

    it('should not duplicate already detected cliches', () => {
      const fastResults = [{
        id: 'c001',
        phrase: 'cutting-edge',
        category: 'tech' as const,
        severity: 8,
        matchType: 'word' as const,
        alternatives: ['latest'],
        explanation: 'lazy'
      }];

      const nuancedResults = [
        { phrase: 'cutting-edge', reason: 'Already detected' }
      ];

      const text = 'We use cutting-edge technology.';
      const merged = mergeResults(fastResults, nuancedResults, text);
      
      const cuttingEdgeCount = merged.filter(r => r.phrase.toLowerCase() === 'cutting-edge').length;
      expect(cuttingEdgeCount).toBe(1);
    });

    it('should sort merged results by severity', () => {
      const fastResults = [{
        id: 'c001',
        phrase: 'leverage',
        category: 'business' as const,
        severity: 7,
        matchType: 'word' as const,
        alternatives: ['use'],
        explanation: 'buzzword'
      }];

      const nuancedResults = [
        { phrase: 'utilize', reason: 'Also filler' }
      ];

      const text = 'We leverage our resources to utilize opportunities.';
      const merged = mergeResults(fastResults, nuancedResults, text);
      
      for (let i = 1; i < merged.length; i++) {
        expect(merged[i - 1].severity).toBeGreaterThanOrEqual(merged[i].severity);
      }
    });

    it('should handle empty fast results', () => {
      const fastResults: any[] = [];
      const nuancedResults = [
        { phrase: 'basically', reason: 'filler word' }
      ];

      const text = 'This is basically important.';
      const merged = mergeResults(fastResults, nuancedResults, text);
      
      expect(merged.length).toBe(1);
    });

    it('should handle empty nuanced results', () => {
      const fastResults = [{
        id: 'c001',
        phrase: 'cutting-edge',
        category: 'tech' as const,
        severity: 8,
        matchType: 'word' as const,
        alternatives: ['latest'],
        explanation: 'lazy'
      }];

      const text = 'We use cutting-edge tech.';
      const merged = mergeResults(fastResults, [], text);
      
      expect(merged.length).toBe(1);
    });

    it('should add positions for nuanced results', () => {
      const fastResults: any[] = [];
      const nuancedResults = [
        { phrase: 'simply', reason: 'unnecessary filler' }
      ];

      const text = 'This is simply wrong.';
      const merged = mergeResults(fastResults, nuancedResults, text);
      
      const found = merged.find(r => r.phrase === 'simply');
      expect(found).toBeDefined();
      expect(found?.positions).toBeDefined();
      expect(found?.positions?.length).toBeGreaterThan(0);
    });
  });
});