import { visit } from 'unist-util-visit'
import type { Root } from 'mdast'

export function remarkMermaid() {
  return (tree: Root) => {
    visit(tree, 'code', (node, index, parent) => {
      if (node.lang !== 'mermaid' || index == null || !parent) return

      // Replace the code node with an MDX JSX element: <Mermaid chart="..." />
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(parent.children as any[])[index] = {
        type: 'mdxJsxFlowElement',
        name: 'Mermaid',
        attributes: [
          {
            type: 'mdxJsxAttribute',
            name: 'chart',
            value: node.value,
          },
        ],
        children: [],
      }
    })
  }
}
