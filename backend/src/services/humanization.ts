import OpenAI from 'openai';
import config from '../config/environment';

const openai = config.openaiApiKey
  ? new OpenAI({
      apiKey: config.openaiApiKey,
    })
  : null;

export type RewriteStyle = 'formal' | 'simplified' | 'scholarly';

export interface HumanizationResult {
  humanizedText: string;
  originalWordCount: number;
  humanizedWordCount: number;
  style: RewriteStyle;
}

export class HumanizationService {
  private static splitSentences(text: string): string[] {
    return text
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  private static localHumanize(text: string, style: RewriteStyle): string {
    const sentences = this.splitSentences(text);
    if (sentences.length === 0) {
      return text;
    }

    const rewritten = sentences.map((sentence, index) => {
      const cleaned = sentence.replace(/\s+/g, ' ').trim();
      if (cleaned.length < 25) {
        return cleaned;
      }

      if (style === 'formal') {
        if (index % 4 === 0) return `In this context, ${cleaned.charAt(0).toLowerCase()}${cleaned.slice(1)}`;
        if (index % 4 === 1) return `Moreover, ${cleaned.charAt(0).toLowerCase()}${cleaned.slice(1)}`;
        return cleaned;
      }

      if (style === 'simplified') {
        const shorter = cleaned
          .replace(/\btherefore\b/gi, 'so')
          .replace(/\bmoreover\b/gi, 'also')
          .replace(/\butilize\b/gi, 'use')
          .replace(/\bin order to\b/gi, 'to');
        if (index % 3 === 0) return `Put simply, ${shorter.charAt(0).toLowerCase()}${shorter.slice(1)}`;
        return shorter;
      }

      if (index % 3 === 0) return `From a scholarly standpoint, ${cleaned.charAt(0).toLowerCase()}${cleaned.slice(1)}`;
      if (index % 3 === 1) return `This perspective also suggests that ${cleaned.charAt(0).toLowerCase()}${cleaned.slice(1)}`;
      return cleaned;
    });

    return rewritten.join(' ');
  }

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
    const originalWordCount = text.split(/\s+/).filter((w) => w.trim().length > 0).length;

    if (!openai) {
      const fallbackText = this.localHumanize(text, style);
      return {
        humanizedText: fallbackText,
        originalWordCount,
        humanizedWordCount: fallbackText.split(/\s+/).filter((w) => w.trim().length > 0).length,
        style,
      };
    }

    try {
      const systemPrompt = this.getSystemPrompt(style);
      const estimatedWordCount = Math.max(1, originalWordCount);
      const maxTokens = Math.min(2000, Math.max(400, Math.round(estimatedWordCount * 1.5)));

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
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
        max_tokens: maxTokens,
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
      // Fall back to local deterministic rewrite to avoid hard failure.
      const fallbackText = this.localHumanize(text, style);
      return {
        humanizedText: fallbackText,
        originalWordCount,
        humanizedWordCount: fallbackText.split(/\s+/).filter((w) => w.trim().length > 0).length,
        style,
      };
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
    if (!openai) {
      return this.localHumanize(text, 'simplified');
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
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
        max_tokens: Math.min(1800, Math.max(300, Math.ceil(text.split(/\s+/).length * 1.2))),
      });

      return response.choices[0]?.message?.content || text;
    } catch (error) {
      console.error('Clarity improvement error:', error);
      return text;
    }
  }

  static calculateReadabilityScore(text: string): number {
    // Simple readability score (0-100, higher is more readable)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length || 1;
    const words = text.split(/\s+/).filter(w => w.trim().length > 0).length || 1;
    
    // Count syllables (rough approximation)
    const syllableCount = (text.match(/[aeiou]+/gi) || []).length;
    const avgWordsPerSentence = words / sentences;
    const avgSyllablesPerWord = syllableCount / words || 1;

    // Flesch Reading Ease formula
    let score = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;
    score = Math.max(0, Math.min(100, score));
    return Math.round(score);
  }
}

export default HumanizationService;
