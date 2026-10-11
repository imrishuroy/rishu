import type { Metadata } from 'next'
import Link from 'next/link'
import EmailCopyButton from '@/components/sections/EmailCopyButton'

export const metadata: Metadata = {
  title: 'Contact – Rishu Kumar | Backend Software Engineer',
  description:
    "Get in touch with Rishu Kumar. Open to Senior & Staff Backend Engineering roles. Reach out via email, GitHub, or LinkedIn.",
}

const links = [
  {
    label: 'GitHub',
    value: 'github.com/imrishuroy',
    href: 'https://github.com/imrishuroy',
    icon: 'code',
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/imrishuroy',
    href: 'https://www.linkedin.com/in/imrishuroy',
    icon: 'work',
  },
  {
    label: 'LeetCode',
    value: 'leetcode.com/imrishuroy',
    href: 'https://leetcode.com/imrishuroy',
    icon: 'terminal',
  },
]

export default function ContactPage() {
  return (
    <div className="relative max-w-3xl mx-auto px-6 py-10">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-primary-container/10 blur-[130px] pointer-events-none rounded-full"
      />

      {/* Heading */}
      <div className="space-y-3 mb-10">
        <h1 className="text-headline-xl lg:text-display tracking-tight text-on-surface font-sans">
          <span className="text-primary font-mono">&gt;</span> Contact
        </h1>
        <p className="text-body-lg text-on-surface-variant">
          I&apos;m open to Senior &amp; Staff Backend Engineering roles. Drop me a message.
        </p>
      </div>

      {/* Contact cards */}
      <div className="space-y-4">
        {/* Email card */}
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-xl">alternate_email</span>
            <span className="text-label-md font-sans text-on-surface-variant uppercase tracking-wider">
              Email
            </span>
          </div>
          <p className="text-on-surface font-mono text-body-lg">
            rishukumar.prince@gmail.com
          </p>
          <EmailCopyButton />
        </div>

        {/* External link cards */}
        {links.map(({ label, value, href, icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-surface-container-low border border-outline-variant/30 rounded-xl p-5 space-y-1 hover:border-primary/40 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-xl">{icon}</span>
              <span className="text-label-md font-sans text-on-surface-variant uppercase tracking-wider">
                {label}
              </span>
              <span className="material-symbols-outlined text-outline text-base ml-auto group-hover:text-primary transition-colors">
                open_in_new
              </span>
            </div>
            <p className="text-on-surface font-mono text-body-lg pl-9">{value}</p>
          </a>
        ))}
      </div>

      {/* Response time note */}
      <p className="mt-10 font-mono text-label-sm text-on-surface-variant">
        <span className="text-outline">{'//'}</span>{' '}Typically respond within 24&ndash;48 hours
      </p>

      {/* Back link */}
      <div className="mt-8">
        <Link
          href="/"
          className="text-label-md text-on-surface-variant hover:text-primary transition-colors font-sans flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back to Home
        </Link>
      </div>
    </div>
  )
}
