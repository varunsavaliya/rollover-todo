"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Task {
  id: string
  projectId: string
  title: string
  description: string
  completed: boolean
  assignedDate: string
  rolloverCount: number
  createdAt: string
  completedAt?: string
  lastRolledOverDate?: string
}

export interface Project {
  id: string
  name: string
  archived: boolean
  createdAt: string
}

interface TodoContextType {
  projects: Project[]
  tasks: Task[]
  addProject: (name: string) => void
  archiveProject: (id: string) => void
  deleteProject: (id: string) => void
  addTask: (projectId: string, title: string, description: string, assignedDate: string) => void
  deleteTask: (id: string) => void
  toggleTaskComplete: (id: string) => void
  moveTask: (taskId: string, newProjectId: string) => void
  getTasksByDate: (date: string) => Task[]
  getCompletedTasksByDate: (date: string) => Task[]
  getProjectById: (id: string) => Project | undefined
  getTasksByProject: (projectId: string, date: string) => Task[]
  getIncompleteTasksByProject: (projectId: string) => Task[]
  checkAndRolloverTasks: () => void
  manualRollover: () => void
  lastRolloverTime: string
}

const TodoContext = createContext<TodoContextType | undefined>(undefined)

const STORAGE_KEY = "todo_app_data"

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [lastRolloverDate, setLastRolloverDate] = useState<string>("")
  const [lastRolloverTime, setLastRolloverTime] = useState<string>("")
  const [isInitialized, setIsInitialized] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const {
          projects: storedProjects,
          tasks: storedTasks,
          lastRolloverDate: storedDate,
          lastRolloverTime: storedTime,
        } = JSON.parse(stored)
        setProjects(storedProjects)
        setTasks(storedTasks)
        const today = new Date().toISOString().split("T")[0]
        setLastRolloverDate(storedDate || today)
        setLastRolloverTime(storedTime || "")
      } catch (error) {
        console.log("[v0] Error parsing stored data:", error)
      }
    } else {
      // Initialize with default project
      const defaultProject: Project = {
        id: "default-" + Date.now(),
        name: "My Tasks",
        archived: false,
        createdAt: new Date().toISOString(),
      }
      setProjects([defaultProject])
      const today = new Date().toISOString().split("T")[0]
      setLastRolloverDate(today)
    }
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (!isInitialized) return

    const checkRollover = () => {
      const today = new Date().toISOString().split("T")[0]
      if (lastRolloverDate !== today) {
        console.log("[v0] Auto rollover triggered. Today:", today, "Last rollover:", lastRolloverDate)
        performRollover(today)
      }
    }

    checkRollover()
    const interval = setInterval(checkRollover, 60000)
    return () => clearInterval(interval)
  }, [lastRolloverDate, isInitialized])

  // Save to localStorage whenever projects or tasks change
  useEffect(() => {
    if (!isInitialized) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ projects, tasks, lastRolloverDate, lastRolloverTime }))
  }, [projects, tasks, lastRolloverDate, lastRolloverTime, isInitialized])

  const performRollover = (today: string) => {
    const todayDate = new Date(today + "T00:00:00Z")
    const yesterdayDate = new Date(todayDate.getTime() - 86400000)
    const yesterday = yesterdayDate.toISOString().split("T")[0]

    console.log("[v0] Performing rollover. Today:", today, "Yesterday:", yesterday)

    const updatedTasks = tasks.map((task) => {
      if (task.assignedDate === yesterday && !task.completed && task.lastRolledOverDate !== today) {
        console.log("[v0] Rolling over task:", task.title, "Old count:", task.rolloverCount)
        return {
          ...task,
          assignedDate: today,
          rolloverCount: task.rolloverCount + 1,
          lastRolledOverDate: today,
        }
      }
      return task
    })

    const now = new Date().toLocaleString()
    setTasks(updatedTasks)
    setLastRolloverDate(today)
    setLastRolloverTime(now)
    console.log(
      "[v0] Rollover complete. Updated tasks count:",
      updatedTasks.filter((t) => !t.completed && t.assignedDate === today).length,
      "at",
      now,
    )
  }

  const addProject = (name: string) => {
    const newProject: Project = {
      id: "proj-" + Date.now(),
      name,
      archived: false,
      createdAt: new Date().toISOString(),
    }
    setProjects([...projects, newProject])
  }

  const archiveProject = (id: string) => {
    setProjects((prev) => prev.map((proj) => (proj.id === id ? { ...proj, archived: true } : proj)))
  }

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((proj) => proj.id !== id))
    setTasks((prev) => prev.filter((task) => task.projectId !== id))
  }

  const addTask = (projectId: string, title: string, description: string, assignedDate: string) => {
    const newTask: Task = {
      id: "task-" + Date.now(),
      projectId,
      title,
      description,
      completed: false,
      assignedDate,
      rolloverCount: 0,
      createdAt: new Date().toISOString(),
      lastRolledOverDate: assignedDate,
    }
    setTasks([...tasks, newTask])
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const toggleTaskComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date().toISOString() : undefined,
            }
          : task,
      ),
    )
  }

  const moveTask = (taskId: string, newProjectId: string) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, projectId: newProjectId } : task)))
  }

  const getTasksByDate = (date: string): Task[] => {
    return tasks.filter((task) => task.assignedDate === date && !task.completed)
  }

  const getCompletedTasksByDate = (date: string): Task[] => {
    return tasks.filter((task) => {
      if (!task.completed || !task.completedAt) return false
      const completedDate = task.completedAt.split("T")[0]
      return completedDate === date
    })
  }

  const getProjectById = (id: string): Project | undefined => {
    return projects.find((proj) => proj.id === id)
  }

  const getTasksByProject = (projectId: string, date: string): Task[] => {
    return tasks.filter((task) => task.projectId === projectId && task.assignedDate === date && !task.completed)
  }

  const getIncompleteTasksByProject = (projectId: string): Task[] => {
    return tasks.filter((task) => task.projectId === projectId && !task.completed)
  }

  const checkAndRolloverTasks = () => {
    const today = new Date().toISOString().split("T")[0]
    if (lastRolloverDate !== today) {
      performRollover(today)
    }
  }

  const manualRollover = () => {
    const today = new Date().toISOString().split("T")[0]
    console.log("[v0] Manual rollover triggered. Current date:", today)
    performRollover(today)
  }

  return (
    <TodoContext.Provider
      value={{
        projects,
        tasks,
        addProject,
        archiveProject,
        deleteProject,
        addTask,
        deleteTask,
        toggleTaskComplete,
        moveTask,
        getTasksByDate,
        getCompletedTasksByDate,
        getProjectById,
        getTasksByProject,
        getIncompleteTasksByProject,
        checkAndRolloverTasks,
        manualRollover,
        lastRolloverTime,
      }}
    >
      {children}
    </TodoContext.Provider>
  )
}

export function useTodo() {
  const context = useContext(TodoContext)
  if (!context) {
    throw new Error("useTodo must be used within TodoProvider")
  }
  return context
}
