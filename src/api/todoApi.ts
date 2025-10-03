import axios from 'axios';
import type { Todo, TodoId, CreateTodoInput, UpdateTodoInput } from '../types/todo';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const todoApi = {
  async getAll(): Promise<Todo[]> {
    const response = await api.get<Todo[]>('/todos');
    return response.data;
  },

  async create(input: CreateTodoInput): Promise<Todo> {
    const newTodo = {
      ...input,
      completed: false,
      createdAt: new Date().toISOString(),
      order: 0,
    };
    const response = await api.post<Todo>('/todos', newTodo);
    return response.data;
  },

  async update(id: TodoId, input: UpdateTodoInput): Promise<Todo> {
    const response = await api.patch<Todo>(`/todos/${id}`, input);
    return response.data;
  },

  async delete(id: TodoId): Promise<void> {
    await api.delete(`/todos/${id}`);
  },

  async reorderAll(todos: { id: string; order: number }[]): Promise<void> {
    await Promise.all(
      todos.map(todo => api.patch(`/todos/${todo.id}`, { order: todo.order }))
    );
  },
};