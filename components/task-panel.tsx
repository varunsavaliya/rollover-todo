"use client"

import type React from "react"

import { useTodo } from "@/contexts/todo-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import CompletedTaskCard from "./completed-task-card"
import TaskAccordion from "./task-accordion"
import { Plus, RotateCw } from "lucide-react"
import { useState } from "react"

interface TaskPanelProps {
  selectedDate: string
  selectedProjectId: string
}

export default function TaskPanel({ selectedDate, selectedProjectId }: TaskPanelProps) {
  const { getTasksByDate, getProjectById, getCompletedTasksByDate, manualRollover, projects, lastRolloverTime } =
    useTodo()
  const [showForm, setShowForm] = useState(false)

  const tasksForDate = getTasksByDate(selectedDate)
  const completedTasks = getCompletedTasksByDate(selectedDate)
  const activeProjects = projects.filter((p) => !p.archived)

  return (
    <div className="h-full flex flex-col p-4 md:p-6 space-y-4">
      {/* Header with Rollover and New Task buttons */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-foreground [font-family:var(--font-heading)]">Tasks by Project</h2>
          {lastRolloverTime && <p className="text-xs text-muted-foreground mt-1">Last rollover: {lastRolloverTime}</p>}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.log("[v0] Manual rollover button clicked")
              manualRollover()
            }}
            title="Manually trigger task rollover"
            className="gap-2 bg-transparent text-xs"
          >
            <RotateCw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Rollover</span>
          </Button>
          <Button onClick={() => setShowForm(true)} className="gap-2" size="sm">
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New Task</span>
          </Button>
        </div>
      </div>

      {/* Pending Tasks Accordion by Project */}
      <div className="flex-1 overflow-auto space-y-2 pr-2">
        {tasksForDate.length === 0 ? (
          <Card className="p-8 text-center bg-secondary/50 border-dashed">
            <p className="text-muted-foreground mb-4 text-sm">No pending tasks for today</p>
          </Card>
        ) : (
          activeProjects.map((project) => (
            <TaskAccordion
              key={project.id}
              project={project}
              tasks={tasksForDate.filter((t) => t.projectId === project.id)}
            />
          ))
        )}
      </div>

      {/* Task Form Dialog */}
      {showForm && <TaskFormDialog onClose={() => setShowForm(false)} selectedDate={selectedDate} />}

      {/* Completed Tasks Summary */}
      {completedTasks.length > 0 && (
        <div className="border-t border-border pt-3">
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
            Completed Today ({completedTasks.length})
          </p>
          <div className="space-y-2 max-h-32 overflow-auto">
            {completedTasks.map((task) => (
              <CompletedTaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function TaskFormDialog({ onClose, selectedDate }: { onClose: () => void; selectedDate: string }) {
  const { projects, addTask } = useTodo()
  const [selectedProject, setSelectedProject] = useState(projects.find((p) => !p.archived)?.id || "")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const activeProjects = projects.filter((p) => !p.archived)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && selectedProject) {
      addTask(selectedProject, title, description, selectedDate)
      setTitle("")
      setDescription("")
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-4 [font-family:var(--font-heading)]">Create New Task</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Select Project</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
            >
              {activeProjects.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-medium mb-2 block">Task Title</label>
            <input
              type="text"
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <textarea
              placeholder="Enter task description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm min-h-16"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-3">
            <Button type="submit" disabled={!title.trim() || !selectedProject} className="flex-1 text-sm">
              Add Task
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 text-sm bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
