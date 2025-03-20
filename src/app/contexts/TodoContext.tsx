"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

// Todo type
export type Todo = {
  id: string;
  userId: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

// Todo context type
type TodoContextType = {
  todos: Todo[];
  isLoading: boolean;
  addTodo: (title: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
};

// Mock initial todos
const MOCK_TODOS: Todo[] = [
  {
    id: "todo-1",
    userId: "user-1",
    title: "Learn Next.js",
    completed: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "todo-2",
    userId: "user-1",
    title: "Build a Todo app",
    completed: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "todo-3",
    userId: "user-1",
    title: "Deploy to production",
    completed: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Create context with default values
const TodoContext = createContext<TodoContextType>({
  todos: [],
  isLoading: true,
  addTodo: () => {},
  toggleTodo: () => {},
  deleteTodo: () => {},
});

// Custom hook to use todo context
export const useTodos = () => useContext(TodoContext);

// Todo provider component
export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load todos from localStorage
  useEffect(() => {
    if (user) {
      // Simulate loading todos
      const timer = setTimeout(() => {
        const storedTodos = localStorage.getItem(`todos-${user.id}`);
        if (storedTodos) {
          setTodos(JSON.parse(storedTodos));
        } else {
          // Initialize with mock data
          setTodos(MOCK_TODOS);
          localStorage.setItem(`todos-${user.id}`, JSON.stringify(MOCK_TODOS));
        }
        setIsLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setTodos([]);
      setIsLoading(false);
    }
  }, [user]);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    if (user && !isLoading) {
      localStorage.setItem(`todos-${user.id}`, JSON.stringify(todos));
    }
  }, [todos, user, isLoading]);

  // Add a new todo
  const addTodo = (title: string) => {
    if (!user) return;
    
    const newTodo: Todo = {
      id: `todo-${Date.now()}`,
      userId: user.id,
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTodos([newTodo, ...todos]);
  };

  // Toggle todo completion status
  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Delete a todo
  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        isLoading,
        addTodo,
        toggleTodo,
        deleteTodo,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
} 