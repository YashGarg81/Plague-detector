import OpenAI from 'openai';
import config from '../config/environment';
import AIMicroserviceClient from './aiMicroservice';

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

export interface DetectionResult {
  aiScore: number;
  plagiarismScore: number;
  confidence: number;
  similarityScore: number;
  reportGeneratedInMs: number;
  flaggedSections: Array<{
    text: string;
    startIndex: number;
    endIndex: number;
    type: 'ai-generated' | 'plagiarism';
    color: 'red' | 'yellow' | 'blue';
    confidence: number;
  }>;
  sourceMatches: Array<{
    sourceType: 'website' | 'journal' | 'student-paper';
    sourceName: string;
    matchPercentage: number;
    matchedText: string;
  }>;
  matchedContentBreakdown: {
    websites: number;
    journals: number;
    studentPapers: number;
  };
  filters: {
    excludeQuotes: boolean;
    excludeBibliography: boolean;
    excludeSmallMatchesUnderWords: number;
  };
  writingAnalysis: {
    paraphrasingLikelihood: number;
    writingPatternConsistency: number;
    grammarRisk: number;
    structureRisk: number;
  };
}

export interface AnalysisFilterOptions {
  excludeQuotes?: boolean;
  excludeBibliography?: boolean;
  excludeSmallMatchesUnderWords?: number;
}

export class AIDetectionService {
  private static lexicalDiversity(text: string): number {
    const tokens = text
      .toLowerCase()
      .split(/\W+/)
      .filter((token) => token.length > 1);
    if (tokens.length === 0) {
      return 0;
    }
    const unique = new Set(tokens);
    return unique.size / tokens.length;
  }

  private static sentenceLengthVariance(text: string): number {
    const lengths = text
      .split(/[.!?]+/)
      .map((segment) => segment.trim().split(/\s+/).filter(Boolean).length)
      .filter((n) => n > 0);
    if (lengths.length < 2) {
      return 0.5;
    }

    const mean = lengths.reduce((sum, n) => sum + n, 0) / lengths.length;
    const variance =
      lengths.reduce((sum, n) => sum + Math.pow(n - mean, 2), 0) / lengths.length;
    return Math.min(1, variance / 80);
  }

  private static heuristicAIScore(text: string): number {
    const diversity = this.lexicalDiversity(text);
    const sentenceVariance = this.sentenceLengthVariance(text);
    const transitionDensity =
      (text.match(/\btherefore|moreover|furthermore|additionally\b/gi) || []).length /
      Math.max(1, text.split(/\s+/).length);

    // Lower lexical diversity + very uniform sentence length can hint AI generation.
    const score =
      (1 - Math.min(1, diversity * 1.7)) * 0.45 +
      (1 - sentenceVariance) * 0.4 +
      Math.min(1, transitionDensity * 25) * 0.15;
    return Math.max(0, Math.min(1, score));
  }

  private static heuristicPlagiarismScore(text: string): number {
    const quotes = (text.match(/"[^"]+"/g) || []).length;
    const citations = (text.match(/\(\w+,\s?\d{4}\)|\[\d+\]/g) || []).length;
    const repeatedPhrases = (text.match(/\b(\w+\s+\w+\s+\w+)\b(?=.*\b\1\b)/gi) || []).length;
    const words = Math.max(1, text.split(/\s+/).length);

    const score =
      Math.min(1, quotes / 8) * 0.35 +
      Math.min(1, citations / 10) * 0.4 +
      Math.min(1, repeatedPhrases / Math.max(1, words / 30)) * 0.25;
    return Math.max(0, Math.min(1, score));
  }

  private static applyFilters(text: string, filters: Required<AnalysisFilterOptions>): string {
    let filtered = text;

    if (filters.excludeQuotes) {
      filtered = filtered.replace(/"[^"]{5,}"/g, ' ');
    }

    if (filters.excludeBibliography) {
      filtered = filtered.replace(/\b(references|bibliography)\b[\s\S]*$/i, ' ');
    }

    if (filters.excludeSmallMatchesUnderWords > 0) {
      filtered = filtered
        .split(/[.!?]+/)
        .filter((segment) => segment.trim().split(/\s+/).length >= filters.excludeSmallMatchesUnderWords)
        .join('. ');
    }

    return filtered.trim() || text;
  }

  private static estimateMatchDensity(text: string): number {
    const normalized = text.toLowerCase();
    const indicators = [
      'according to',
      'research shows',
      'in conclusion',
      'therefore',
      'moreover',
      'study',
      'journal',
      'citation'
    ];

    const score = indicators.reduce((acc, token) => {
      const matches = normalized.split(token).length - 1;
      return acc + matches;
    }, 0);

    return Math.min(1, score / 20);
  }

  private static buildSourceMatches(text: string, plagiarismScore: number) {
    const preview = text.substring(0, 180).trim();
    const websites = Math.min(100, Math.round((plagiarismScore * 0.45 + 0.05) * 100));
    const journals = Math.min(100, Math.round((plagiarismScore * 0.35 + 0.03) * 100));
    const studentPapers = Math.min(100, Math.round((plagiarismScore * 0.2 + 0.02) * 100));

    return {
      sourceMatches: [
        {
          sourceType: 'website' as const,
          sourceName: 'Open internet corpus',
          matchPercentage: websites,
          matchedText: preview,
        },
        {
          sourceType: 'journal' as const,
          sourceName: 'Scholarly publications corpus',
          matchPercentage: journals,
          matchedText: preview,
        },
        {
          sourceType: 'student-paper' as const,
          sourceName: 'Institutional paper repository',
          matchPercentage: studentPapers,
          matchedText: preview,
        },
      ],
      matchedContentBreakdown: {
        websites,
        journals,
        studentPapers,
      },
    };
  }

  static async detectAIContent(text: string): Promise<number> {
    const aiServiceResult = await AIMicroserviceClient.detectAIWriting(text);
    if (aiServiceResult) {
      return Math.max(0, Math.min(1, aiServiceResult.aiScore));
    }

    try {
      const prompt = `You are an AI content detector. Analyze the following text and determine the probability that it was written by an AI. Consider factors like:
- Repetitive patterns and unusual word choices
- Overly formal or robotic tone
- Lack of personal voice or unique phrasing
- Consistent sentence structure
- Generic examples or explanations

Text: "${text.substring(0, 1500)}"

Respond with ONLY a number between 0 and 1, where:
- 0 = Definitely human-written
- 1 = Definitely AI-generated
- 0.5 = Uncertain

Example response: 0.75`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 10,
      });

      const scoreText = response.choices[0]?.message?.content?.trim() || '0.5';
      let score = parseFloat(scoreText);
      score = isNaN(score) ? 0.5 : Math.max(0, Math.min(1, score));
      return score;
    } catch (error) {
      console.error('AI Detection error:', error);
      return this.heuristicAIScore(text);
    }
  }

  static async detectPlagiarism(text: string): Promise<number> {
    const similarityResult = await AIMicroserviceClient.similarityAgainstCorpus(text);
    if (similarityResult) {
      return Math.max(0, Math.min(1, similarityResult.similarityScore));
    }

    // This is a simplified plagiarism detector
    // In production, use APIs like Turnitin, Copyscape, or your own database
    try {
      const prompt = `Analyze this text for potential plagiarism indicators. Look for:
- Overly specific phrases that might be quoted
- Citation patterns
- Unusual consistency in writing style
- Generic academic language

Text: "${text.substring(0, 1500)}"

Estimate the likelihood of plagiarism on a scale of 0 to 1.
Respond with ONLY a number.
Example: 0.25`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 10,
      });

      const scoreText = response.choices[0]?.message?.content?.trim() || '0.3';
      let score = parseFloat(scoreText);
      score = isNaN(score) ? 0.3 : Math.max(0, Math.min(1, score));
      return score;
    } catch (error) {
      console.error('Plagiarism Detection error:', error);
      return this.heuristicPlagiarismScore(text);
    }
  }

  static async analyzeFullDocument(
    text: string,
    options: AnalysisFilterOptions = {}
  ): Promise<DetectionResult> {
    const startedAt = Date.now();
    const filters: Required<AnalysisFilterOptions> = {
      excludeQuotes: options.excludeQuotes ?? true,
      excludeBibliography: options.excludeBibliography ?? true,
      excludeSmallMatchesUnderWords: options.excludeSmallMatchesUnderWords ?? 8,
    };

    const normalizedText = this.applyFilters(text, filters);
    const aiScore = await this.detectAIContent(normalizedText);
    const plagiarismScore = await this.detectPlagiarism(normalizedText);
    const matchDensity = this.estimateMatchDensity(normalizedText);
    const similarityScore = Math.min(
      1,
      plagiarismScore * 0.7 + matchDensity * 0.3
    );

    // Identify flagged sections
    const sentences = normalizedText.split(/[.!?]+/).map((s) => s.trim());
    const flaggedSections: DetectionResult['flaggedSections'] = [];

    for (let i = 0; i < Math.min(sentences.length, 5); i++) {
      const sentence = sentences[i];
      if (sentence.length > 10) {
        const sectionAIScore = aiScore * (0.8 + Math.random() * 0.4);
        if (sectionAIScore > config.aiDetectionThreshold) {
          flaggedSections.push({
            text: sentence,
            startIndex: normalizedText.indexOf(sentence),
            endIndex: normalizedText.indexOf(sentence) + sentence.length,
            type: 'ai-generated' as const,
            color: 'yellow',
            confidence: Math.min(1, sectionAIScore),
          });
        }
      }
    }

    for (let i = 0; i < Math.min(sentences.length, 4); i++) {
      const sentence = sentences[i];
      if (sentence.length < 20) {
        continue;
      }

      const sectionPlagiarismScore = plagiarismScore * (0.8 + Math.random() * 0.4);
      if (sectionPlagiarismScore > config.plagiarismThreshold) {
        flaggedSections.push({
          text: sentence,
          startIndex: normalizedText.indexOf(sentence),
          endIndex: normalizedText.indexOf(sentence) + sentence.length,
          type: 'plagiarism',
          color: 'red',
          confidence: Math.min(1, sectionPlagiarismScore),
        });
      }
    }

    const similarityServiceResult = await AIMicroserviceClient.similarityAgainstCorpus(
      normalizedText
    );
    const { sourceMatches, matchedContentBreakdown } = similarityServiceResult
      ? {
          sourceMatches: similarityServiceResult.sourceMatches,
          matchedContentBreakdown: {
            websites:
              similarityServiceResult.sourceMatches.find((s) => s.sourceType === 'website')
                ?.matchPercentage || 0,
            journals:
              similarityServiceResult.sourceMatches.find((s) => s.sourceType === 'journal')
                ?.matchPercentage || 0,
            studentPapers:
              similarityServiceResult.sourceMatches.find(
                (s) => s.sourceType === 'student-paper'
              )?.matchPercentage || 0,
          },
        }
      : this.buildSourceMatches(text, similarityScore);

    const reportGeneratedInMs = Date.now() - startedAt;

    return {
      aiScore,
      plagiarismScore,
      confidence: (aiScore + plagiarismScore) / 2,
      similarityScore,
      reportGeneratedInMs,
      flaggedSections,
      sourceMatches,
      matchedContentBreakdown,
      filters: {
        excludeQuotes: filters.excludeQuotes,
        excludeBibliography: filters.excludeBibliography,
        excludeSmallMatchesUnderWords: filters.excludeSmallMatchesUnderWords,
      },
      writingAnalysis: {
        paraphrasingLikelihood: Math.min(1, aiScore * 0.5 + plagiarismScore * 0.5),
        writingPatternConsistency: Math.min(1, aiScore * 0.65 + 0.2),
        grammarRisk: Math.min(1, 0.2 + aiScore * 0.4),
        structureRisk: Math.min(1, 0.25 + aiScore * 0.35),
      },
    };
  }
}

export default AIDetectionService;
