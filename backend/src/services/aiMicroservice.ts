import axios from 'axios';
import config from '../config/environment';

export interface SimilarityServiceResult {
  similarityScore: number;
  sourceMatches: Array<{
    sourceType: 'website' | 'journal' | 'student-paper';
    sourceName: string;
    matchPercentage: number;
    matchedText: string;
  }>;
}

export interface AIDetectionServiceResult {
  aiScore: number;
  writingPatternConsistency: number;
}

export class AIMicroserviceClient {
  static async similarityAgainstCorpus(text: string): Promise<SimilarityServiceResult | null> {
    try {
      const response = await axios.post(
        `${config.aiServiceUrl}/similarity`,
        { text },
        { timeout: 8000 }
      );
      return response.data as SimilarityServiceResult;
    } catch (error) {
      return null;
    }
  }

  static async detectAIWriting(text: string): Promise<AIDetectionServiceResult | null> {
    try {
      const response = await axios.post(
        `${config.aiServiceUrl}/ai-detection`,
        { text },
        { timeout: 8000 }
      );
      return response.data as AIDetectionServiceResult;
    } catch (error) {
      return null;
    }
  }
}

export default AIMicroserviceClient;
