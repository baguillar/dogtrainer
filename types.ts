
export type UserRole = 'admin' | 'user';
export type SubscriptionLevel = 'none' | 'basic' | 'premium';
export type Frequency = '1-2' | '3-4' | 'daily';
export type UserStatus = 'pending_payment' | 'pending_form' | 'active';

export interface ExerciseTemplate {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  category: string;
  duration: string;
}

export interface DogProfile {
  dogName?: string;
  breed?: string;
  birthDate?: string;
  gender?: 'macho' | 'hembra';
  isCastrated?: boolean;
  energyLevel?: 'muy baja' | 'baja' | 'media' | 'alta' | 'extrema';
  healthIssues?: string;
  behaviorProblems?: string[];
  currentLevel?: 'nada' | 'basico' | 'intermedio' | 'avanzado';
  goals?: string;
  updatedAt?: string;
  preferredDaysNextWeek?: number[];
  ownerEmail?: string;
  ownerName?: string;
  ownerPhone?: string;
  adminComments?: string; // Solo visible si el admin escribe algo
}

export interface Exercise extends ExerciseTemplate {
  completed: boolean;
  feedback?: string;
  customNotes?: string;
}

export interface DayPlan {
  date: string;
  exercises: Exercise[];
  isRestDay: boolean;
}

// Estructura para MariaDB: La tabla 'plans' tendría user_email, week_id y json_data
export interface UserData {
  email: string;
  role: UserRole;
  subscription: SubscriptionLevel;
  status: UserStatus;
  dogName?: string;
  frequency?: Frequency;
  profile?: DogProfile;
  plan?: DayPlan[]; // En producción esto vendría filtrado por semana
  hasLivePassForNextTuesday?: boolean;
  pendingSubscriptionChange?: {
    targetLevel: SubscriptionLevel;
    effectiveDate: string;
  };
}

export interface UserState {
  currentUser: UserData | null;
  onboardingStep: 'login' | 'signup' | 'payment' | 'form' | 'active';
  activeView: 'dashboard' | 'profile' | 'admin';
}

export const EXERCISE_LIBRARY_KEY = 'guau_exercise_library';
export const USERS_DB_KEY = 'guau_users_db';
