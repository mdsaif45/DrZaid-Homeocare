import { GoogleGenAI } from '@google/genai';
import { logger } from '../utils/logger.js';

export interface RemedySuggestion {
  remedy_name: string;
  potency: string;
  dosage: string;
  confidence_score: number;
  matching_rubrics: string[];
  rationale: string;
}

export class AiRepertoryService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
    }
  }

  async matchRepertory(symptoms: {
    chief_complaints?: string;
    general_examination?: string;
    mental_state_examination?: string;
    tags?: string[];
  }): Promise<{ suggestions: RemedySuggestion[]; summary: string }> {
    if (this.ai) {
      try {
        const prompt = `
You are an expert Homeopathic Repertory & Materia Medica Assistant.
Analyze the following patient clinical symptoms and suggest candidate homeopathic remedies according to Kent/Boenninghausen repertory principles.

PATIENT SYMPTOMS:
- Chief Complaints: ${symptoms.chief_complaints || 'N/A'}
- Symptom Tags: ${symptoms.tags?.join(', ') || 'N/A'}
- Physical Generals: ${symptoms.general_examination || 'N/A'}
- Mind & Mentals: ${symptoms.mental_state_examination || 'N/A'}

Respond strictly with valid JSON format matching this schema:
{
  "summary": "Brief repertorial synthesis",
  "suggestions": [
    {
      "remedy_name": "Remedy Name (e.g. Pulsatilla nigricans)",
      "potency": "Suggested potency (e.g. 30C, 200C)",
      "dosage": "Suggested dosage (e.g. 4 pills TDS for 5 days)",
      "confidence_score": 92,
      "matching_rubrics": ["Thirstlessness with dry mouth", "Worse from warmth", "Mild, yielding disposition"],
      "rationale": "Key materia medica characteristics matching patient temperament and modalities."
    }
  ]
}
`;

        const response = await this.ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        const text = response.text || '';
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (err) {
        logger.error('Gemini AI Repertory error, falling back to rule-based matcher', err);
      }
    }

    // Fallback Homeopathic Repertory Engine
    return this.getFallbackSuggestions(symptoms);
  }

  private getFallbackSuggestions(symptoms: any): { suggestions: RemedySuggestion[]; summary: string } {
    const text = `${symptoms.chief_complaints || ''} ${symptoms.mental_state_examination || ''} ${symptoms.tags?.join(' ') || ''}`.toLowerCase();

    const candidates: RemedySuggestion[] = [];

    if (text.includes('thirst') || text.includes('warm') || text.includes('fever') || text.includes('mild')) {
      candidates.push({
        remedy_name: 'Pulsatilla nigricans',
        potency: '30C',
        dosage: '4 pills TDS for 7 days',
        confidence_score: 90,
        matching_rubrics: ['Thirstlessness', 'Worse in warm room', 'Mild disposition'],
        rationale: 'Well-indicated for acute inflammatory conditions with changeability and warm aggravation.',
      });
    }

    if (text.includes('anger') || text.includes('chilly') || text.includes('stomach') || text.includes('constipation')) {
      candidates.push({
        remedy_name: 'Nux Vomica',
        potency: '200C',
        dosage: '4 pills HS for 5 days',
        confidence_score: 86,
        matching_rubrics: ['Irritability & oversensitivity', 'Gastric disturbances', 'Chilly patient'],
        rationale: 'Suited for sedentary habits, digestive distress, and over-sensitivity to stimuli.',
      });
    }

    if (candidates.length === 0) {
      candidates.push({
        remedy_name: 'Sulphur',
        potency: '30C',
        dosage: '4 pills OD for 7 days',
        confidence_score: 82,
        matching_rubrics: ['Constitutional anti-psoric', 'Burning sensations', 'Standing aggravates'],
        rationale: 'Indicated as a deep-acting constitutional remedy when symptoms are less defined.',
      });
    }

    return {
      summary: 'Repertorial analysis based on key modalities and symptom rubrics.',
      suggestions: candidates,
    };
  }
}
