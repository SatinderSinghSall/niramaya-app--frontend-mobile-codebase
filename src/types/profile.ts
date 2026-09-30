export type ThemePreference = "system" | "light" | "dark";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationSettings {
  enabled: boolean;
  goalReminders: boolean;
  progressReminders: boolean;
  consultationUpdates: boolean;
  wellnessReminders: boolean;
}

export interface ReminderSettings {
  enabled: boolean;
  preferredTime: string;
}

export interface AppearanceSettings {
  theme: ThemePreference;
}

export interface PrivacySettings {
  analyticsEnabled: boolean;
}

export interface PreferenceSettings {
  language: string;
  timezone: string;
}

export interface UserSettings {
  _id?: string;
  user: string;
  notifications: NotificationSettings;
  reminders: ReminderSettings;
  appearance: AppearanceSettings;
  privacy: PrivacySettings;
  preferences: PreferenceSettings;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phone?: string | null;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateSettingsPayload {
  notifications?: Partial<NotificationSettings>;
  reminders?: Partial<ReminderSettings>;
  appearance?: Partial<AppearanceSettings>;
  privacy?: Partial<PrivacySettings>;
  preferences?: Partial<PreferenceSettings>;
}

export interface DeleteAccountPayload {
  password: string;
}
