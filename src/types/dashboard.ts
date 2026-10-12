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
  needsCompletion?: boolean;
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

export type GoalStatus = "active" | "paused" | "completed" | "cancelled";

export interface DashboardGoal {
  id: string;
  title: string;
  category?: string;
  target?: number | string;
  currentValue?: number;
  progressPercentage: number;
  status: GoalStatus | string;
  startDate?: string;
  targetDate?: string;
  completedAt?: string | null;
  createdAt?: string;
}

export interface DashboardGoals {
  total: number;
  active: number;
  paused: number;
  completed: number;
  cancelled: number;
  averageProgress: number;
  recent: DashboardGoal[];
  showCreateCTA?: boolean;
}

export interface DashboardConsultant {
  name: string | null;
  specialization: string | null;
}

export interface DashboardConsultation {
  id: string;
  consultationType?: string;
  preferredDate?: string | null;
  preferredTime?: string | null;
  status: string;
  consultant?: DashboardConsultant;
  scheduledAt?: string | null;
  createdAt?: string;
}

export interface DashboardConsultations {
  upcoming: DashboardConsultation[];
  recent: DashboardConsultation[];
  hasUpcoming: boolean;
  hasAny: boolean;
  showBookingCTA: boolean;
}

export interface DashboardProgressEntry {
  id: string;
  date?: string;
  mood?: string | null;
  energyLevel?: string | null;
  stressLevel?: string | null;
  sleepHours?: number | null;
  sleepQuality?: string | null;
  waterIntakeLiters?: number | null;
  steps?: number | null;
  exerciseMinutes?: number | null;
  yogaMinutes?: number | null;
  meditationMinutes?: number | null;
  weightKg?: number | null;
  completedActivities?: string[];
}

export interface DashboardProgress {
  today: DashboardProgressEntry | null;
  recent: DashboardProgressEntry[];
  hasData: boolean;
  hasTodayEntry: boolean;
  showLogCTA: boolean;
}

export interface DashboardAction {
  label?: string;
  type?: string;
  url?: string;
  route?: string;
  [key: string]: unknown;
}

export interface DashboardAnnouncement {
  id: string;
  title: string;
  message?: string;
  type?: string;
  startDate?: string;
  endDate?: string | null;
  action?: DashboardAction | null;
  createdAt?: string;
}

export interface DashboardAnnouncements {
  items: DashboardAnnouncement[];
  hasItems: boolean;
}

export interface DashboardWellnessTip {
  id: string;
  title: string;
  shortDescription?: string;
  category?: string;
  type?: string;
  thumbnailUrl?: string | null;
  image?: {
    url: string | null;
    altText: string | null;
  } | null;
  readTimeMinutes?: number;
  featured?: boolean;
  disclaimer?: string;
  safetyNote?: string | null;
  action?: DashboardAction | null;
  startDate?: string;
}

export interface DashboardWellnessTips {
  items: DashboardWellnessTip[];
  hasItems: boolean;
}

export interface DashboardNotification {
  id: string;
  type?: string;
  title: string;
  message?: string;
  isRead: boolean;
  createdAt?: string;
  action?: DashboardAction | null;
}

export interface DashboardNotifications {
  unreadCount: number;
  recent: DashboardNotification[];
  hasUnread: boolean;
}

export type FavoriteItemType = "yoga" | "ayurveda";

export interface DashboardFavoriteItem {
  id: string;
  title: string;
  shortDescription: string;
  category: string | null;
  type: string | null;
  thumbnailUrl: string | null;
  image: {
    url: string | null;
    altText: string | null;
  } | null;
  isFeatured: boolean;
}

export interface DashboardFavorite {
  id: string;
  itemType: FavoriteItemType;
  itemId: string;
  createdAt?: string;
  itemData: DashboardFavoriteItem | null;
}

export interface DashboardFavorites {
  items: DashboardFavorite[];
  total: number;
  hasItems: boolean;
}

export interface DashboardYogaItem {
  id: string;
  title: string;
  shortDescription: string;
  category: string | null;
  difficulty: string | null;
  thumbnailUrl: string | null;
  isFeatured: boolean;
}

export interface DashboardYoga {
  items: DashboardYogaItem[];
}

export interface DashboardAyurvedaItem {
  id: string;
  title: string;
  shortDescription: string;
  category: string | null;
  type: string | null;
  thumbnailUrl: string | null;
  isFeatured: boolean;
}

export interface DashboardAyurveda {
  items: DashboardAyurvedaItem[];
}

export interface DashboardData {
  user: DashboardUser;
  profile: DashboardProfile;
  healthSnapshot: HealthSnapshot | null;
  goals: DashboardGoals;
  consultations?: DashboardConsultations;
  progress?: DashboardProgress;
  announcements?: DashboardAnnouncements;
  wellnessTips?: DashboardWellnessTips;
  notifications?: DashboardNotifications;
  favorites?: DashboardFavorites;
  yoga?: DashboardYoga;
  ayurveda?: DashboardAyurveda;
}
