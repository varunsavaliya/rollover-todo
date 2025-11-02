"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface CalendarViewProps {
  selectedDate: string
  onSelectDate: (date: string) => void
}

export default function CalendarView({ selectedDate, onSelectDate }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const handleToday = () => {
    setCurrentDate(new Date())
    onSelectDate(new Date().toISOString().split("T")[0])
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days: (number | null)[] = []

  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  const dateString = (day: number) => {
    const dateObj = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), day))
    return dateObj.toISOString().split("T")[0]
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (day: number) => {
    return dateString(day) === selectedDate
  }

  return (
    <Card className="p-4 bg-card">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground [font-family:var(--font-heading)]">{monthName}</h3>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handlePrevMonth} className="h-8 w-8 p-0">
              -
            </Button>
            <Button variant="outline" size="sm" onClick={handleToday} className="text-xs bg-transparent">
              Today
            </Button>
            <Button variant="ghost" size="sm" onClick={handleNextMonth} className="h-8 w-8 p-0">
              +
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => day !== null && onSelectDate(dateString(day))}
              disabled={day === null}
              className={`aspect-square rounded-lg text-sm font-medium transition-colors ${
                day === null
                  ? "pointer-events-none"
                  : isSelected(day)
                    ? "bg-primary text-primary-foreground"
                    : isToday(day)
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary hover:bg-muted text-foreground"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
    </Card>
  )
}
