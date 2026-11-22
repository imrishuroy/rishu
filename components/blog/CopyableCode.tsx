'use client'

import { useRef, useState } from 'react'

export function CopyableCode({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  const preRef = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    if (!preRef.current) return
    // rehype-pretty-code wraps each line in [data-line] spans
    const lines = preRef.current.querySelectorAll('[data-line]')
    const text =
      lines.length > 0
        ? Array.from(lines)
            .map((l) => l.textContent ?? '')
            .join('\n')
        : (preRef.current.querySelector('code')?.textContent ?? '')

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="relative group/code overflow-hidden">
      <button
        onClick={handleCopy}
        aria-label={copied ? 'Copied' : 'Copy code'}
        className="absolute right-2 top-2 z-10 opacity-0 group-hover/code:opacity-100 transition-opacity duration-150 flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono bg-surface-container border border-outline-variant/40 text-outline hover:text-primary hover:border-primary/40"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>
          {copied ? 'check' : 'content_copy'}
        </span>
        {copied ? 'Copied' : 'Copy'}
      </button>
      <div className="overflow-x-auto">
        <pre ref={preRef} {...props} suppressHydrationWarning>
          {children}
        </pre>
      </div>
    </div>
  )
}
