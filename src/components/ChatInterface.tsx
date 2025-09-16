import { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { useChat } from '../hooks/useChat';
import styles from './ChatInterface.module.css';

export function ChatInterface() {
  const {
    messages,
    isConnected,
    isTyping,
    error,
    sendMessage
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={styles.chatInterface}>
      <div className={styles.header}>
        <h3>AI Assistant</h3>
        <div className={`${styles.status} ${isConnected ? styles.connected : styles.disconnected}`}>
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
      </div>

      <div className={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <p>👋 Hello! I can help you manage your TODOs.</p>
            <p>Try asking:</p>
            <ul>
              <li>"What tasks do I have?"</li>
              <li>"Add a new task: Buy groceries"</li>
              <li>"Mark the first task as complete"</li>
              <li>"Show my progress report"</li>
            </ul>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}

        {isTyping && (
          <div className={styles.typingIndicator}>
            <span>AI is typing</span>
            <span className={styles.dots}>...</span>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            Error: {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        onSendMessage={sendMessage}
        disabled={!isConnected}
        placeholder={isConnected ? "Ask about your TODOs..." : "Connecting..."}
      />
    </div>
  );
}