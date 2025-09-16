import { ChatMessage as ChatMessageType } from '../types/chat';
import styles from './ChatMessage.module.css';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`${styles.message} ${styles[message.type]}`}>
      <div className={styles.messageHeader}>
        <span className={styles.messageType}>
          {message.type === 'user' ? 'You' : 'AI'}
        </span>
        <span className={styles.timestamp}>
          {message.timestamp.toLocaleTimeString()}
        </span>
      </div>
      <div className={styles.messageContent}>
        {message.content}
        {message.streaming && <span className={styles.cursor}>|</span>}
      </div>
    </div>
  );
}