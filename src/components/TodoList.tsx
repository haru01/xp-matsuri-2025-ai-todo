import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TodoItem } from './TodoItem';
import type { Todo } from '../types/todo';
import styles from './TodoList.module.css';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string | number) => Promise<void>;
  onDelete: (id: string | number) => Promise<void>;
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

  const incompleteTodos = todos.filter(todo => !todo.completed).sort((a, b) => a.order - b.order);
  const completedTodos = todos.filter(todo => todo.completed).sort((a, b) => a.order - b.order);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = incompleteTodos.findIndex(todo => todo.id === active.id);
      const newIndex = incompleteTodos.findIndex(todo => todo.id === over.id);

      const reordered = arrayMove(incompleteTodos, oldIndex, newIndex).map((todo, index) => ({
        ...todo,
        order: index,
      }));
      const allTodos = [...reordered, ...completedTodos.map((todo, index) => ({
        ...todo,
        order: reordered.length + index,
      }))];
      onReorder(allTodos);
    }
  };

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