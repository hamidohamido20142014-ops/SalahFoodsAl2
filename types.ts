export enum IngredientStatus {
  SAFE = "SAFE",
  WARNING = "WARNING",
  DANGER = "DANGER",
  UNKNOWN = "UNKNOWN"
}

export interface Ingredient {
  name: string;
  status: IngredientStatus;
  description: string;
}

export interface AnalysisResult {
  productName: string;
  productType: "Food" | "Cosmetic" | "Other";
  ingredients: Ingredient[];
  summary: string;
  overallScore: number; // 0 to 100
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  result: AnalysisResult | null;
  imageSrc: string | null;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  result: AnalysisResult;
}