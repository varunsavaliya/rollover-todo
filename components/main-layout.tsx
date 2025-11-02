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
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects.find((p) => !p.archived)?.id || "")
  const [view, setView] = useState<"main" | "archived">("main")

  return (
    <div className="flex h-screen bg-background relative">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-2 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setSidebarOpen(true)}>
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Overlay for mobile (click outside to close) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed md:static md:translate-x-0 transition-transform duration-300 ease-in-out z-50 h-screen w-64 bg-sidebar border-r border-border md:flex flex-col shadow-lg md:shadow-none`}
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
