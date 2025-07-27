export interface CommunityUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  emailAddress: string;
  imageUrl: string;
  username?: string;
  activity_score: number;
  last_active: string;
  rank: number;
  role: string;
  join_date: string;
  total_logins: number;
  recent_activity: {
    daily_logins: number;
    weekly_logins: number;
    monthly_logins: number;
  };
}

export interface CommunityStats {
  daily: CommunityUser[];
  weekly: CommunityUser[];
  monthly: CommunityUser[];
  total_members: number;
  active_today: number;
  active_this_week: number;
  active_this_month: number;
  last_updated: string;
}

export interface UserActivity {
  user_id: string;
  activity_type: 'login' | 'profile_update' | 'file_upload' | 'page_visit';
  activity_date: string;
  metadata?: Record<string, unknown>;
}