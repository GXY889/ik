
export interface Account {
  id: string;
  title: string;
  username: string;
  password: string;
  category: 'social' | 'banking' | 'work' | 'other';
  color: string;
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string; // Base64 string for image attachment
  timestamp: number;
}

export type ViewState = 'auth' | 'vault' | 'chat';
