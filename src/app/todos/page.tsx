"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { TodoProvider, useTodos } from "../contexts/TodoContext";
import { TodoList } from "../components/Todo/TodoList";
import { TodoInput } from "../components/Todo/TodoInput";

function TodosContent() {
  const { todos, isLoading, addTodo, toggleTodo, deleteTodo } = useTodos();
  
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">My Tasks</h1>
        <TodoInput onAdd={addTodo} />
      </div>
      
      <TodoList
        todos={todos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
    </div>
  );
}

export default function TodosPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  // Protect this page - redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);
  
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Will redirect in the useEffect
  }
  
  return (
    <TodoProvider>
      <TodosContent />
    </TodoProvider>
  );
} 