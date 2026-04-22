import OpenAI from 'openai';
import config from '../config/environment';

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

export type RewriteStyle = 'formal' | 'simplified' | 'scholarly';

export interface HumanizationResult {
  humanizedText: string;
  originalWordCount: number;
  humanizedWordCount: number;
  style: RewriteStyle;
}

export class HumanizationService {
  private static getSystemPrompt(style: RewriteStyle): string {
    const styleGuides: Record<RewriteStyle, string> = {
      formal: `You are an expert academic writer. Rewrite the provided text to be more human-like and natural while maintaining formal academic tone. 
- Use varied sentence structures and lengths
- Add appropriate transitions and connectors
- Include subtle personal voice indicators
- Maintain technical accuracy and citations
- Ensure it reads naturally but remains professional`,

      simplified: `You are a clear academic communicator. Rewrite the text to be more accessible and human-like while maintaining academic rigor.
- Simplify complex terminology where appropriate
- Use shorter, varied sentences
- Add explanatory phrases naturally
- Maintain the original meaning
- Make it sound like written by a thoughtful human`,

      scholarly: `You are a distinguished academic scholar. Elevate the text to advanced scholarly level while making it sound authentically human-written.
- Use sophisticated vocabulary appropriately
- Develop complex arguments naturally
- Include subtle evidence of critical thinking
- Maintain proper academic conventions
- Ensure it sounds like expert scholarly work`,
    };

    return styleGuides[style];
  }

  static async humanizeText(
    text: string,
    style: RewriteStyle = 'formal'
  ): Promise<HumanizationResult> {
    try {
      const systemPrompt = this.getSystemPrompt(style);

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: `Please rewrite the following text to make it more human-like while preserving the original meaning:\n\n${text}`,
          },
        ],
        temperature: 0.7,
        max_tokens: Math.min(3000, Math.ceil(text.length * 1.2)),
      });

      const humanizedText =
        response.choices[0]?.message?.content || text;

      return {
        humanizedText,
        originalWordCount: text.split(/\s+/).length,
        humanizedWordCount: humanizedText.split(/\s+/).length,
        style,
      };
    } catch (error) {
      console.error('Humanization error:', error);
      throw new Error(
        `Failed to humanize text: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  static async humanizeSections(
    sections: string[],
    style: RewriteStyle = 'formal'
  ): Promise<string[]> {
    const results: string[] = [];

    for (const section of sections) {
      if (section.length < 50) {
        results.push(section);
      } else {
        const { humanizedText } = await this.humanizeText(section, style);
        results.push(humanizedText);
      }
    }

    return results;
  }

  static async improveClarity(text: string): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert editor. Improve the clarity and flow of the following text without changing its meaning. Make it more readable and engaging.',
          },
          {
            role: 'user',
            content: `Improve clarity:\n\n${text}`,
          },
        ],
        temperature: 0.6,
        max_tokens: Math.min(3000, Math.ceil(text.length * 1.1)),
      });

      return response.choices[0]?.message?.content || text;
    } catch (error) {
      console.error('Clarity improvement error:', error);
      return text;
    }
  }

  static calculateReadabilityScore(text: string): number {
    // Simple readability score (0-100, higher is more readable)
    const sentences = text.split(/[.!?]+/).length;
    const words = text.split(/\s+/).length;
    const avgWordsPerSentence = words / sentences;

    // Flesch Reading Ease approximation
    let score = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * (1 / 20);
    score = Math.max(0, Math.min(100, score));
    return Math.round(score);
  }
}

export default HumanizationService;
