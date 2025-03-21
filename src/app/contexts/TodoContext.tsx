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
  allTodos: Todo[]; // Admin can see all todos
  isLoading: boolean;
  addTodo: (title: string, userId?: string) => void; // Admin can create todos for any user
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
};

// Mock initial todos for different users
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
  {
    id: "todo-4",
    userId: "user-2",
    title: "Study Auth0",
    completed: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "todo-5",
    userId: "user-2",
    title: "Implement role-based auth",
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

// Create context with default values
const TodoContext = createContext<TodoContextType>({
  todos: [],
  allTodos: [],
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
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAdmin } = useAuth();

  // Load todos from localStorage
  useEffect(() => {
    // Simulate loading todos
    const timer = setTimeout(() => {
      // Initialize with mock data
      const storedTodos = localStorage.getItem("todos") || JSON.stringify(MOCK_TODOS);
      const parsedTodos = JSON.parse(storedTodos);
      
      setAllTodos(parsedTodos);
      
      // Filter todos for the current user if not admin
      if (user) {
        if (isAdmin) {
          // Admins see all todos
          setTodos(parsedTodos);
        } else {
          // Regular users only see their own todos
          setTodos(parsedTodos.filter((todo: Todo) => todo.userId === user.id));
        }
      } else {
        setTodos([]);
      }
      
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [user, isAdmin]);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("todos", JSON.stringify(allTodos));
    }
  }, [allTodos, isLoading]);

  // Add a new todo
  const addTodo = (title: string, userId?: string) => {
    if (!user) return;
    
    const targetUserId = userId && isAdmin ? userId : user.id;
    
    const newTodo: Todo = {
      id: `todo-${Date.now()}`,
      userId: targetUserId,
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const updatedAllTodos = [newTodo, ...allTodos];
    setAllTodos(updatedAllTodos);
    
    // If the new todo belongs to the current user or user is admin, update their todos
    if (targetUserId === user.id || isAdmin) {
      setTodos(prev => [newTodo, ...prev]);
    }
  };

  // Toggle todo completion status
  const toggleTodo = (id: string) => {
    const updatedAllTodos = allTodos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    
    setAllTodos(updatedAllTodos);
    
    // Update the user's todos view if this todo is in their list
    setTodos(prev => 
      prev.map((todo) => todo.id === id ? { ...todo, completed: !todo.completed } : todo)
    );
  };

  // Delete a todo
  const deleteTodo = (id: string) => {
    const updatedAllTodos = allTodos.filter((todo) => todo.id !== id);
    setAllTodos(updatedAllTodos);
    setTodos(prev => prev.filter((todo) => todo.id !== id));
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        allTodos,
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