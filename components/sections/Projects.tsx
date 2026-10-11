import GitHubIcon from '@/components/ui/GitHubIcon'

const TECH_CHIPS = [
  { label: 'Go',             accent: 'primary' },
  { label: 'Gin' },
  { label: 'CockroachDB',   accent: 'secondary' },
  { label: 'Redis',         accent: 'tertiary' },
  { label: 'pgx' },
  { label: 'JWT' },
  { label: 'Judge0',        accent: 'primary' },
  { label: 'Docker' },
  { label: 'Kubernetes' },
  { label: 'GitHub Actions' },
]

const FEATURES = [
  {
    icon: 'architecture',
    color: 'text-primary',
    title: 'Clean Architecture',
    desc: 'Handlers, services, and repositories in separate layers. Business logic is isolated from HTTP and database concerns.',
  },
  {
    icon: 'lock',
    color: 'text-secondary',
    title: 'JWT Authentication',
    desc: 'Access and refresh token rotation. Stateless auth with bcrypt password hashing and configurable expiry.',
  },
  {
    icon: 'memory',
    color: 'text-tertiary',
    title: 'Sandboxed Code Execution',
    desc: 'User code runs inside Judge0 Isolate containers. 256MB memory limit, 1 CPU core, no network access.',
  },
  {
    icon: 'speed',
    color: 'text-primary',
    title: 'Per-IP Rate Limiting',
    desc: 'Sliding window rate limiter using Redis. Prevents abuse before requests reach the service layer.',
  },
  {
    icon: 'api',
    color: 'text-secondary',
    title: 'Versioned REST API',
    desc: 'All endpoints under /api/v1. Struct-based request validation with standardized JSON error responses.',
  },
  {
    icon: 'favorite',
    color: 'text-tertiary',
    title: 'Kubernetes-Ready',
    desc: 'Liveness, readiness, and startup health probes. Multi-stage Docker build with GitHub Actions CI/CD.',
  },
]

const ARCH_LAYERS = [
  {
    layer: 'HTTP',
    labelColor: 'text-primary',
    bandColor: 'border-primary/30 bg-primary/5',
    components: [
      { name: 'Gin Router', sub: '/api/v1' },
      { name: 'JWT Middleware', sub: 'Auth' },
      { name: 'Rate Limiter', sub: 'Redis · per-IP' },
      { name: 'Request Validation', sub: 'Struct tags' },
    ],
  },
  {
    layer: 'Services',
    labelColor: 'text-secondary',
    bandColor: 'border-secondary/30 bg-secondary/5',
    components: [
      { name: 'AuthService', sub: 'JWT + bcrypt' },
      { name: 'SubmissionService', sub: 'Orchestration' },
      { name: 'JudgeService', sub: 'Execution' },
    ],
  },
  {
    layer: 'Data',
    labelColor: 'text-tertiary',
    bandColor: 'border-tertiary/30 bg-tertiary/5',
    components: [
      { name: 'CockroachDB', sub: 'Distributed SQL' },
      { name: 'Redis', sub: 'Cache + Queue' },
      { name: 'pgx', sub: 'Connection pool' },
      { name: 'Migrations', sub: 'Version-controlled' },
    ],
  },
  {
    layer: 'Execution',
    labelColor: 'text-primary',
    bandColor: 'border-primary/30 bg-primary/5',
    components: [
      { name: 'Judge0 API', sub: 'Batch submissions' },
      { name: 'Isolate Sandbox', sub: '256MB · 1 CPU' },
      { name: 'Result Polling', sub: 'Async + retry' },
    ],
  },
]

const chipAccentMap: Record<string, string> = {
  primary:   'text-primary border-primary/20',
  secondary: 'text-secondary border-secondary/30',
  tertiary:  'text-tertiary border-tertiary/30',
}

export default function Projects() {
  return (
    <section className="space-y-8 scroll-mt-24" id="projects">
      <div className="border-b border-outline-variant/30 pb-4">
        <h2 className="text-headline-xl text-on-surface">Projects</h2>
      </div>

      <div className="p-6 md:p-10 rounded-2xl bg-surface-container border border-outline-variant/50 relative overflow-hidden hover:border-primary/50 transition-all duration-300">
        {/* Ambient glow */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary-container/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-8">

          {/* Title + description + GitHub */}
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-headline-lg text-on-surface font-bold">AlgoPatterns</h3>
              <p className="text-body-md text-on-surface-variant max-w-2xl">
                A Go backend for an algorithm learning platform. Built with Gin and Clean Architecture,
                featuring sandboxed code execution via Judge0, JWT authentication, and CockroachDB for
                distributed SQL storage.
              </p>
            </div>
            <a
              href="https://github.com/imrishuroy/algopatterns"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary-container text-on-primary-container hover:bg-primary px-4 py-2.5 rounded-lg text-label-md flex items-center gap-2 cyan-glow transition-all active:scale-[0.98] shrink-0"
            >
              <GitHubIcon className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>

          {/* Architecture layers */}
          <div>
            <p className="text-label-sm text-on-surface-variant font-mono uppercase tracking-wider mb-3">System Architecture</p>
            <div className="space-y-1.5">
              {ARCH_LAYERS.map((row, i, arr) => (
                <div key={row.layer}>
                  <div className={`rounded-xl border ${row.bandColor} px-5 py-4 flex flex-wrap items-center gap-x-6 gap-y-3`}>
                    <span className={`text-xs font-mono font-bold uppercase tracking-widest ${row.labelColor} w-16 shrink-0`}>
                      {row.layer}
                    </span>
                    <div className="flex flex-wrap gap-2 flex-1">
                      {row.components.map((c) => (
                        <div
                          key={c.name}
                          className="flex flex-col items-start px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant/30"
                        >
                          <span className="font-mono text-xs font-semibold text-on-surface">{c.name}</span>
                          <span className="text-[0.65rem] text-on-surface-variant font-mono leading-tight">{c.sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="flex justify-start pl-[4.5rem] py-0.5 text-outline text-xs font-mono leading-none">│</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/20">
                <div className="flex items-center gap-1.5 mb-1.5 font-semibold text-on-surface text-label-md">
                  <span className={`material-symbols-outlined text-sm ${f.color}`}>{f.icon}</span>
                  {f.title}
                </div>
                <p className="text-body-sm text-on-surface-variant">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Tech chips */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-outline-variant/20">
            {TECH_CHIPS.map((chip) => (
              <span
                key={chip.label}
                className={`px-2.5 py-1 rounded bg-surface-container-high font-mono text-xs border ${
                  chip.accent ? chipAccentMap[chip.accent] : 'text-on-surface border-outline-variant/30'
                }`}
              >
                {chip.label}
              </span>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
