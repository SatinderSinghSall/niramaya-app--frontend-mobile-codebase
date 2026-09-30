export type GoalStatus = "active" | "paused" | "completed" | "cancelled";

export type GoalCategory =
  | "sleep"
  | "stress_management"
  | "fitness"
  | "flexibility"
  | "strength"
  | "weight_management"
  | "digestion"
  | "energy"
  | "mental_wellbeing"
  | "mobility"
  | "skin_wellness"
  | "hair_wellness"
  | "general_wellbeing"
  | "other";

export interface GoalTarget {
  value?: number | null;
  unit?: string | null;
  description?: string | null;
}

export interface GoalMilestone {
  title: string;
  targetValue?: number | null;
  completed?: boolean;
}

export interface Goal {
  _id: string;
  user: string;
  title: string;
  description?: string | null;
  category: GoalCategory;
  target?: GoalTarget | null;
  currentValue: number;
  progressPercentage: number;
  startDate: string;
  targetDate?: string | null;
  status: GoalStatus;
  completedAt?: string | null;
  milestones?: GoalMilestone[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateGoalPayload {
  title: string;
  description?: string;
  category: GoalCategory;
  target?: GoalTarget;
  currentValue?: number;
  startDate: string;
  targetDate?: string;
  milestones?: GoalMilestone[];
}

export interface UpdateGoalPayload {
  title?: string;
  description?: string;
  category?: GoalCategory;
  target?: GoalTarget;
  startDate?: string;
  targetDate?: string;
  milestones?: GoalMilestone[];
}

export interface UpdateGoalProgressPayload {
  currentValue: number;
  progressPercentage?: number;
}
