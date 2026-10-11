interface SkillItem {
  label: string
  note?: string
  highlight?: boolean
  accent?: string
}

const SKILL_GROUPS: {
  icon: string
  iconColor: string
  title: string
  tag: string
  tagColor: string
  footer: string
  items: SkillItem[]
  layout: 'list' | 'chips'
}[] = [
  {
    icon: 'code',
    iconColor: 'text-primary',
    title: 'Languages',
    tag: 'Core',
    tagColor: 'text-primary bg-primary/10',
    footer: 'Go is primary, used daily in production',
    items: [
      { label: 'Go (Golang)', note: 'Primary', highlight: true },
      { label: 'Java',        note: 'Enterprise',  highlight: false },
      { label: 'Python',      note: 'Scripting',   highlight: false },
      { label: 'SQL',         note: 'Querying',    highlight: false },
    ],
    layout: 'list',
  },
  {
    icon: 'lan',
    iconColor: 'text-secondary',
    title: 'Backend & Distributed',
    tag: 'Systems',
    tagColor: 'text-secondary bg-secondary/10',
    footer: 'Event-driven, concurrent, distributed systems',
    items: [
      { label: 'REST APIs' },
      { label: 'gRPC',                     accent: 'primary' },
      { label: 'Apache Kafka',             accent: 'secondary' },
      { label: 'AWS SQS' },
      { label: 'Microservices' },
      { label: 'Distributed Systems',      accent: 'primary' },
      { label: 'Event-Driven Architecture' },
      { label: 'Concurrency' },
      { label: 'System Design' },
    ],
    layout: 'chips',
  },
  {
    icon: 'cloud',
    iconColor: 'text-tertiary',
    title: 'Cloud & DevOps',
    tag: 'Infra',
    tagColor: 'text-tertiary bg-tertiary/10',
    footer: 'Containerized services on AWS, managed with Kubernetes',
    items: [
      { label: 'AWS ECS' },
      { label: 'AWS Lambda' },
      { label: 'EC2' },
      { label: 'API Gateway' },
      { label: 'CloudWatch',   accent: 'tertiary' },
      { label: 'Docker' },
      { label: 'Kubernetes',   accent: 'tertiary' },
      { label: 'CI/CD' },
      { label: 'GitHub Actions' },
    ],
    layout: 'chips',
  },
  {
    icon: 'storage',
    iconColor: 'text-primary',
    title: 'Data & Observability',
    tag: 'Data',
    tagColor: 'text-primary bg-primary/10',
    footer: 'Persistent storage, caching, metrics, and tracing',
    items: [
      { label: 'PostgreSQL' },
      { label: 'DynamoDB',      accent: 'secondary' },
      { label: 'Redis',         accent: 'tertiary' },
      { label: 'CockroachDB',   accent: 'primary' },
      { label: 'Grafana' },
      { label: 'Prometheus' },
      { label: 'OpenTelemetry' },
    ],
    layout: 'chips',
  },
]

const chipAccentMap: Record<string, string> = {
  primary:   'text-primary border-primary/30 font-semibold',
  secondary: 'text-secondary border-secondary/30 font-semibold',
  tertiary:  'text-tertiary border-tertiary/30 font-semibold',
}

export default function Skills() {
  return (
    <section className="space-y-8 scroll-mt-24" id="skills">
      <div className="border-b border-outline-variant/30 pb-4">
        <h2 className="text-headline-xl text-on-surface">Skills</h2>
        <p className="text-on-surface-variant text-body-sm mt-1">
          I work mainly with Go for backend services and distributed systems. Most of my work involves REST APIs, event-driven workflows with Kafka, cloud infrastructure on AWS, and keeping systems observable in production.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SKILL_GROUPS.map((group) => (
          <div
            key={group.title}
            className="p-6 rounded-xl bg-surface-container border border-outline-variant/40 hover:border-primary/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-label-md font-bold flex items-center gap-2 text-on-surface">
                  <span className={`material-symbols-outlined ${group.iconColor}`}>{group.icon}</span>
                  {group.title}
                </span>
                <span className={`text-xs font-mono px-2 py-0.5 rounded ${group.tagColor}`}>{group.tag}</span>
              </div>

              {group.layout === 'list' ? (
                <div className="space-y-2.5">
                  {group.items.map((item) => (
                    <div
                      key={item.label}
                      className={`p-2.5 rounded bg-surface-container-high flex items-center justify-between ${
                        item.highlight ? 'border border-primary/30' : 'border border-outline-variant/30'
                      }`}
                    >
                      <span className={`font-mono text-sm ${item.highlight ? 'font-bold text-primary' : 'text-on-surface'}`}>
                        {item.label}
                      </span>
                      <span className={`text-[0.7rem] font-mono ${item.highlight ? 'text-tertiary' : 'text-on-surface-variant'}`}>
                        {item.note}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item.label}
                      className={`px-2.5 py-1.5 rounded bg-surface-container-high font-mono text-xs border ${
                        item.accent ? chipAccentMap[item.accent] : 'text-on-surface border-outline-variant/30'
                      }`}
                    >
                      {item.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-outline-variant/20 text-[0.7rem] text-on-surface-variant font-mono">
              {group.footer}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
