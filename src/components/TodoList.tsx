import React from 'react';
import { TodoItem } from './TodoItem';
import type { Todo } from '../types/todo';
import styles from './TodoList.module.css';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const TodoList: React.FC<TodoListProps> = ({ todos, onToggle, onDelete }) => {
  if (todos.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>TODOがありません</p>
        <p className={styles.hint}>新しいTODOを追加してみましょう！</p>
      </div>
    );
  }

  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <ul className={styles.todoList}>
      {sortedTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};