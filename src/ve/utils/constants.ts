import type { StandardToolbarItem, ToolbarConfig, ToolbarItem } from '../types/toolbar';

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
  { label: '8', value: '8px' },
  { label: '9', value: '9px' },
  { label: '10', value: '10px' },
  { label: '11', value: '11px' },
  { label: '12', value: '12px' },
  { label: '14', value: '14px' },
  { label: '16', value: '16px' },
  { label: '18', value: '18px' },
  { label: '20', value: '20px' },
  { label: '22', value: '22px' },
  { label: '24', value: '24px' },
  { label: '28', value: '28px' },
  { label: '32', value: '32px' },
  { label: '36', value: '36px' },
  { label: '42', value: '42px' },
  { label: '48', value: '48px' },
  { label: '56', value: '56px' },
  { label: '64', value: '64px' },
  { label: '72', value: '72px' },
];

export const TEXT_COLORS = [
  '#000000', '#1e293b', '#334155', '#64748b', '#94a3b8', '#cbd5e1', '#ffffff',
  '#7f1d1d', '#b91c1c', '#ef4444', '#f97316', '#f59e0b', '#eab308', '#facc15',
  '#166534', '#16a34a', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#1d4ed8', '#2563eb', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#db2777', '#ec4899', '#f43f5e',
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

export const STANDARD_TOOLBAR_ITEMS: string[] = [
  'undo',
  'redo',
  '|',
  'heading',
  '|',
  'bold',
  'italic',
  'underline',
  '|',
  'textColor',
  'highlight',
  '|',
  'bulletList',
  'orderedList',
  '|',
  'link',
  'image',
];

export const MINIMAL_TOOLBAR_ITEMS: string[] = [
  'bold',
  'italic',
  'underline',
  '|',
  'bulletList',
  'orderedList',
  '|',
  'link',
];

const TOOLBAR_FEATURE_MAP: Record<string, string> = {
  bold: 'bold',
  italic: 'italic',
  underline: 'underline',
  strike: 'strike',
  code: 'code',
  superscript: 'superscript',
  subscript: 'subscript',
  heading: 'headings',
  paragraph: 'paragraph',
  fontFamily: 'fontFamily',
  fontSize: 'fontSize',
  textColor: 'textColor',
  highlight: 'highlight',
  align: 'textAlign',
  alignLeft: 'textAlign',
  alignCenter: 'textAlign',
  alignRight: 'textAlign',
  alignJustify: 'textAlign',
  bulletList: 'bulletList',
  orderedList: 'orderedList',
  taskList: 'taskList',
  blockquote: 'blockquote',
  codeBlock: 'codeBlock',
  horizontalRule: 'horizontalRule',
  link: 'links',
  image: 'images',
  table: 'tables',
  youtube: 'youtube',
  emoji: 'emoji',
  undo: 'history',
  redo: 'history',
};

export function isToolbarItemEnabled(
  item: string | { id?: string },
  features: Record<string, unknown> = {}
): boolean {
  if (typeof item !== 'string') return true;
  if (item === '|' || item === 'fullscreen' || item === 'sourceCode' || item === 'clearFormatting') {
    return true;
  }
  const featureKey = TOOLBAR_FEATURE_MAP[item];
  if (!featureKey) return true;
  return features[featureKey] !== false;
}

export function toolbarOffersItem(
  toolbar: ToolbarItem[] | false,
  item: StandardToolbarItem,
  features: Record<string, unknown> = {}
): boolean {
  if (toolbar === false) return false;
  return toolbar.some((entry) => entry === item && isToolbarItemEnabled(entry, features));
}

export function resolveToolbarItems(toolbar?: ToolbarConfig): ToolbarItem[] | false {
  if (toolbar === false || toolbar === 'none') return false;
  if (toolbar === undefined || toolbar === 'full') {
    return DEFAULT_TOOLBAR_ITEMS as ToolbarItem[];
  }
  if (toolbar === 'standard') {
    return STANDARD_TOOLBAR_ITEMS as ToolbarItem[];
  }
  if (toolbar === 'minimal' || toolbar === 'limited') {
    return MINIMAL_TOOLBAR_ITEMS as ToolbarItem[];
  }
  if (Array.isArray(toolbar)) {
    return toolbar.flat() as ToolbarItem[];
  }
  return DEFAULT_TOOLBAR_ITEMS as ToolbarItem[];
}

export function collapseToolbarSeparators<T>(items: T[]): T[] {
  const collapsed: T[] = [];
  for (const item of items) {
    const isSep = item === '|';
    const lastIsSep = collapsed.length > 0 && collapsed[collapsed.length - 1] === '|';
    if (isSep && (collapsed.length === 0 || lastIsSep)) continue;
    collapsed.push(item);
  }
  if (collapsed[collapsed.length - 1] === '|') collapsed.pop();
  return collapsed;
}
