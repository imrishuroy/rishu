import { describe, it, expect } from 'vitest'
import { cn, formatDate } from '@/lib/utils'

describe('cn', () => {
  it('merges class strings', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('deduplicates conflicting Tailwind classes (last wins)', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('ignores falsy values', () => {
    expect(cn('a', false && 'b', undefined, null, 'c')).toBe('a c')
  })
})

describe('formatDate', () => {
  it('formats ISO date to readable string', () => {
    expect(formatDate('2026-09-15')).toBe('September 15, 2026')
  })

  it('handles first day of month', () => {
    expect(formatDate('2026-01-01')).toBe('January 1, 2026')
  })
})
