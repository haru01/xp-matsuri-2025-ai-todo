import React, { useState, FormEvent } from 'react';
import type { CreateTodoInput } from '../types/todo';
import styles from './AddTodoForm.module.css';

interface AddTodoFormProps {
  onAdd: (input: CreateTodoInput) => Promise<any>;
}

export const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    setIsSubmitting(true);
    try {
      await onAdd({ title: trimmedTitle });
      setTitle('');
    } catch (error) {
      console.error('Failed to add todo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="新しいTODOを入力..."
        className={styles.input}
        disabled={isSubmitting}
        maxLength={100}
      />
      <button
        type="submit"
        disabled={!title.trim() || isSubmitting}
        className={styles.button}
      >
        {isSubmitting ? '追加中...' : '追加'}
      </button>
    </form>
  );
};