export const DEFAULT_FONT_FAMILIES = [
  { label: 'Default (Sans-serif)', value: 'inherit' },
  { label: 'Inter / System', value: 'system-ui, -apple-system, sans-serif' },
  { label: 'Plus Jakarta Sans', value: "'Plus Jakarta Sans', sans-serif" },
  { label: 'Playfair Display (Serif)', value: "'Playfair Display', Georgia, serif" },
  { label: 'Merriweather (Editorial)', value: "'Merriweather', serif" },
  { label: 'Fira Code (Monospace)', value: "'Fira Code', 'Courier New', monospace" },
  { label: 'Comic / Casual', value: "'Comic Sans MS', cursive, sans-serif" },
];

export const DEFAULT_FONT_SIZES = [
  { label: '12px (Small)', value: '12px' },
  { label: '14px (Body Small)', value: '14px' },
  { label: '16px (Normal)', value: '16px' },
  { label: '18px (Medium)', value: '18px' },
  { label: '20px (Large)', value: '20px' },
  { label: '24px (Title)', value: '24px' },
  { label: '30px (Heading)', value: '30px' },
  { label: '36px (Display)', value: '36px' },
];

export const TEXT_COLORS = [
  '#000000', '#334155', '#64748b', '#94a3b8',
  '#ef4444', '#f97316', '#f59e0b', '#10b981',
  '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6',
  '#ec4899', '#f43f5e', '#ffffff'
];

export const HIGHLIGHT_COLORS = [
  'transparent',
  '#fef08a', // Yellow
  '#bbf7d0', // Green
  '#bfdbfe', // Blue
  '#fbcfe8', // Pink
  '#fed7aa', // Orange
  '#e9d5ff', // Purple
  '#e2e8f0', // Gray
  '#99f6e4', // Teal
];

export const DEFAULT_TOOLBAR_ITEMS: string[] = [
  'undo',
  'redo',
  '|',
  'heading',
  'fontFamily',
  'fontSize',
  '|',
  'bold',
  'italic',
  'underline',
  'strike',
  'code',
  'clearFormatting',
  '|',
  'textColor',
  'highlight',
  '|',
  'align',
  '|',
  'bulletList',
  'orderedList',
  'taskList',
  'blockquote',
  'codeBlock',
  'horizontalRule',
  '|',
  'link',
  'image',
  'table',
  'youtube',
  'emoji',
  '|',
  'fullscreen',
  'sourceCode'
];

export const MINIMAL_TOOLBAR_ITEMS: string[] = [
  'bold',
  'italic',
  'underline',
  '|',
  'heading',
  'bulletList',
  'orderedList',
  '|',
  'link',
  'image'
];
