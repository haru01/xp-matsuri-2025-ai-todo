import { TodoList } from './components/TodoList';
import { AddTodoForm } from './components/AddTodoForm';
import { ChatInterface } from './components/ChatInterface';
import { useTodos } from './hooks/useTodos';
import { ChatProvider } from './contexts/ChatContext';
import './App.css';

function App() {
  const {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
  } = useTodos();

  return (
    <ChatProvider>
      <div className="app">
        <header className="app-header">
          <h1>TODO App</h1>
          <p className="subtitle">React + TypeScript + AI Assistant</p>
        </header>

        <main className="app-main">
          <div className="app-content">
            <div className="todo-section">
              <AddTodoForm onAdd={addTodo} />

              {loading && (
                <div className="loading">
                  <p>読み込み中...</p>
                </div>
              )}

              {error && (
                <div className="error">
                  <p>{error}</p>
                </div>
              )}

              {!loading && !error && (
                <>
                  <div className="stats">
                    <span>全体: {todos.length}</span>
                    <span>完了: {todos.filter(t => t.completed).length}</span>
                    <span>未完了: {todos.filter(t => !t.completed).length}</span>
                  </div>
                  <TodoList
                    todos={todos}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                  />
                </>
              )}
            </div>

            <div className="chat-section">
              <ChatInterface />
            </div>
          </div>
        </main>
      </div>
    </ChatProvider>
  );
}

export default App;