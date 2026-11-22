import Badge from '@/components/ui/Badge'

interface SeriesBadgeProps {
  series: string
  order?: number
}

function toDisplayName(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export default function SeriesBadge({ series, order }: SeriesBadgeProps) {
  const displayName = toDisplayName(series)
  const label = order !== undefined ? `Part ${order} · ${displayName}` : `${displayName} Series`

  return <Badge variant="primary">{label}</Badge>
}
