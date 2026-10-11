const EXPERIENCES = [
  {
    company: 'Maersk',
    role: 'Associate Software Engineer',
    subtitle: 'Bengaluru, India',
    period: 'Oct 2023 – Present',
    awards: [
      { label: 'Q1 2026 Spot Award', icon: 'military_tech', variant: 'primary' },
    ],
    bullets: [
      <>Built backend services for a global <strong className="text-on-surface">RDT Scanner platform</strong> used across <strong className="text-on-surface">50+ countries</strong> for warehouse and logistics operations.</>,
      <>Designed and optimized REST APIs and event-driven workflows using AWS services including <strong className="text-on-surface">ECS, Lambda, DynamoDB, Kafka, and SQS</strong>.</>,
      <>Developed observability and telemetry SDKs for backend, web, and mobile applications to support centralized logging, monitoring, and performance tracking.</>,
      <>Contributed to distributed systems with a focus on scalability, reliability, and production debugging.</>,
      <>Added automated unit and integration testing and contributed to CI/CD pipelines, code reviews, and production releases.</>,
      <>Collaborated with engineering and product teams to deliver solutions for global customers including <strong className="text-on-surface">Nike, Adidas, and Amazon</strong>.</>,
      <>Mentored developers through architecture reviews and technical sessions.</>,
    ],
    chips: [
      { label: 'Go (Golang)', accent: 'primary' },
      { label: 'AWS ECS' },
      { label: 'AWS Lambda' },
      { label: 'Apache Kafka', accent: 'secondary' },
      { label: 'DynamoDB' },
      { label: 'SQS' },
      { label: 'Docker' },
      { label: 'OpenTelemetry', accent: 'tertiary' },
    ],
    highlight: true,
  },
  {
    company: 'Maersk',
    role: 'Software Engineer Intern',
    subtitle: 'Bengaluru, India',
    period: 'Jan 2023 – Sep 2023',
    awards: [
      { label: 'Q3 2023 Star of the Quarter', icon: 'award_star', variant: 'tertiary' },
    ],
    bullets: [
      <>Developed features for enterprise logistics platforms including <strong className="text-on-surface">AMS, GMS, DKMS, and YMS</strong>.</>,
      <>Contributed to microservice-based applications through feature development, debugging, testing, and code reviews.</>,
      <>Built reusable components for logistics automation workflows and contributed to dock assignment functionality.</>,
    ],
    chips: [
      { label: 'Go', accent: 'primary' },
      { label: 'REST APIs' },
      { label: 'PostgreSQL' },
      { label: 'AWS' },
      { label: 'Docker' },
      { label: 'Microservices' },
    ],
    highlight: false,
  },
  {
    company: 'Green Apex Solutions Limited',
    role: 'Mobile Engineer',
    subtitle: 'Ahmedabad, India',
    period: 'Jun 2022 – Nov 2022',
    awards: [] as { label: string; icon?: string; variant: string }[],
    bullets: [
      <>Built production-grade cross-platform mobile applications with real-time communication, developed reusable SDKs and plugins, and integrated native <strong className="text-on-surface">Android and iOS</strong> functionality.</>,
    ],
    chips: [
      { label: 'Cross-Platform Mobile' },
      { label: 'Real-Time' },
      { label: 'SDKs' },
      { label: 'Android' },
      { label: 'iOS' },
    ] as { label: string; accent?: string }[],
    highlight: false,
  },
]

const awardVariantMap: Record<string, string> = {
  primary:  'bg-primary-container/20 text-primary border border-primary/40',
  tertiary: 'bg-tertiary/15 text-tertiary border border-tertiary/30',
}

const chipAccentMap: Record<string, string> = {
  primary:   'text-primary border-primary/20',
  secondary: 'text-secondary border-secondary/30',
  tertiary:  'text-tertiary border-tertiary/30',
}

export default function Experience() {
  return (
    <section className="space-y-8 scroll-mt-24" id="experience">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant/30 pb-4">
        <div>
          <h2 className="text-headline-xl text-on-surface">Work Experience</h2>
        </div>
      </div>

      <div className="space-y-6">
        {EXPERIENCES.map((exp) => (
          <div
            key={exp.company + exp.role}
            className={`p-6 md:p-8 rounded-xl bg-surface-container border transition-all duration-300 ${
              exp.highlight
                ? 'border-outline-variant/40 hover:border-primary/60'
                : 'border-outline-variant/40 hover:border-outline'
            }`}
          >
            {/* Header row */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-headline-md text-on-surface font-bold">{exp.company}</h3>
                  <span className="text-outline">/</span>
                  <span className={`font-semibold text-headline-sm ${exp.highlight ? 'text-primary' : 'text-on-surface'}`}>
                    {exp.role}
                  </span>
                </div>
                <span className="text-on-surface-variant text-label-sm">{exp.subtitle}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {exp.awards.map((award) => (
                  <span
                    key={award.label}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${awardVariantMap[award.variant]}`}
                  >
                    {award.icon && (
                      <span className="material-symbols-outlined text-sm">{award.icon}</span>
                    )}
                    {award.label}
                  </span>
                ))}
                <span className="text-on-surface-variant font-mono text-xs px-2.5 py-1 bg-surface-container-high rounded border border-outline-variant/40">
                  {exp.period}
                </span>
              </div>
            </div>

            {/* Bullets */}
            <ul className="space-y-3 text-body-md text-on-surface-variant my-5 list-none">
              {exp.bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-base mt-1 shrink-0">check_circle</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            {/* Tech chips */}
            <div className="pt-4 border-t border-outline-variant/30 flex flex-wrap gap-2">
              {exp.chips.map((chip) => (
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
        ))}
      </div>
    </section>
  )
}
