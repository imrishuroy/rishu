import type { ThemeRegistration } from 'shiki'

export const stitchTheme: ThemeRegistration = {
  name: 'stitch-obsidian-cyan',
  type: 'dark',
  colors: {
    'editor.background':   '#0b0e15',
    'editor.foreground':   '#e1e2ec',
    'editorLineNumber.foreground': '#3d484e',
  },
  tokenColors: [
    { scope: ['keyword', 'storage.type', 'storage.modifier'],
      settings: { foreground: '#00add8', fontStyle: 'bold' } },
    { scope: ['string', 'string.quoted'],
      settings: { foreground: '#4edea3' } },
    { scope: ['comment', 'comment.line', 'comment.block'],
      settings: { foreground: '#64748b', fontStyle: 'italic' } },
    { scope: ['constant.numeric', 'constant.language'],
      settings: { foreground: '#adc6ff' } },
    { scope: ['entity.name.function', 'support.function'],
      settings: { foreground: '#5cd4ff' } },
    { scope: ['entity.name.type', 'support.type', 'entity.name.class'],
      settings: { foreground: '#baeaff' } },
    { scope: ['variable', 'variable.other'],
      settings: { foreground: '#e1e2ec' } },
    { scope: ['punctuation'],
      settings: { foreground: '#879399' } },
  ],
}
