import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRolloverColor(rolloverCount: number): string {
  if (rolloverCount === 0) return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
  if (rolloverCount === 1) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
  if (rolloverCount === 2) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
  if (rolloverCount === 3) return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
  return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
}
