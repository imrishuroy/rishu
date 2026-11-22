import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { stitchTheme } from '@/lib/shiki-theme'
import { remarkMermaid } from '@/lib/remark-mermaid'
import { CodeBlock } from './CodeBlock'
import { Mermaid } from './Mermaid'

interface MdxContentProps {
  source: string
}

const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkMermaid],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: stitchTheme,
          keepBackground: true,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onVisitLine(node: any) {
            if (node.children.length === 0) {
              node.children = [{ type: 'text', value: ' ' }]
            }
          },
        },
      ],
    ],
  },
}

export default function MdxContent({ source }: MdxContentProps) {
  return (
    <div className="mdx-content prose max-w-none">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <MDXRemote source={source} options={mdxOptions as any} components={{ pre: CodeBlock as any, Mermaid: Mermaid as any }} />
    </div>
  )
}
