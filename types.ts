
export interface Category {
  id: string;
  name: string;
  value: boolean;
}

export interface MonthlyData {
  month: number;
  score: number; // 0 - 100
  title: string; // 이달의 제목
  note: string;
  images: string[];
  categories: Category[];
  achievements: string[];
  frequentPeople?: string; // 자주 만난 사람
  frequentPlaces?: string; // 자주 간 장소
  gratitude?: string;     // 감사한 점
  regret?: string;        // 아쉬운 점
  improvement?: string;   // 개선할 점
}

export interface YearlyInsight {
  summary: string;
  detailedAnalysis: string;
  profoundLesson: string;
  keyThemes: string[];
  advice: string;
  scoreTrend: string;
}

export interface AppState {
  year: number;
  data: MonthlyData[];
}
