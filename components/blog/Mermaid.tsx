'use client'

import mermaid from 'mermaid'
import { useEffect, useSyncExternalStore, useState } from 'react'
import { createPortal } from 'react-dom'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

interface MermaidProps {
  chart: string
}

// Hydration-safe dark-mode detection via MutationObserver.
// Server snapshot returns 'dark' to match the site default.
function subscribe(cb: () => void) {
  const obs = new MutationObserver(cb)
  obs.observe(document.documentElement, { attributeFilter: ['class'] })
  return () => obs.disconnect()
}
const getThemeMode = () =>
  document.documentElement.classList.contains('dark') ? 'dark' : 'light'
const serverSnapshot = () => 'dark' as const

function buildMermaidConfig() {
  return {
    startOnLoad:    false,
    theme:          'dark' as Parameters<typeof mermaid.initialize>[0]['theme'],
    themeVariables: {
      darkMode:              true,
      background:            '#0d1117',
      primaryColor:          '#162032',
      secondaryColor:        '#16203a',
      tertiaryColor:         '#0d2219',
      mainBkg:               '#162032',
      primaryTextColor:      '#e1e2ec',
      secondaryTextColor:    '#adc6ff',
      tertiaryTextColor:     '#4edea3',
      primaryBorderColor:    '#5cd4ff',
      secondaryBorderColor:  '#adc6ff',
      tertiaryBorderColor:   '#4edea3',
      nodeBorder:            '#5cd4ff',
      lineColor:             '#3b6e8c',
      clusterBkg:            '#10151f',
      clusterBorder:         '#253040',
      titleColor:            '#5cd4ff',
      edgeLabelBackground:   '#0d1117',
      // 'inherit' works here because htmlLabels:true renders into HTML DOM where
      // the page's computed Inter font stack resolves correctly.
      fontFamily:            'inherit',
      fontSize:              '11px',
      // Sequence diagrams
      actorBkg:              '#162032',
      actorBorder:           '#5cd4ff',
      actorTextColor:        '#e1e2ec',
      actorLineColor:        '#3b6e8c',
      signalColor:           '#bcc8cf',
      signalTextColor:       '#bcc8cf',
      labelBoxBkgColor:      '#162032',
      labelBoxBorderColor:   '#5cd4ff',
      labelTextColor:        '#e1e2ec',
      loopTextColor:         '#bcc8cf',
      noteBorderColor:       '#4edea3',
      noteBkgColor:          '#0d2219',
      noteTextColor:         '#4edea3',
      activationBorderColor: '#5cd4ff',
      activationBkgColor:    '#162032',
    },
    // htmlLabels: true — Mermaid renders labels as HTML divs and measures actual browser
    // layout, so node heights are always correct regardless of font. The text clipping
    // that occurred previously was caused by look:'neo', which is now removed.
    flowchart: { useMaxWidth: false, htmlLabels: true, curve: 'basis' as const },
    sequence:  { useMaxWidth: false, mirrorActors: false },
  }
}

// Mermaid emits SVGs with explicit pixel width/height attributes, e.g.:
//   <svg width="412" height="600" viewBox="0 0 412 600" ...>
// Those attributes override CSS sizing. This helper replaces the viewBox with an
// expanded one (48px margin on each side) so that edge labels rendered via
// htmlLabels:true — which sit in <foreignObject> nodes that can extend beyond the
// SVG's natural bounding box — are never clipped. Then sets width="100%" so the
// SVG scales to fill its container while preserving aspect ratio.
function makeResponsiveSvg(raw: string): string {
  const wMatch = raw.match(/\bwidth="([\d.]+)"/)
  const hMatch = raw.match(/\bheight="([\d.]+)"/)
  if (!wMatch || !hMatch) return raw

  const w = parseFloat(wMatch[1])
  const h = parseFloat(hMatch[1])
  if (!w || !h) return raw

  // Always expand the viewBox — Mermaid's own viewBox is exactly "0 0 W H" which
  // clips any edge labels that extend beyond the natural bounds.
  const margin = 48

  return raw.replace(
    /<svg([^>]*)>/,
    (_, attrs) => {
      // Strip Mermaid's existing viewBox and pixel dimensions so we can replace them.
      const clean = attrs
        .replace(/\s*viewBox="[^"]*"/, '')
        .replace(/\s*width="[\d.]+"/, '')
        .replace(/\s*height="[\d.]+"/, '')
      const vb = `viewBox="${-margin} ${-margin} ${w + margin * 2} ${h + margin * 2}"`
      return `<svg${clean} ${vb} width="100%" style="height:auto;display:block">`
    }
  )
}

export function Mermaid({ chart }: MermaidProps) {
  const mode = useSyncExternalStore(subscribe, getThemeMode, serverSnapshot)
  const [svg, setSvg]   = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen]   = useState(false)

  useEffect(() => {
    if (!chart) return
    let cancelled = false

    const render = async () => {
      try {
        // Wait for custom fonts (Inter) to finish loading before Mermaid measures
        // label div dimensions. Without this, Mermaid measures with the fallback
        // system font, sizes node shapes accordingly, then Inter loads and the text
        // is taller — overflowing the already-committed shape boundary.
        await document.fonts.ready
        mermaid.initialize(buildMermaidConfig())
        const id = `mermaid-${Math.random().toString(36).slice(2)}`
        const { svg: raw } = await mermaid.render(id, chart.trim())
        if (!cancelled) setSvg(makeResponsiveSvg(raw))
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e))
      }
    }

    setSvg('')
    setError(null)
    render()
    return () => { cancelled = true }
  }, [chart, mode])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  if (error) {
    return (
      <div className="my-8 rounded-2xl border border-red-500/30 bg-[#1a0a0a] p-4">
        <p className="text-xs font-mono text-red-400">Diagram error: {error}</p>
      </div>
    )
  }

  if (!svg) {
    return (
      <div className="my-8 flex justify-center items-center" style={{ minHeight: 160 }}>
        <span className="text-[11px] font-mono text-primary/40 animate-pulse tracking-widest uppercase">
          rendering diagram...
        </span>
      </div>
    )
  }

  return (
    <>
      {/* Inline — no border/widget chrome, just the diagram in the reading flow */}
      <div className="my-8 relative group/mermaid">
        {/* Expand button appears on hover */}
        <button
          onClick={() => setOpen(true)}
          aria-label="Open diagram fullscreen"
          className="absolute right-0 top-0 z-10 opacity-0 group-hover/mermaid:opacity-100 transition-opacity duration-150 flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-mono text-on-surface-variant/50 hover:text-primary bg-surface/80 hover:bg-primary/5 border border-transparent hover:border-primary/20 backdrop-blur-sm"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 3 21 3 21 9"/>
            <polyline points="9 21 3 21 3 15"/>
            <line x1="21" y1="3" x2="14" y2="10"/>
            <line x1="3" y1="21" x2="10" y2="14"/>
          </svg>
          expand
        </button>

        {/* diagram canvas — click or use the expand button to open fullscreen */}
        <div
          className="mermaid-diagram flex justify-center items-center overflow-x-auto cursor-pointer"
          dangerouslySetInnerHTML={{ __html: svg }}
          onClick={() => setOpen(true)}
          role="button"
          tabIndex={0}
          aria-label="Open diagram fullscreen"
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpen(true) }}
        />
      </div>

      {/* Fullscreen lightbox */}
      {open && createPortal(
        <div className="fixed inset-0 z-50 bg-[#0b0d14]/95 backdrop-blur-sm flex flex-col" role="dialog" aria-modal="true" aria-label="Diagram fullscreen view">
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 shrink-0">
            <span className="text-xs font-mono text-on-surface-variant/40">
              scroll to zoom · drag to pan
            </span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="flex items-center gap-2 text-xs font-mono text-on-surface-variant/50 hover:text-on-surface-variant transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              esc to close
            </button>
          </div>

          <div className="flex-1 overflow-hidden relative">
            <TransformWrapper
              initialScale={1}
              minScale={0.2}
              maxScale={6}
              centerOnInit
              wheel={{ step: 0.08 }}
              doubleClick={{ disabled: false }}
            >
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  <TransformComponent
                    wrapperStyle={{ width: '100%', height: '100%', cursor: 'grab' }}
                    contentStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '64px' }}
                  >
                    {/* Fixed width gives width="100%" on the SVG a real container to fill */}
                    <div style={{ width: 'min(85vw, 1000px)' }}>
                      <div className="mermaid-diagram" dangerouslySetInnerHTML={{ __html: svg }} />
                    </div>
                  </TransformComponent>

                  <div className="absolute bottom-5 right-5 flex flex-col gap-1">
                    <button onClick={() => zoomIn()} aria-label="Zoom in"
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#1a1f2e] border border-white/10 text-on-surface-variant hover:text-primary hover:border-primary/40 transition-colors text-base font-light">
                      +
                    </button>
                    <button onClick={() => resetTransform()} aria-label="Fit to screen"
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#1a1f2e] border border-white/10 text-on-surface-variant hover:text-primary hover:border-primary/40 transition-colors">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                      </svg>
                    </button>
                    <button onClick={() => zoomOut()} aria-label="Zoom out"
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#1a1f2e] border border-white/10 text-on-surface-variant hover:text-primary hover:border-primary/40 transition-colors text-base font-light">
                      −
                    </button>
                  </div>
                </>
              )}
            </TransformWrapper>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
