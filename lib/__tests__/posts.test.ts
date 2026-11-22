import { describe, it, expect } from 'vitest'
import { getSeriesPosts, getAdjacentSeriesPosts } from '../posts'

describe('getSeriesPosts', () => {
  it('returns empty array when no posts match the series slug', () => {
    const result = getSeriesPosts('nonexistent-series')
    expect(result).toEqual([])
  })

  it('returns only posts belonging to the given series slug', () => {
    const result = getSeriesPosts('nonexistent-series')
    expect(result.every((p) => p.series === 'nonexistent-series')).toBe(true)
  })
})

describe('getAdjacentSeriesPosts', () => {
  it('returns null for both when slug is not in any series', () => {
    const result = getAdjacentSeriesPosts('go-worker-pool')
    expect(result).toEqual({ prev: null, next: null })
  })

  it('returns null for both when slug does not exist', () => {
    const result = getAdjacentSeriesPosts('totally-nonexistent-slug')
    expect(result).toEqual({ prev: null, next: null })
  })
})
