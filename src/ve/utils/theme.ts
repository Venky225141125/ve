import type { CSSProperties } from 'react';
import type { RichTextEditorTheme } from '../types/theme';

/** WCAG minimum for icons and other UI graphics. */
const ICON_CONTRAST = 3;

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
  '--rte-on-hover',
  '--rte-on-active',
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

function parseColor(color: string): [number, number, number] | null {
  const rgb = color.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];

  const hex = color.trim().replace('#', '');
  if (!/^[0-9a-f]{3}$|^[0-9a-f]{6}$/i.test(hex)) return null;
  const full = hex.length === 3 ? hex.split('').map((char) => char + char).join('') : hex;
  return [parseInt(full.slice(0, 2), 16), parseInt(full.slice(2, 4), 16), parseInt(full.slice(4, 6), 16)];
}

function channel(value: number): number {
  const scaled = value / 255;
  return scaled <= 0.03928 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
}

function contrastRatio(a: [number, number, number], b: [number, number, number]): number {
  const luminance = (rgb: [number, number, number]) =>
    0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
  const lighter = Math.max(luminance(a), luminance(b));
  const darker = Math.min(luminance(a), luminance(b));
  return (lighter + 0.05) / (darker + 0.05);
}

function readableOn(background: string, preferred: string[]): string {
  const bg = parseColor(background);
  const options = preferred
    .map((color) => ({ color, rgb: parseColor(color) }))
    .filter((item): item is { color: string; rgb: [number, number, number] } => Boolean(item.rgb));
  if (!bg || options.length === 0) return preferred[0] || '#0f172a';

  const passing = options.find((item) => contrastRatio(bg, item.rgb) >= ICON_CONTRAST);
  if (passing) return passing.color;

  return options.sort((a, b) => contrastRatio(bg, b.rgb) - contrastRatio(bg, a.rgb))[0].color;
}

/**
 * Picks icon colors that stay visible on the toolbar, including hover and selected fills.
 * A light toolbar on a dark page (Emerald Forest) would otherwise keep light icons.
 */
export function readControlContrast(root: HTMLElement): CSSProperties {
  const toolbarBg = resolveCssColor(root, '--rte-toolbar-background');
  const hoverBg = resolveCssColor(root, '--rte-control-hover');
  const text = resolveCssColor(root, '--rte-text');
  const control = resolveCssColor(root, '--rte-control');
  const primary = resolveCssColor(root, '--rte-primary');
  const ink = '#0f172a';
  const paper = '#f8fafc';
  const surfaceBg = resolveCssColor(root, '--rte-background');
  const preferred = [control, text, ink, paper].filter(Boolean);
  const onToolbar = toolbarBg ? readableOn(toolbarBg, preferred) : control || ink;
  const onSurface = surfaceBg ? readableOn(surfaceBg, preferred) : control || ink;

  if (!hoverBg) {
    return {
      '--rte-on-toolbar': onToolbar,
      '--rte-on-surface': onSurface,
    } as CSSProperties;
  }

  return {
    '--rte-on-toolbar': onToolbar,
    '--rte-on-surface': onSurface,
    '--rte-on-hover': readableOn(hoverBg, [onToolbar, ...preferred]),
    '--rte-on-active': readableOn(hoverBg, [primary, onToolbar, ...preferred].filter(Boolean)),
  } as CSSProperties;
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
