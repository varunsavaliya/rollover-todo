"use client"

import { useState } from "react"
import { useTodo } from "@/contexts/todo-context"
import Sidebar from "./sidebar"
import Header from "./header"
import TaskPanel from "./task-panel"
import ArchivedProjectsView from "./archived-projects-view"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MainLayout() {
  const { projects } = useTodo()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects.find((p) => !p.archived)?.id || "")
  const [view, setView] = useState<"main" | "archived">("main")

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed md:static md:translate-x-0 transition-transform z-40 h-screen w-64 bg-sidebar border-r border-border md:flex flex-col`}
      >
        <Sidebar
          selectedProjectId={selectedProjectId}
          onSelectProject={(id) => {
            setSelectedProjectId(id)
            setSidebarOpen(false)
            setView("main")
          }}
          onViewArchived={() => {
            setView("archived")
            setSidebarOpen(false)
          }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {view === "main" ? (
          <>
            <Header selectedDate={selectedDate} onSelectDate={setSelectedDate} />
            <div className="flex-1 overflow-auto">
              <TaskPanel selectedDate={selectedDate} selectedProjectId={selectedProjectId} />
            </div>
          </>
        ) : (
          <ArchivedProjectsView onBack={() => setView("main")} />
        )}
      </div>
    </div>
  )
}
