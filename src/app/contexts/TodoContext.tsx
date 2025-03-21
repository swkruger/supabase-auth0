"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/lib/supabase";

// Todo type
export type Todo = {
  id: string;
  user_id: string; // Changed from userId to match database column
  title: string;
  completed: boolean;
  created_at: string; // Changed from createdAt to match database column
  updated_at?: string; // Added to match database column
  is_deleted?: boolean; // Added to match database column
};

// Todo context type
type TodoContextType = {
  todos: Todo[];
  allTodos: Todo[]; // Admin can see all todos
  isLoading: boolean;
  addTodo: (title: string, userId?: string) => Promise<void>; // Changed to async
  toggleTodo: (id: string) => Promise<void>; // Changed to async
  deleteTodo: (id: string) => Promise<void>; // Changed to async
};

// Create context with default values
const TodoContext = createContext<TodoContextType>({
  todos: [],
  allTodos: [],
  isLoading: true,
  addTodo: async () => {},
  toggleTodo: async () => {},
  deleteTodo: async () => {},
});

// Custom hook to use todo context
export const useTodos = () => useContext(TodoContext);

// Todo provider component
export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAdmin } = useAuth();

  // Load todos from Supabase via API
  useEffect(() => {
    const fetchTodos = async () => {
      if (!user) {
        setTodos([]);
        setAllTodos([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        const response = await fetch('/api/todos/list');
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error fetching todos:', errorData);
          setIsLoading(false);
          return;
        }
        
        const { todos: fetchedTodos } = await response.json();
        
        setAllTodos(fetchedTodos || []);
        setTodos(fetchedTodos || []);
      } catch (error) {
        console.error('Error fetching todos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, [user, isAdmin]);

  // Add a new todo
  const addTodo = async (title: string, userId?: string) => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/todos/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          userId: userId && isAdmin ? userId : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error adding todo:', errorData);
        return;
      }
      
      const { todo: newTodo } = await response.json();
      
      if (newTodo) {
        // Update state
        const updatedAllTodos = [newTodo, ...allTodos];
        setAllTodos(updatedAllTodos);
        
        // If the new todo belongs to the current user or user is admin, update their todos
        if (newTodo.user_id === user.id || isAdmin) {
          setTodos(prev => [newTodo, ...prev]);
        }
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  // Toggle todo completion status
  const toggleTodo = async (id: string) => {
    try {
      // Find the current todo to get its completed status
      const todo = todos.find(t => t.id === id);
      if (!todo) return;
      
      const response = await fetch('/api/todos/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          completed: !todo.completed,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error toggling todo:', errorData);
        return;
      }
      
      // Update state
      const updatedAllTodos = allTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      
      setAllTodos(updatedAllTodos);
      
      // Update the user's todos view if this todo is in their list
      setTodos(prev => 
        prev.map((todo) => todo.id === id ? { ...todo, completed: !todo.completed } : todo)
      );
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  // Delete a todo (soft delete)
  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch('/api/todos/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error deleting todo:', errorData);
        return;
      }
      
      // Update state
      const updatedAllTodos = allTodos.filter((todo) => todo.id !== id);
      setAllTodos(updatedAllTodos);
      setTodos(prev => prev.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
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