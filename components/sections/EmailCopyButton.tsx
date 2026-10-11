'use client'

import { useState } from 'react'

export default function EmailCopyButton() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('rishukumar.prince@gmail.com')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable (HTTP origin, permission denied, private mode)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="border border-outline-variant/60 hover:border-outline px-3.5 py-3 rounded-lg text-label-sm text-on-surface-variant flex items-center gap-2 transition-all bg-surface-container-lowest"
    >
      {copied ? (
        <>
          <span className="material-symbols-outlined text-tertiary text-[1.125rem]">check</span>
          <span className="font-mono">Copied!</span>
        </>
      ) : (
        <>
          <span className="material-symbols-outlined text-[1.125rem]">alternate_email</span>
          <span className="font-mono">rishukumar.prince@gmail.com</span>
        </>
      )}
    </button>
  )
}
