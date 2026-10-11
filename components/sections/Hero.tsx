import Link from 'next/link'
import EmailCopyButton from './EmailCopyButton'

export default function Hero() {
  return (
    <section className="relative pt-6 pb-4 scroll-mt-24" id="hero">
      {/* Ambient glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-primary-container/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-3xl space-y-6">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-tertiary/40 bg-surface-container-low text-tertiary text-label-sm shadow-inner">
            <span className="relative inline-flex">
              <span className="w-2 h-2 rounded-full bg-tertiary inline-block" />
              <span className="absolute inset-0 w-2 h-2 rounded-full bg-tertiary animate-ping" />
            </span>
            <span>Open to Backend Software Engineering Roles</span>
          </div>

          {/* Headline */}
          <h1 className="text-headline-xl lg:text-display tracking-tight text-on-surface">
            Rishu Kumar –{' '}
            <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary-container via-primary to-secondary bg-clip-text text-transparent">
              Backend Software Engineer
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
            Building scalable cloud-based enterprise systems, distributed services, and observability tools with{' '}
            <strong className="text-on-surface font-semibold">Go</strong>,{' '}
            <strong className="text-on-surface font-semibold">AWS</strong>,{' '}
            <strong className="text-on-surface font-semibold">Kafka</strong>, and{' '}
            <strong className="text-on-surface font-semibold">Kubernetes</strong>.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary-container text-on-primary-container hover:bg-primary px-5 py-3 rounded-lg text-label-md flex items-center gap-2 cyan-glow transition-all active:scale-[0.98]"
            >
              <span className="material-symbols-outlined">description</span>
              <span>Download Resume (PDF)</span>
            </a>
            <Link
              href="/#projects"
              className="border border-outline-variant hover:border-primary text-on-surface hover:text-primary px-5 py-3 rounded-lg text-label-md flex items-center gap-2 transition-all bg-surface-container-low active:scale-[0.98]"
            >
              <span className="material-symbols-outlined">account_tree</span>
              <span>Explore Projects</span>
            </Link>
            <EmailCopyButton />
          </div>

        </div>
    </section>
  )
}
