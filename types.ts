
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  skillsToTeach: string[];
  skillsToLearn: string[];
  credits: number;
  bio: string;
  rating: number;
  sessionsCompleted: number;
  blockedUserIds: string[];
}

export interface BarterMatch {
  id: string;
  partner: User;
  skillOffered: string;
  skillRequested: string;
  status: 'pending' | 'accepted' | 'rejected' | 'active' | 'completed';
  scheduledTime?: string;
  requestMessage?: string;
  rejectionReason?: string;
  googleMeetLink?: string;
}

export enum AppScreen {
  LOGIN = 'LOGIN',
  REGISTRATION = 'REGISTRATION',
  MODE_SELECT = 'MODE_SELECT',
  SKILL_SELECT = 'SKILL_SELECT',
  PARTNER_SELECT = 'PARTNER_SELECT',
  SCHEDULING = 'SCHEDULING',
  DASHBOARD = 'DASHBOARD',
  MY_SESSIONS = 'MY_SESSIONS',
  PROFILE = 'PROFILE',
  CREDITS = 'CREDITS',
  SESSION = 'SESSION',
  RATING = 'RATING'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type TerminationType = 'normal' | 'teacher_fault' | 'learner_fault';

export interface SessionStatus {
  isLearning: boolean;
  timeSpentOffTopic: number;
  alertCount: number;
  lastAlertTime: string | null;
  isTerminated: boolean;
  terminationReason?: TerminationType;
}
