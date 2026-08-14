import type { CSSProperties } from 'react';

/**
 * Dynamic visual overrides for one editor instance.
 * Any field can change at runtime — React will apply it on the next render.
 *
 * Named colors map onto `--rte-*` CSS variables. For anything else, use
 * `cssVariables` or the editor `style` prop.
 */
export interface RichTextEditorTheme {
  /** Primary accent used for active buttons, focus rings, links. */
  primaryColor?: string;
  /** Hover/pressed state for the primary accent. */
  primaryHoverColor?: string;
  /** Text/icon color on primary buttons. */
  primaryForegroundColor?: string;
  /** Border color for the editor chrome, inputs, and menus. */
  borderColor?: string;
  /** Editor canvas / card background. */
  backgroundColor?: string;
  /** Dropdown, popover, and modal surface. Defaults to `backgroundColor`. */
  popoverColor?: string;
  /** Text color on dropdowns and modals. Defaults to `textColor`. */
  popoverForegroundColor?: string;
  /** Toolbar bar background. */
  toolbarBackground?: string;
  /** Body prose color. */
  textColor?: string;
  /** Secondary labels, stats, placeholders. */
  textMutedColor?: string;
  /** Empty-line placeholder color. */
  placeholderColor?: string;
  /** Selection highlight. */
  selectionColor?: string;
  /** Hover fill for toolbar buttons and menu rows. */
  controlHoverColor?: string;
  /** Focus ring color. Defaults to `primaryColor`. */
  ringColor?: string;
  /** Destructive actions (remove link, over-limit). */
  dangerColor?: string;
  /** Border radius for the shell and controls (e.g. `'0.625rem'`). */
  borderRadius?: string;
  toolbarHeight?: string;
  fontFamily?: string;
  fontSize?: string;
  lineHeight?: string;
  /**
   * Extra CSS variables applied on the editor root.
   * Keys should be custom properties: `{ '--rte-primary': '#7c3aed' }`.
   */
  cssVariables?: Record<string, string>;
}

export type ThemeMode = 'light' | 'dark' | 'system' | 'custom';

/** CSS custom properties the editor chrome reads. */
export const EDITOR_CSS_VARS = {
  primary: '--rte-primary',
  primaryHover: '--rte-primary-hover',
  primaryForeground: '--rte-primary-foreground',
  border: '--rte-border',
  background: '--rte-background',
  popover: '--rte-popover',
  popoverForeground: '--rte-popover-foreground',
  toolbarBackground: '--rte-toolbar-background',
  text: '--rte-text',
  textMuted: '--rte-text-muted',
  placeholder: '--rte-placeholder',
  selection: '--rte-selection',
  borderRadius: '--rte-border-radius',
  fontFamily: '--rte-font-family',
  fontSize: '--rte-font-size',
  lineHeight: '--rte-line-height',
  control: '--rte-control',
  controlHover: '--rte-control-hover',
  muted: '--rte-muted',
  input: '--rte-input',
  ring: '--rte-ring',
  danger: '--rte-danger',
  overlay: '--rte-overlay',
  shadow: '--rte-shadow',
  shadowLg: '--rte-shadow-lg',
} as const;

export type EditorCssVar = (typeof EDITOR_CSS_VARS)[keyof typeof EDITOR_CSS_VARS];

export type EditorStyleVars = Partial<Record<EditorCssVar, string>> & CSSProperties;
