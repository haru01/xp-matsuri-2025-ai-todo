import React from 'react';
import type { Todo } from '../types/todo';
import styles from './TodoItem.module.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  const handleToggle = () => {
    onToggle(todo.id);
  };

  const handleDelete = () => {
    if (window.confirm('このTODOを削除しますか？')) {
      onDelete(todo.id);
    }
  };

  return (
    <li className={styles.todoItem}>
      <div className={styles.todoContent}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          className={styles.checkbox}
        />
        <span className={`${styles.title} ${todo.completed ? styles.completed : ''}`}>
          {todo.title}
        </span>
      </div>
      <button
        onClick={handleDelete}
        className={styles.deleteButton}
        aria-label="削除"
      >
        ✕
      </button>
    </li>
  );
};