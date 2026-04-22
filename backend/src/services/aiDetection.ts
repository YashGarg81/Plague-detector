import OpenAI from 'openai';
import config from '../config/environment';

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

export interface DetectionResult {
  aiScore: number;
  plagiarismScore: number;
  confidence: number;
  flaggedSections: Array<{
    text: string;
    startIndex: number;
    endIndex: number;
    type: 'ai-generated' | 'plagiarism';
    confidence: number;
  }>;
}

export class AIDetectionService {
  static async detectAIContent(text: string): Promise<number> {
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
      return 0.5; // Default to uncertain
    }
  }

  static async detectPlagiarism(text: string): Promise<number> {
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
      return 0.3;
    }
  }

  static async analyzeFullDocument(text: string): Promise<DetectionResult> {
    const aiScore = await this.detectAIContent(text);
    const plagiarismScore = await this.detectPlagiarism(text);

    // Identify flagged sections
    const sentences = text.split(/[.!?]+/).map((s) => s.trim());
    const flaggedSections = [];

    for (let i = 0; i < Math.min(sentences.length, 5); i++) {
      const sentence = sentences[i];
      if (sentence.length > 10) {
        const sectionAIScore = aiScore * (0.8 + Math.random() * 0.4);
        if (sectionAIScore > config.aiDetectionThreshold) {
          flaggedSections.push({
            text: sentence,
            startIndex: text.indexOf(sentence),
            endIndex: text.indexOf(sentence) + sentence.length,
            type: 'ai-generated' as const,
            confidence: Math.min(1, sectionAIScore),
          });
        }
      }
    }

    return {
      aiScore,
      plagiarismScore,
      confidence: (aiScore + plagiarismScore) / 2,
      flaggedSections,
    };
  }
}

export default AIDetectionService;
