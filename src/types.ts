
export enum SentimentType {
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE',
  NEUTRAL = 'NEUTRAL'
}

export interface WeiboPost {
  id: string;
  author: string;
  avatar: string;
  content: string;
  time: string;
  sentiment: SentimentType;
  likes: string;
  comments: string;
  isStarred?: boolean;
}

export interface KeywordData {
  name: string;
  frequency: number;
  time: number; // 0-100 for x-axis
  importance: number; // 0-100 for y-axis
  type: SentimentType;
}

export interface SentimentSummary {
  positive: number;
  negative: number;
  neutral: number;
  total: number;
}
