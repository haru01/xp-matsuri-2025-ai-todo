export type TodoId = string;

export interface Todo {
  id: TodoId;
  title: string;
  completed: boolean;
  createdAt: string;
  order: number;
}

export interface CreateTodoInput {
  title: string;
}

export interface UpdateTodoInput {
  title?: string;
  completed?: boolean;
}

export interface TodoHandlers {
  onToggle: (id: TodoId) => Promise<void>;
  onDelete: (id: TodoId) => Promise<void>;
  onReorder?: (todos: Todo[]) => Promise<void>;
}