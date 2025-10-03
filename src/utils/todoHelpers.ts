import type { Todo } from '../types/todo';

/**
 * TODOリストを未完了と完了済みに分類し、order順にソートする
 */
export const categorizeTodos = (todos: Todo[]) => {
  const incomplete = todos
    .filter(todo => !todo.completed)
    .sort((a, b) => a.order - b.order);

  const completed = todos
    .filter(todo => todo.completed)
    .sort((a, b) => a.order - b.order);

  return { incomplete, completed };
};

/**
 * TODOリストの各アイテムにorder値を設定する
 * @param todos - 順序を更新するTODOリスト
 * @param startOrder - 開始order値（デフォルト: 0）
 */
export const updateTodoOrders = (todos: Todo[], startOrder = 0): Todo[] => {
  return todos.map((todo, index) => ({
    ...todo,
    order: startOrder + index
  }));
};
