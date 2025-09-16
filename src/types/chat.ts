export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  streaming?: boolean;
}

export interface ChatState {
  messages: ChatMessage[];
  isConnected: boolean;
  isTyping: boolean;
  error: string | null;
}

export interface LLMResponse {
  id: string;
  content: string;
  done: boolean;
}