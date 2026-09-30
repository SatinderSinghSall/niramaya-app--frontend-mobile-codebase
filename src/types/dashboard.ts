export interface DashboardUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface DashboardProfile {
  exists: boolean;
  completed: boolean;
  completionPercentage: number;
}

export interface HealthSnapshot {
  heightCm: number | null;
  weightKg: number | null;
  energyLevel: string | null;
  digestion: string | null;
  stressLevel: string | null;
  mood: string | null;
  activityLevel: string | null;
  sleepHours: number | null;
  sleepQuality: string | null;
  yogaExperience: string | null;
}

export interface DashboardGoal {
  _id: string;
  title?: string;
  description?: string;
  status: string;
  progressPercentage: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardGoals {
  total: number;
  active: number;
  paused: number;
  completed: number;
  cancelled: number;
  averageProgress: number;
  recent: DashboardGoal[];
}

export interface DashboardData {
  user: DashboardUser;
  profile: DashboardProfile;
  healthSnapshot: HealthSnapshot | null;
  goals: DashboardGoals;
}
