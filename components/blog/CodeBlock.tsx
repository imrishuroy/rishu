import type { HTMLAttributes, ReactNode } from 'react'
import { Children, cloneElement, isValidElement } from 'react'
import { CopyableCode } from './CopyableCode'

// Recursively adds suppressHydrationWarning to every element so DarkReader's
// injected CSS custom-properties and data attributes don't trigger React errors.
function withSuppressHydration(node: ReactNode): ReactNode {
  if (!isValidElement(node)) return node
  const { children: childNodes } = node.props as { children?: ReactNode }
  const newChildren =
    childNodes != null
      ? Children.toArray(childNodes).map(withSuppressHydration)
      : undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return cloneElement(node as any, { suppressHydrationWarning: true }, ...(newChildren ?? []))
}

export function CodeBlock({ children, ...props }: HTMLAttributes<HTMLPreElement>) {
  const suppressedChildren = Children.toArray(children).map(withSuppressHydration)
  return <CopyableCode {...props}>{suppressedChildren}</CopyableCode>
}
