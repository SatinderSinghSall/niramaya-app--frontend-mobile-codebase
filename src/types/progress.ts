export interface ProgressEntry {
  _id: string;
  user: string;
  date: string;

  mood?: number;
  energyLevel?: number;
  stressLevel?: number;

  sleepHours?: number;
  sleepQuality?: number;

  waterIntakeLiters?: number;

  steps?: number;

  exerciseMinutes?: number;
  yogaMinutes?: number;
  meditationMinutes?: number;

  weightKg?: number;

  notes?: string;

  completedActivities?: string[];

  createdAt?: string;
  updatedAt?: string;
}

export interface ProgressPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProgressHistoryResponse {
  entries: ProgressEntry[];
  pagination: ProgressPagination;
}

export interface ProgressTracking {
  daysTracked: number;

  averageMood: number | null;
  averageEnergyLevel: number | null;
  averageStressLevel: number | null;

  averageSleepHours: number | null;
  averageSleepQuality: number | null;

  averageWaterIntakeLiters: number | null;
  averageSteps: number | null;

  totalExerciseMinutes: number;
  totalYogaMinutes: number;
  totalMeditationMinutes: number;
}

export interface ProgressGoal {
  id: string;
  title: string;
  category?: string;
  progressPercentage: number;
  status: string;
}

export interface ProgressSummary {
  period: {
    startDate: string | null;
    endDate: string | null;
  };

  tracking: ProgressTracking;

  goals: ProgressGoal[];
}

export interface ProgressFormData {
  date?: string;

  mood?: number;
  energyLevel?: number;
  stressLevel?: number;

  sleepHours?: number;
  sleepQuality?: number;

  waterIntakeLiters?: number;

  steps?: number;

  exerciseMinutes?: number;
  yogaMinutes?: number;
  meditationMinutes?: number;

  weightKg?: number;

  notes?: string;

  completedActivities?: string[];
}
