import type { CSSProperties } from 'react';
import type { RichTextEditorTheme } from '../types/theme';

/**
 * Converts a RichTextEditorTheme configuration object into CSS variable overrides.
 */
export function buildThemeStyles(
  theme?: RichTextEditorTheme,
  customStyles?: CSSProperties
): CSSProperties {
  const vars: Record<string, string> = {};

  if (theme) {
    if (theme.primaryColor) vars['--rte-primary'] = theme.primaryColor;
    if (theme.primaryHoverColor) vars['--rte-primary-hover'] = theme.primaryHoverColor;
    if (theme.borderColor) vars['--rte-border'] = theme.borderColor;
    if (theme.backgroundColor) vars['--rte-background'] = theme.backgroundColor;
    if (theme.toolbarBackground) vars['--rte-toolbar-background'] = theme.toolbarBackground;
    if (theme.textColor) vars['--rte-text'] = theme.textColor;
    if (theme.textMutedColor) vars['--rte-text-muted'] = theme.textMutedColor;
    if (theme.placeholderColor) vars['--rte-placeholder'] = theme.placeholderColor;
    if (theme.selectionColor) vars['--rte-selection'] = theme.selectionColor;
    if (theme.borderRadius) vars['--rte-border-radius'] = theme.borderRadius;
    if (theme.toolbarHeight) vars['--rte-toolbar-height'] = theme.toolbarHeight;
    if (theme.fontFamily) vars['--rte-font-family'] = theme.fontFamily;
    if (theme.fontSize) vars['--rte-font-size'] = theme.fontSize;
    if (theme.lineHeight) vars['--rte-line-height'] = theme.lineHeight;
  }

  return {
    ...vars,
    ...customStyles,
  } as CSSProperties;
}
