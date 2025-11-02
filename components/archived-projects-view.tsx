"use client"

import { useTodo } from "@/contexts/todo-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, Trash2, ArrowLeft } from "lucide-react"
import { useState } from "react"
import { getRolloverColor } from "@/lib/utils"

interface ArchivedProjectsViewProps {
  onBack?: () => void
}

export default function ArchivedProjectsView({ onBack }: ArchivedProjectsViewProps) {
  const { projects, tasks, deleteProject } = useTodo()
  const [expandedProject, setExpandedProject] = useState<string | null>(null)
  const [expandedSection, setExpandedSection] = useState<{
    projectId: string
    section: "pending" | "completed"
  } | null>(null)

  const archivedProjects = projects.filter((p) => p.archived)

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border bg-card p-4 md:p-6">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1 hover:bg-secondary rounded transition-colors"
              title="Back to main view"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-foreground [font-family:var(--font-heading)]">
            Archived Projects
          </h1>
        </div>
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-auto p-4 md:p-6 space-y-3">
        {archivedProjects.length === 0 ? (
          <Card className="p-8 text-center bg-secondary/50 border-dashed">
            <p className="text-muted-foreground text-sm">No archived projects yet</p>
          </Card>
        ) : (
          archivedProjects.map((project) => {
            const projectTasks = tasks.filter((t) => t.projectId === project.id)
            const pendingTasks = projectTasks.filter((t) => !t.completed)
            const completedTasks = projectTasks.filter((t) => t.completed)
            const maxRollover = pendingTasks.length > 0 ? Math.max(...pendingTasks.map((t) => t.rolloverCount)) : 0
            const isExpanded = expandedProject === project.id

            return (
              <Card key={project.id} className="bg-card border border-border overflow-hidden">
                {/* Main Project Header */}
                <button
                  onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <ChevronDown
                      className={`h-5 w-5 transition-transform flex-shrink-0 ${isExpanded ? "rotate-0" : "-rotate-90"}`}
                    />
                    <div className="text-left">
                      <h3 className="font-semibold text-sm [font-family:var(--font-heading)]">{project.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {projectTasks.length} {projectTasks.length === 1 ? "task" : "tasks"}
                      </p>
                    </div>
                  </div>
                  {maxRollover > 0 && (
                    <span className={`text-xs font-bold rounded-full px-2 py-1 ml-2 ${getRolloverColor(maxRollover)}`}>
                      {maxRollover}
                    </span>
                  )}
                </button>

                {isExpanded && (
                  <div className="px-4 py-3 space-y-2 bg-secondary/20 border-t border-border">
                    {projectTasks.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-3">No tasks in this project</p>
                    ) : (
                      <>
                        {/* Pending Tasks Section */}
                        <div className="space-y-2">
                          <button
                            onClick={() =>
                              setExpandedSection(
                                expandedSection?.projectId === project.id && expandedSection.section === "pending"
                                  ? null
                                  : { projectId: project.id, section: "pending" },
                              )
                            }
                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-secondary/50 rounded transition-colors text-left"
                          >
                            <ChevronDown
                              className={`h-4 w-4 transition-transform flex-shrink-0 ${
                                expandedSection?.projectId === project.id && expandedSection.section === "pending"
                                  ? "rotate-0"
                                  : "-rotate-90"
                              }`}
                            />
                            <span className="text-sm font-medium">Pending Tasks ({pendingTasks.length})</span>
                          </button>

                          {expandedSection?.projectId === project.id && expandedSection.section === "pending" && (
                            <div className="ml-6 space-y-2 pb-2">
                              {pendingTasks.length === 0 ? (
                                <p className="text-xs text-muted-foreground py-2">No pending tasks</p>
                              ) : (
                                pendingTasks.map((task) => {
                                  const rolloverColor = getRolloverColor(task.rolloverCount)
                                  return (
                                    <div key={task.id} className="text-xs p-3 bg-card rounded border border-border/50">
                                      <div className="font-semibold line-clamp-1 text-foreground">{task.title}</div>
                                      {task.description && (
                                        <div className="text-muted-foreground line-clamp-1 mt-1">
                                          {task.description}
                                        </div>
                                      )}
                                      <div className="text-muted-foreground text-xs mt-2">
                                        Due:{" "}
                                        {new Date(task.assignedDate + "T00:00:00").toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                        })}
                                      </div>
                                      {task.rolloverCount > 0 && (
                                        <div
                                          className={`inline-block rounded px-2 py-0.5 font-semibold mt-2 ${rolloverColor}`}
                                        >
                                          {task.rolloverCount} rollover{task.rolloverCount > 1 ? "s" : ""}
                                        </div>
                                      )}
                                    </div>
                                  )
                                })
                              )}
                            </div>
                          )}
                        </div>

                        {/* Completed Tasks Section */}
                        <div className="space-y-2 mt-3">
                          <button
                            onClick={() =>
                              setExpandedSection(
                                expandedSection?.projectId === project.id && expandedSection.section === "completed"
                                  ? null
                                  : { projectId: project.id, section: "completed" },
                              )
                            }
                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-secondary/50 rounded transition-colors text-left"
                          >
                            <ChevronDown
                              className={`h-4 w-4 transition-transform flex-shrink-0 ${
                                expandedSection?.projectId === project.id && expandedSection.section === "completed"
                                  ? "rotate-0"
                                  : "-rotate-90"
                              }`}
                            />
                            <span className="text-sm font-medium">Completed Tasks ({completedTasks.length})</span>
                          </button>

                          {expandedSection?.projectId === project.id && expandedSection.section === "completed" && (
                            <div className="ml-6 space-y-2 pb-2">
                              {completedTasks.length === 0 ? (
                                <p className="text-xs text-muted-foreground py-2">No completed tasks</p>
                              ) : (
                                completedTasks.map((task) => {
                                  const rolloverColor = getRolloverColor(task.rolloverCount)
                                  return (
                                    <div key={task.id} className="text-xs p-3 bg-card rounded border border-border/50">
                                      <div className="font-semibold line-clamp-1 text-foreground">{task.title}</div>
                                      {task.description && (
                                        <div className="text-muted-foreground line-clamp-1 mt-1">
                                          {task.description}
                                        </div>
                                      )}
                                      <div className="text-muted-foreground text-xs mt-2">
                                        Due:{" "}
                                        {new Date(task.assignedDate + "T00:00:00").toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                        })}
                                      </div>
                                      {task.completedAt && (
                                        <div className="text-green-600 dark:text-green-400 text-xs mt-2 font-medium">
                                          Completed:{" "}
                                          {new Date(task.completedAt).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                          })}{" "}
                                          {new Date(task.completedAt).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                        </div>
                                      )}
                                      {task.rolloverCount > 0 && (
                                        <div
                                          className={`inline-block rounded px-2 py-0.5 font-semibold mt-2 ${rolloverColor}`}
                                        >
                                          {task.rolloverCount} rollover{task.rolloverCount > 1 ? "s" : ""}
                                        </div>
                                      )}
                                    </div>
                                  )
                                })
                              )}
                            </div>
                          )}
                        </div>

                        {/* Delete Project Button */}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteProject(project.id)}
                          className="w-full mt-3 gap-2 text-sm"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete Project
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
