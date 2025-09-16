import { useEffect, useCallback, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { useChatContext } from '../contexts/ChatContext';
import { useTodos } from './useTodos';
import { socketSingleton } from '../utils/socketSingleton';

export function useChat() {
  const context = useChatContext();
  const socketRef = useRef<Socket | null>(null);
  const currentStreamingMessageIdRef = useRef<string | null>(null);

  const { todos } = useTodos();
  const { addMessage, updateMessage, setTyping, setConnected, setError } = context;

  // Store latest functions in refs to avoid stale closures
  const addMessageRef = useRef(addMessage);
  const updateMessageRef = useRef(updateMessage);
  const setTypingRef = useRef(setTyping);
  const setConnectedRef = useRef(setConnected);
  const setErrorRef = useRef(setError);

  // Update refs when functions change
  useEffect(() => {
    addMessageRef.current = addMessage;
    updateMessageRef.current = updateMessage;
    setTypingRef.current = setTyping;
    setConnectedRef.current = setConnected;
    setErrorRef.current = setError;
  });

  // Initialize socket connection
  useEffect(() => {
    const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3002';

    // Use singleton to prevent multiple connections
    if (socketRef.current) {
      return;
    }

    socketRef.current = socketSingleton.getInstance(WS_URL);

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      setConnectedRef.current(true);
      setErrorRef.current(null);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setConnectedRef.current(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setConnectedRef.current(false);
      setErrorRef.current('Failed to connect to chat server');
    });

    socket.on('chat_response_start', () => {
      setTypingRef.current(true);
      // Add placeholder message for streaming and save its ID
      const placeholderMessage = {
        type: 'assistant' as const,
        content: '',
        streaming: true,
      };
      currentStreamingMessageIdRef.current = addMessageRef.current(placeholderMessage);
    });

    socket.on('chat_response_chunk', (data: { id: string; content: string; chunk: string }) => {
      if (currentStreamingMessageIdRef.current) {
        updateMessageRef.current(currentStreamingMessageIdRef.current, data.content);
      }
    });

    socket.on('chat_response_end', (data: { id: string; content: string }) => {
      setTypingRef.current(false);
      if (currentStreamingMessageIdRef.current) {
        updateMessageRef.current(currentStreamingMessageIdRef.current, data.content);
        currentStreamingMessageIdRef.current = null;
      }
    });

    socket.on('chat_error', (error: { message: string }) => {
      setTypingRef.current(false);
      setErrorRef.current(error.message);
      currentStreamingMessageIdRef.current = null;
    });

    return () => {
      // Don't disconnect the singleton socket on unmount
      // Only remove local reference
      socketRef.current = null;
    };
  }, []); // Empty dependency array to run only once

  const sendMessage = useCallback((message: string) => {
    if (!socketRef.current || !socketRef.current.connected) {
      setError('Not connected to chat server');
      return;
    }

    // Add user message to chat
    addMessage({
      type: 'user',
      content: message,
    });

    // Send message with TODO context
    socketRef.current.emit('chat_message', {
      message,
      context: {
        todos: todos,
        timestamp: new Date().toISOString(),
      },
    });

    setError(null);
  }, [addMessage, todos, setError]);

  return {
    ...context,
    sendMessage,
  };
}