import { describe, it, expect } from 'vitest'
import path from 'path'
import { getAllPosts, getPostBySlug } from '@/lib/posts'

const FIXTURES = path.join(__dirname, '__fixtures__/blogs')

describe('getAllPosts', () => {
  it('returns all non-draft posts in development', () => {
    const posts = getAllPosts(FIXTURES)
    expect(posts.length).toBe(2)
    expect(posts.every((p) => !p.draft)).toBe(true)
  })

  it('sorts posts by date descending (newest first)', () => {
    const posts = getAllPosts(FIXTURES)
    expect(posts[0].date).toBe('2026-09-15')
    expect(posts[1].date).toBe('2026-08-01')
  })

  it('never returns draft posts regardless of environment', () => {
    // Drafts are always excluded from listings; direct URL access (getPostBySlug) still works
    const posts = getAllPosts(FIXTURES)
    expect(posts.every((p) => !p.draft)).toBe(true)
  })

  it('returns correct PostMeta shape', () => {
    const posts = getAllPosts(FIXTURES)
    const post = posts[0]
    expect(post).toHaveProperty('slug')
    expect(post).toHaveProperty('title')
    expect(post).toHaveProperty('date')
    expect(post).toHaveProperty('tags')
    expect(post).toHaveProperty('summary')
    expect(post).toHaveProperty('readTime')
    expect(post).toHaveProperty('draft')
    expect(Array.isArray(post.tags)).toBe(true)
  })
})

describe('getPostBySlug', () => {
  it('returns null for a non-existent slug', () => {
    const post = getPostBySlug('does-not-exist', FIXTURES)
    expect(post).toBeNull()
  })

  it('returns the correct post with content', () => {
    const post = getPostBySlug('go-gc', FIXTURES)
    expect(post).not.toBeNull()
    expect(post!.title).toBe('Go GC Test Post')
    expect(post!.tags).toContain('Go')
    expect(typeof post!.content).toBe('string')
    expect(post!.content.length).toBeGreaterThan(0)
  })

  it('returns the correct slug on the returned object', () => {
    const post = getPostBySlug('kafka-events', FIXTURES)
    expect(post!.slug).toBe('kafka-events')
  })
})
