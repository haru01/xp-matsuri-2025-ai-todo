export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface ChatMessage {
  message: string;
  context: {
    todos?: Todo[];
  };
}

export interface ChatResponse {
  id: string;
  content: string;
  chunk?: string;
}

export interface ChatError {
  message: string;
}

export interface ProviderInfo {
  provider: string;
  model: string;
}

export interface ModelWithProviderInfo {
  providerInfo: ProviderInfo;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}