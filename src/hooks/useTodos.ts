import { useState, useEffect, useCallback } from 'react';
import { todoApi } from '../api/todoApi';
import type { Todo, CreateTodoInput, UpdateTodoInput } from '../types/todo';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await todoApi.getAll();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('TODOの取得に失敗しました');
      console.error('Failed to fetch todos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTodo = useCallback(async (input: CreateTodoInput) => {
    try {
      const newTodo = await todoApi.create(input);
      setTodos(prev => [...prev, newTodo]);
      return newTodo;
    } catch (err) {
      setError('TODOの追加に失敗しました');
      console.error('Failed to add todo:', err);
      throw err;
    }
  }, []);

  const updateTodo = useCallback(async (id: string | number, input: UpdateTodoInput) => {
    try {
      const updatedTodo = await todoApi.update(id, input);
      setTodos(prev => prev.map(todo =>
        todo.id === id ? updatedTodo : todo
      ));
      return updatedTodo;
    } catch (err) {
      setError('TODOの更新に失敗しました');
      console.error('Failed to update todo:', err);
      throw err;
    }
  }, []);

  const deleteTodo = useCallback(async (id: string | number) => {
    try {
      await todoApi.delete(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      setError('TODOの削除に失敗しました');
      console.error('Failed to delete todo:', err);
      throw err;
    }
  }, []);

  const toggleTodo = useCallback(async (id: string | number) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      await updateTodo(id, { completed: !todo.completed });
    }
  }, [todos, updateTodo]);

  const reorderTodos = useCallback(async (reorderedTodos: Todo[]) => {
    try {
      const previousTodos = [...todos];
      setTodos(reorderedTodos);

      const updates = reorderedTodos.map((todo, index) => ({
        id: String(todo.id),
        order: index,
      }));
      await todoApi.reorderAll(updates);
    } catch (err) {
      setTodos(todos);
      setError('TODOの並び替えに失敗しました');
      console.error('Failed to reorder todos:', err);
      throw err;
    }
  }, [todos]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    reorderTodos,
    refetch: fetchTodos,
  };
};