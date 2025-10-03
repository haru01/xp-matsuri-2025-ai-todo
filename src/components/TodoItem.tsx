import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Todo, TodoId } from '../types/todo';
import styles from './TodoItem.module.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: TodoId) => Promise<void>;
  onDelete: (id: TodoId) => Promise<void>;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: todo.id,
    disabled: todo.completed,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleToggle = () => {
    onToggle(todo.id);
  };

  const handleDelete = () => {
    if (window.confirm('このTODOを削除しますか？')) {
      onDelete(todo.id);
    }
  };

  return (
    <li ref={setNodeRef} style={style} className={styles.todoItem}>
      <div className={styles.todoContent}>
        {!todo.completed && (
          <button
            className={styles.dragHandle}
            {...attributes}
            {...listeners}
            aria-label="ドラッグして並び替え"
          >
            ⋮⋮
          </button>
        )}
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