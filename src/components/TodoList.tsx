import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TodoItem } from './TodoItem';
import type { Todo, TodoId } from '../types/todo';
import { categorizeTodos } from '../utils/todoHelpers';
import { useTodoReorder } from '../hooks/useTodoReorder';
import styles from './TodoList.module.css';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: TodoId) => Promise<void>;
  onDelete: (id: TodoId) => Promise<void>;
  onReorder: (reorderedTodos: Todo[]) => Promise<void>;
}

export const TodoList: React.FC<TodoListProps> = ({ todos, onToggle, onDelete, onReorder }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (todos.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>TODOがありません</p>
        <p className={styles.hint}>新しいTODOを追加してみましょう！</p>
      </div>
    );
  }

  const { incomplete: incompleteTodos, completed: completedTodos } = categorizeTodos(todos);
  const { handleDragEnd } = useTodoReorder(incompleteTodos, completedTodos, onReorder);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={incompleteTodos.map(todo => todo.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className={styles.todoList}>
          {incompleteTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
          {completedTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
};