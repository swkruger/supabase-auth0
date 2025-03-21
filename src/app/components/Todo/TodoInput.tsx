"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TodoInputProps {
  onAdd: (title: string) => Promise<void>;
}

export function TodoInput({ onAdd }: TodoInputProps) {
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (title.trim() && !isSubmitting) {
      try {
        setIsSubmitting(true);
        await onAdd(title.trim());
        setTitle("");
      } catch (error) {
        console.error('Error adding todo:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1"
        disabled={isSubmitting}
      />
      <Button type="submit" disabled={!title.trim() || isSubmitting}>
        {isSubmitting ? "Adding..." : "Add"}
      </Button>
    </form>
  );
} 