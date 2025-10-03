export interface Todo {
  id: string | number;
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