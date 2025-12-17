export interface RelatedPrescription {
  name: string;
  reason: string;
}

export interface Ingredient {
  name: string;
  dosage: string;
  origin: string; // Dao Di origin (e.g. "Sichuan")
  buyingTips: string; // How to pick good quality
}

export interface PrescriptionResult {
  prescriptionName: string;
  ingredients: Ingredient[];
  sourceChapter: string; // e.g., "伤寒论·辨太阳病脉证并治"
  originalText: string;
  translation: string;
  usageMethod: string;
  precautions: string;
  pharmacology: string;
  matchedSymptoms: string; // Specific reason for this single prescription
  relatedPrescriptions?: RelatedPrescription[]; 
}

export interface ConsultationResult {
  symptomAnalysis: string; // Brief analysis of the user's input (TCM diagnosis)
  prescriptions: PrescriptionResult[]; // List of 2-3 generated options from different books
  comparison: string; // Text comparing the pros/cons/differences of the generated prescriptions
  recommendation: string; // Final recommendation and reasoning
}

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

export enum QueryStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}