import { createContext, useContext, useReducer, ReactNode } from 'react';
import { ChatMessage, ChatState } from '../types/chat';

interface ChatContextType extends ChatState {
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => string;
  updateMessage: (id: string, content: string) => void;
  setTyping: (isTyping: boolean) => void;
  setConnected: (isConnected: boolean) => void;
  setError: (error: string | null) => void;
  clearMessages: () => void;
}

type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: Omit<ChatMessage, 'id' | 'timestamp'> & { generatedId: string } }
  | { type: 'UPDATE_MESSAGE'; payload: { id: string; content: string } }
  | { type: 'SET_TYPING'; payload: boolean }
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_MESSAGES' };

const initialState: ChatState = {
  messages: [],
  isConnected: false,
  isTyping: false,
  error: null,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            ...action.payload,
            id: action.payload.generatedId,
            timestamp: new Date(),
          },
        ],
      };

    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.id === action.payload.id
            ? { ...msg, content: action.payload.content, streaming: false }
            : msg
        ),
      };

    case 'SET_TYPING':
      return { ...state, isTyping: action.payload };

    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'CLEAR_MESSAGES':
      return { ...state, messages: [] };

    default:
      return state;
  }
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const generatedId = Math.random().toString(36).slice(2);
    dispatch({ type: 'ADD_MESSAGE', payload: { ...message, generatedId } });
    return generatedId;
  };

  const updateMessage = (id: string, content: string) => {
    dispatch({ type: 'UPDATE_MESSAGE', payload: { id, content } });
  };

  const setTyping = (isTyping: boolean) => {
    dispatch({ type: 'SET_TYPING', payload: isTyping });
  };

  const setConnected = (isConnected: boolean) => {
    dispatch({ type: 'SET_CONNECTED', payload: isConnected });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const clearMessages = () => {
    dispatch({ type: 'CLEAR_MESSAGES' });
  };

  return (
    <ChatContext.Provider
      value={{
        ...state,
        addMessage,
        updateMessage,
        setTyping,
        setConnected,
        setError,
        clearMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}