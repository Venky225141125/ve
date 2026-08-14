import type { CSSProperties } from 'react';
import type { RichTextEditorTheme } from '../types/theme';

/**
 * Maps RichTextEditorTheme configuration options to CSS Custom Properties.
 */
export function buildThemeStyles(theme?: RichTextEditorTheme): CSSProperties {
  if (!theme) return {};

  const styleMap: Record<string, string | undefined> = {
    '--rte-primary': theme.primaryColor,
    '--rte-primary-hover': theme.primaryHoverColor,
    '--rte-border': theme.borderColor,
    '--rte-background': theme.backgroundColor,
    '--rte-toolbar-background': theme.toolbarBackground,
    '--rte-text': theme.textColor,
    '--rte-text-muted': theme.textMutedColor,
    '--rte-placeholder': theme.placeholderColor,
    '--rte-selection': theme.selectionColor,
    '--rte-border-radius': theme.borderRadius,
    '--rte-toolbar-height': theme.toolbarHeight,
    '--rte-font-family': theme.fontFamily,
    '--rte-font-size': theme.fontSize,
    '--rte-line-height': theme.lineHeight,
  };

  const cssProperties: Record<string, string> = {};

  Object.entries(styleMap).forEach(([prop, val]) => {
    if (val !== undefined && val !== null && val.trim() !== '') {
      cssProperties[prop] = val;
    }
  });

  return cssProperties as CSSProperties;
}
