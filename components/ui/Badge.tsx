import { cn } from '@/lib/utils'

type BadgeVariant = 'primary' | 'secondary' | 'tertiary' | 'outline'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  primary:   'bg-primary/10 text-primary border border-primary/30',
  secondary: 'bg-secondary/10 text-secondary border border-secondary/30',
  tertiary:  'bg-tertiary/15 text-tertiary border border-tertiary/30',
  outline:   'bg-surface-container-high text-on-surface border border-outline-variant/30',
}

export default function Badge({ children, variant = 'outline', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-xs',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
