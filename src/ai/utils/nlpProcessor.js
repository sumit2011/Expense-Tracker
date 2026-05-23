/**
 * NLP Processor
 * Natural Language Processing utilities for query understanding
 */

export class NLPProcessor {
  constructor() {
    this.stopWords = new Set([
      'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
      'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
      'can', 'could', 'may', 'might', 'must', 'shall', 'to', 'of', 'in',
      'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through',
      'during', 'before', 'after', 'above', 'below', 'between', 'under',
      'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where',
      'why', 'how', 'all', 'each', 'few', 'more', 'most', 'other', 'some',
      'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than',
      'too', 'very', 'just', 'and', 'but', 'if', 'or', 'because', 'until',
      'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between',
      'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to',
      'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again',
      'further', 'then', 'once'
    ]);
  }

  /**
   * Tokenize text into words
   */
  tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 0);
  }

  /**
   * Remove stop words from tokens
   */
  removeStopWords(tokens) {
    return tokens.filter(token => !this.stopWords.has(token));
  }

  /**
   * Extract keywords from text
   */
  extractKeywords(text) {
    const tokens = this.tokenize(text);
    const keywords = this.removeStopWords(tokens);
    return keywords;
  }

  /**
   * Calculate similarity between two texts (Jaccard similarity)
   */
  calculateSimilarity(text1, text2) {
    const keywords1 = new Set(this.extractKeywords(text1));
    const keywords2 = new Set(this.extractKeywords(text2));

    const intersection = new Set([...keywords1].filter(x => keywords2.has(x)));
    const union = new Set([...keywords1, ...keywords2]);

    if (union.size === 0) return 0;
    return intersection.size / union.size;
  }

  /**
   * Extract numbers from text
   */
  extractNumbers(text) {
    const numbers = text.match(/(\d+(?:,\d+)*(?:\.\d+)?)/g);
    if (!numbers) return [];
    return numbers.map(n => parseFloat(n.replace(/,/g, '')));
  }

  /**
   * Extract dates from text
   */
  extractDates(text) {
    const datePatterns = [
      /\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})\b/,
      /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(?:st|nd|rd|th)?(?:,\s+(\d{4}))?\b/i,
      /\b(this month|last month|next month|this year|last year|next month)\b/i
    ];

    const dates = [];
    datePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        dates.push(matches[0]);
      }
    });

    return dates;
  }

  /**
   * Detect sentiment (simple rule-based)
   */
  detectSentiment(text) {
    const positiveWords = ['good', 'great', 'excellent', 'happy', 'love', 'like', 'best', 'better'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'worst', 'worse', 'sad'];

    const tokens = this.tokenize(text);
    let positiveCount = 0;
    let negativeCount = 0;

    tokens.forEach(token => {
      if (positiveWords.includes(token)) positiveCount++;
      if (negativeWords.includes(token)) negativeCount++;
    });

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  /**
   * Detect question type
   */
  detectQuestionType(text) {
    const lowerText = text.toLowerCase();

    if (lowerText.startsWith('what')) return 'what';
    if (lowerText.startsWith('how')) return 'how';
    if (lowerText.startsWith('why')) return 'why';
    if (lowerText.startsWith('when')) return 'when';
    if (lowerText.startsWith('where')) return 'where';
    if (lowerText.startsWith('who')) return 'who';
    if (lowerText.startsWith('which')) return 'which';
    if (lowerText.startsWith('can')) return 'can';
    if (lowerText.startsWith('should')) return 'should';
    if (lowerText.startsWith('could')) return 'could';
    if (lowerText.startsWith('would')) return 'would';
    if (lowerText.startsWith('do')) return 'do';
    if (lowerText.startsWith('does')) return 'does';
    if (lowerText.startsWith('did')) return 'did';
    if (lowerText.startsWith('is')) return 'is';
    if (lowerText.startsWith('are')) return 'are';

    return 'statement';
  }

  /**
   * Normalize text
   */
  normalize(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s]/g, '');
  }

  /**
   * Extract entities (simple rule-based)
   */
  extractEntities(text) {
    const entities = {
      amounts: this.extractNumbers(text),
      dates: this.extractDates(text),
      categories: [],
      timeframes: []
    };

    // Extract timeframes
    const timeframes = ['this month', 'last month', 'this year', 'last year', 'this week', 'last week'];
    timeframes.forEach(tf => {
      if (text.toLowerCase().includes(tf)) {
        entities.timeframes.push(tf);
      }
    });

    return entities;
  }

  /**
   * Calculate text complexity
   */
  calculateComplexity(text) {
    const tokens = this.tokenize(text);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    const avgWordsPerSentence = tokens.length / Math.max(sentences.length, 1);
    const avgCharsPerWord = text.replace(/\s/g, '').length / Math.max(tokens.length, 1);

    return {
      tokenCount: tokens.length,
      sentenceCount: sentences.length,
      avgWordsPerSentence: avgWordsPerSentence.toFixed(2),
      avgCharsPerWord: avgCharsPerWord.toFixed(2)
    };
  }
}

export default NLPProcessor;
