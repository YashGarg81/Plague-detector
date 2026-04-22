import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import pdf from 'pdf-parse';

export class FileProcessor {
  static async extractTextFromPDF(filePath: string): Promise<string> {
    try {
      const fileBuffer = fs.readFileSync(filePath);
      const data = await pdf(fileBuffer);
      return data.text || '';
    } catch (error) {
      throw new Error(`PDF parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async extractTextFromDocx(filePath: string): Promise<string> {
    try {
      const fileBuffer = fs.readFileSync(filePath);
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      return result.value || '';
    } catch (error) {
      throw new Error(`DOCX parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async extractTextFromDoc(filePath: string): Promise<string> {
    // For .doc files, we'll use a basic text extraction
    // In production, use 'libreoffice' CLI conversion or 'doc' parser
    try {
      const fileBuffer = fs.readFileSync(filePath);
      // Extract ASCII text as fallback
      let text = '';
      for (let i = 0; i < fileBuffer.length; i++) {
        const byte = fileBuffer[i];
        if ((byte >= 32 && byte <= 126) || byte === 9 || byte === 10 || byte === 13) {
          text += String.fromCharCode(byte);
        }
      }
      return text.trim() || '';
    } catch (error) {
      throw new Error(`DOC parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async extractText(filePath: string, mimeType: string): Promise<string> {
    const ext = path.extname(filePath).toLowerCase();

    if (mimeType.includes('pdf') || ext === '.pdf') {
      return this.extractTextFromPDF(filePath);
    }

    if (
      mimeType.includes('word') ||
      mimeType.includes('officedocument.wordprocessingml') ||
      ext === '.docx'
    ) {
      return this.extractTextFromDocx(filePath);
    }

    if (mimeType.includes('msword') || ext === '.doc') {
      return this.extractTextFromDoc(filePath);
    }

    throw new Error('Unsupported file format');
  }

  static cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ') // Multiple spaces to single space
      .replace(/\n+/g, '\n') // Multiple newlines to single
      .trim();
  }

  static splitIntoSentences(text: string): string[] {
    // Simple sentence splitting
    return text
      .split(/[.!?]+/)
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence.length > 0);
  }

  static splitIntoParagraphs(text: string): string[] {
    return text
      .split(/\n\n+/)
      .map((paragraph) => paragraph.trim())
      .filter((paragraph) => paragraph.length > 0);
  }
}

export default FileProcessor;
