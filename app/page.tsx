"use client"

import { useState, useEffect } from "react"
import { TodoProvider } from "@/contexts/todo-context"
import MainLayout from "@/components/main-layout"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <TodoProvider>
      <MainLayout />
    </TodoProvider>
  )
}
