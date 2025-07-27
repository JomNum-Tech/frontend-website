export interface TelegramUser {
  id: number;
  username?: string;
  first_name: string;
  last_name?: string;
  is_bot: boolean;
  language_code?: string;
}

export interface TelegramMessage {
  message_id: number;
  from: TelegramUser;
  chat: {
    id: number;
    type: string;
    title?: string;
  };
  date: number;
  text?: string;
  reply_to_message?: TelegramMessage;
}

export interface ActiveUser {
  id: number;
  username?: string;
  first_name: string;
  last_name?: string;
  message_count: number;
  last_active: string;
  avatar_url?: string;
  rank: number;
}

export interface ActivityStats {
  daily: ActiveUser[];
  weekly: ActiveUser[];
  monthly: ActiveUser[];
  total_members: number;
  last_updated: string;
}

export interface TelegramConfig {
  bot_token: string;
  chat_id: string;
  webhook_url?: string;
}