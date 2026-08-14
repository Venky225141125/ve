import type { CSSProperties } from 'react';
import type { RichTextEditorTheme } from '../types/theme';

const LIGHT = {
  popover: '#ffffff',
  popoverForeground: '#0f172a',
  border: '#e2e8f0',
  background: '#ffffff',
  muted: '#f1f5f9',
  overlay: 'rgba(15, 23, 42, 0.45)',
} as const;

const DARK = {
  popover: '#1e293b',
  popoverForeground: '#f8fafc',
  border: 'rgba(255, 255, 255, 0.1)',
  background: '#1e293b',
  muted: '#334155',
  overlay: 'rgba(2, 6, 23, 0.7)',
} as const;

const COLOR_VARS = [
  '--rte-primary',
  '--rte-primary-hover',
  '--rte-primary-foreground',
  '--rte-border',
  '--rte-background',
  '--rte-popover',
  '--rte-popover-foreground',
  '--rte-toolbar-background',
  '--rte-text',
  '--rte-text-muted',
  '--rte-control',
  '--rte-control-hover',
  '--rte-muted',
  '--rte-input',
  '--rte-ring',
  '--rte-danger',
  '--rte-success',
  '--rte-overlay',
] as const;

function isUsableColor(value: string): boolean {
  const normalized = value.replace(/\s+/g, '').toLowerCase();
  return Boolean(
    value &&
      normalized !== 'transparent' &&
      normalized !== 'rgba(0,0,0,0)' &&
      !value.includes('var(')
  );
}

function resolveCssColor(el: HTMLElement, varName: string): string {
  const probe = document.createElement('span');
  probe.style.cssText =
    'position:absolute;left:-9999px;width:1px;height:1px;pointer-events:none;visibility:hidden;';
  probe.style.backgroundColor = `var(${varName})`;
  el.appendChild(probe);
  const color = getComputedStyle(probe).backgroundColor;
  probe.remove();
  return isUsableColor(color) ? color : '';
}

function resolveCssValue(el: HTMLElement, varName: string, cssProp: string): string {
  const probe = document.createElement('span');
  probe.style.cssText =
    'position:absolute;left:-9999px;width:8px;height:8px;pointer-events:none;visibility:hidden;';
  probe.style.setProperty(cssProp, `var(${varName})`);
  el.appendChild(probe);
  const value = getComputedStyle(probe).getPropertyValue(cssProp).trim();
  probe.remove();
  return value && value !== 'none' ? value : '';
}

export function findEditorRoot(from?: Element | null): HTMLElement | null {
  if (from) {
    const nested = from.closest('.rte-root') as HTMLElement | null;
    if (nested) return nested;
  }
  if (typeof document === 'undefined') return null;
  return (document.querySelector('.rte-root') as HTMLElement | null) || document.documentElement;
}

export function readEditorTheme(from?: Element | null): {
  isDark: boolean;
  style: CSSProperties;
  surfaceStyle: CSSProperties;
} {
  const root = findEditorRoot(from);
  const isDark = Boolean(
    from?.closest('.dark') ||
      root?.closest('.dark') ||
      root?.classList.contains('dark') ||
      (typeof document !== 'undefined' && document.documentElement.classList.contains('dark'))
  );
  const palette = isDark ? DARK : LIGHT;

  if (!root) {
    const style = {
      '--rte-popover': palette.popover,
      '--rte-popover-foreground': palette.popoverForeground,
      '--rte-border': palette.border,
      '--rte-background': palette.background,
    } as CSSProperties;
    return {
      isDark,
      style,
      surfaceStyle: {
        ...style,
        backgroundColor: palette.popover,
        color: palette.popoverForeground,
        borderColor: palette.border,
      },
    };
  }

  const style: Record<string, string> = {};
  COLOR_VARS.forEach((name) => {
    const value = resolveCssColor(root, name);
    if (value) style[name] = value;
  });

  const radius = resolveCssValue(root, '--rte-border-radius', 'border-radius');
  if (radius) style['--rte-border-radius'] = radius;
  const shadow = resolveCssValue(root, '--rte-shadow-lg', 'box-shadow');
  if (shadow) style['--rte-shadow-lg'] = shadow;
  const font = resolveCssValue(root, '--rte-font-family', 'font-family');
  if (font) style['--rte-font-family'] = font;

  const popover = style['--rte-popover'] || resolveCssColor(root, '--popover') || palette.popover;
  const foreground =
    style['--rte-popover-foreground'] ||
    resolveCssColor(root, '--popover-foreground') ||
    palette.popoverForeground;
  const border = style['--rte-border'] || resolveCssColor(root, '--border') || palette.border;

  style['--rte-popover'] = popover;
  style['--rte-popover-foreground'] = foreground;
  style['--rte-border'] = border;

  return {
    isDark,
    style: style as CSSProperties,
    surfaceStyle: {
      ...(style as CSSProperties),
      backgroundColor: popover,
      color: foreground,
      borderColor: border,
    },
  };
}

function assignVar(target: Record<string, string>, name: string, value?: string) {
  if (value === undefined || value === null) return;
  const trimmed = String(value).trim();
  if (!trimmed) return;
  target[name] = trimmed;
}

/**
 * Maps theme tokens and extra CSS variables onto the editor root.
 * Later sources win: named `theme` fields → `theme.cssVariables` → `cssVariables`.
 */
export function buildThemeStyles(
  theme?: RichTextEditorTheme,
  cssVariables?: Record<string, string>
): CSSProperties {
  if (!theme && !cssVariables) return {};

  const cssProperties: Record<string, string> = {};

  if (theme) {
    assignVar(cssProperties, '--rte-primary', theme.primaryColor);
    assignVar(cssProperties, '--rte-primary-hover', theme.primaryHoverColor);
    assignVar(cssProperties, '--rte-primary-foreground', theme.primaryForegroundColor);
    assignVar(cssProperties, '--rte-border', theme.borderColor);
    assignVar(cssProperties, '--rte-input', theme.borderColor);
    assignVar(cssProperties, '--rte-background', theme.backgroundColor);
    assignVar(cssProperties, '--rte-popover', theme.popoverColor || theme.backgroundColor);
    assignVar(cssProperties, '--rte-popover-foreground', theme.popoverForegroundColor || theme.textColor);
    assignVar(cssProperties, '--rte-toolbar-background', theme.toolbarBackground);
    assignVar(cssProperties, '--rte-text', theme.textColor);
    assignVar(cssProperties, '--rte-control', theme.textColor);
    assignVar(cssProperties, '--rte-text-muted', theme.textMutedColor);
    assignVar(cssProperties, '--rte-placeholder', theme.placeholderColor || theme.textMutedColor);
    assignVar(cssProperties, '--rte-selection', theme.selectionColor);
    assignVar(cssProperties, '--rte-control-hover', theme.controlHoverColor);
    assignVar(cssProperties, '--rte-muted', theme.toolbarBackground);
    assignVar(cssProperties, '--rte-ring', theme.ringColor || theme.primaryColor);
    assignVar(cssProperties, '--rte-danger', theme.dangerColor);
    assignVar(cssProperties, '--rte-border-radius', theme.borderRadius);
    assignVar(cssProperties, '--rte-toolbar-height', theme.toolbarHeight);
    assignVar(cssProperties, '--rte-font-family', theme.fontFamily);
    assignVar(cssProperties, '--rte-font-size', theme.fontSize);
    assignVar(cssProperties, '--rte-line-height', theme.lineHeight);

    if (theme.cssVariables) {
      Object.entries(theme.cssVariables).forEach(([name, value]) => assignVar(cssProperties, name, value));
    }
  }

  if (cssVariables) {
    Object.entries(cssVariables).forEach(([name, value]) => assignVar(cssProperties, name, value));
  }

  return cssProperties as CSSProperties;
}
