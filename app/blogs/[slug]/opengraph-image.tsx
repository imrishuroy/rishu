import { ImageResponse } from 'next/og'
import { getPostBySlug } from '@/lib/posts'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  const title = post?.title ?? 'Rishu Kumar — Engineering Blog'
  const tags = post?.tags ?? ['Go', 'Distributed Systems']

  return new ImageResponse(
    (
      <div
        style={{
          background: '#10131a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Top: brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#00add8' }} />
          <span style={{ color: '#5cd4ff', fontWeight: 600, fontSize: 18, fontFamily: 'monospace' }}>
            Rishu Kumar
          </span>
        </div>

        {/* Middle: title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                style={{
                  background: 'rgba(0,173,216,0.15)',
                  border: '1px solid rgba(0,173,216,0.3)',
                  color: '#5cd4ff',
                  padding: '4px 12px',
                  borderRadius: 4,
                  fontSize: 14,
                  fontFamily: 'monospace',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <div style={{ color: '#e1e2ec', fontSize: 52, fontWeight: 700, lineHeight: 1.2, maxWidth: 960 }}>
            {title}
          </div>
        </div>

        {/* Bottom: author */}
        <div style={{ color: '#879399', fontSize: 18 }}>
          Rishu Kumar · rishukumar.dev
        </div>
      </div>
    ),
    { ...size },
  )
}
