import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export default function Card({ children, className, hover = true }: CardProps) {
  return (
    <div
      className={cn(
        'p-6 rounded-xl bg-surface-container border border-outline-variant/40',
        hover && 'hover:border-primary/60 transition-all duration-300',
        className,
      )}
    >
      {children}
    </div>
  )
}
