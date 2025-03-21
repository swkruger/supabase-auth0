"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { TodoProvider, useTodos } from "../contexts/TodoContext";

function AdminTodosContent() {
  const { allTodos, isLoading, addTodo, toggleTodo, deleteTodo } = useTodos();
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  
  // Create a unique list of users from the todos
  const userIds = [...new Set(allTodos.map(todo => todo.userId))];
  
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoTitle.trim() && selectedUserId) {
      addTodo(newTodoTitle.trim(), selectedUserId);
      setNewTodoTitle("");
    }
  };
  
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p className="mb-4 text-muted-foreground">
          As an admin, you can create tasks for any user and manage all tasks in the system.
        </p>
        
        <form onSubmit={handleAddTodo} className="flex gap-2 mb-6">
          <select 
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="p-2 border rounded-md flex-grow-0"
            required
          >
            <option value="">Select User</option>
            {userIds.map(userId => (
              <option key={userId} value={userId}>{userId}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Add a new task for selected user..."
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            className="p-2 border rounded-md flex-grow"
            required
          />
          <button 
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-md"
          >
            Add
          </button>
        </form>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">All User Tasks</h2>
        {userIds.map(userId => (
          <div key={userId} className="mb-8">
            <h3 className="text-lg font-medium mb-2">User: {userId}</h3>
            <div className="border rounded-lg divide-y">
              {allTodos
                .filter(todo => todo.userId === userId)
                .map(todo => (
                  <div 
                    key={todo.id} 
                    className="p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                        className="h-5 w-5"
                      />
                      <span className={`${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {todo.title}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      Delete
                    </button>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  
  // Protect this page - redirect if not authenticated or not admin
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (!isAdmin) {
        router.push("/unauthorized");
      }
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);
  
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!isAuthenticated || !isAdmin) {
    return null; // Will redirect in the useEffect
  }
  
  return (
    <TodoProvider>
      <AdminTodosContent />
    </TodoProvider>
  );
} 