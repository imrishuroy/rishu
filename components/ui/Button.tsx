import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'ghost'

interface BaseProps {
  variant?: ButtonVariant
  children: React.ReactNode
  className?: string
}

type AnchorProps = BaseProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
type ActionProps = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: never }
type ButtonProps = AnchorProps | ActionProps

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary-container text-on-primary-container hover:bg-primary cyan-glow',
  ghost:   'border border-outline-variant hover:border-primary text-on-surface hover:text-primary bg-surface-container-low',
}

export default function Button({ variant = 'primary', children, className, ...props }: ButtonProps) {
  const sharedClass = cn(
    'px-5 py-3 rounded-lg text-label-md flex items-center gap-2 transition-all active:scale-[0.98]',
    variantClasses[variant],
    className,
  )

  if ('href' in props && props.href != null) {
    const { href, ...anchorProps } = props as Omit<AnchorProps, 'variant' | 'children' | 'className'>
    return (
      <a href={href} className={sharedClass} {...anchorProps}>
        {children}
      </a>
    )
  }

  const buttonProps = props as Omit<ActionProps, 'variant' | 'children' | 'className'>
  return (
    <button className={sharedClass} {...buttonProps}>
      {children}
    </button>
  )
}
