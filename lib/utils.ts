import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export function safeIsoDate(date: string | undefined): string | undefined {
  if (!date) return undefined
  const d = new Date(date)
  return isNaN(d.getTime()) ? undefined : d.toISOString()
}
