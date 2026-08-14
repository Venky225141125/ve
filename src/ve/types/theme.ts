/**
 * Theme configuration for the VE Rich Text Editor.
 * Allows consumers to customize colors, metrics, and font families via props or CSS variables.
 */
export interface RichTextEditorTheme {
  /** Primary accent color used for active buttons, focus outlines, links, etc. */
  primaryColor?: string;
  /** Primary hover/active background for controls */
  primaryHoverColor?: string;
  /** Border color for the editor container and toolbar divider */
  borderColor?: string;
  /** Background color for the editor root and content area */
  backgroundColor?: string;
  /** Background color for the toolbar bar */
  toolbarBackground?: string;
  /** Text color for body prose inside the editor */
  textColor?: string;
  /** Muted text color for secondary labels, stats, placeholders */
  textMutedColor?: string;
  /** Color of empty line placeholder text */
  placeholderColor?: string;
  /** Selection highlight background color */
  selectionColor?: string;
  /** Border radius for container and controls (e.g. '8px', '0.5rem') */
  borderRadius?: string;
  /** Fixed height or min-height for the toolbar (e.g. '44px') */
  toolbarHeight?: string;
  /** Font family applied to the editor content prose */
  fontFamily?: string;
  /** Base font size for editor prose (e.g. '16px', '1rem') */
  fontSize?: string;
  /** Base line height for editor prose (e.g. '1.6') */
  lineHeight?: string;
}

export type ThemeMode = 'light' | 'dark' | 'system' | 'custom';
