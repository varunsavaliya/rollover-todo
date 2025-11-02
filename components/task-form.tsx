"use client"

import type React from "react"
import { useState } from "react"
import { useTodo } from "@/contexts/todo-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"

interface TaskFormProps {
  projectId: string
  assignedDate: string // Changed from dueDate to assignedDate
  onClose: () => void
}

export default function TaskForm({ projectId, assignedDate, onClose }: TaskFormProps) {
  const { addTask } = useTodo()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      addTask(projectId, title, description, assignedDate) // Pass assignedDate instead of dueDate
      setTitle("")
      setDescription("")
      onClose()
    }
  }

  return (
    <Card className="p-4 bg-secondary/50 border border-primary/20">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          placeholder="Task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-sm"
          autoFocus
        />
        <Textarea
          placeholder="Add description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="text-sm min-h-20"
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={!title.trim()} className="flex-1 gap-2" size="sm">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
          <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent" size="sm">
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}
