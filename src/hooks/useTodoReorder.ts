import { useCallback } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import type { Todo } from '../types/todo';
import { updateTodoOrders } from '../utils/todoHelpers';

/**
 * ドラッグ&ドロップによるTODO並び替えロジックを提供するカスタムフック
 */
export const useTodoReorder = (
  incompleteTodos: Todo[],
  completedTodos: Todo[],
  onReorder: (todos: Todo[]) => Promise<void>
) => {
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) return;

      const oldIndex = incompleteTodos.findIndex(todo => todo.id === active.id);
      const newIndex = incompleteTodos.findIndex(todo => todo.id === over.id);

      // 未完了TODOを並び替えてorder値を更新
      const reorderedIncomplete = updateTodoOrders(
        arrayMove(incompleteTodos, oldIndex, newIndex)
      );

      // 完了済みTODOのorder値を更新（未完了TODOの後に続く）
      const reorderedCompleted = updateTodoOrders(
        completedTodos,
        reorderedIncomplete.length
      );

      onReorder([...reorderedIncomplete, ...reorderedCompleted]);
    },
    [incompleteTodos, completedTodos, onReorder]
  );

  return { handleDragEnd };
};
