import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent } from 'react';
import { readEditorTheme } from '../utils/theme';

const PADDING = 8;

function clamp(value: number, min: number, max: number): number {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
}

export function useAnchoredPopover() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [themeStyle, setThemeStyle] = useState<CSSProperties>({});
  const [isDark, setIsDark] = useState(false);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    const popover = popoverRef.current;
    if (!trigger || !popover) return;

    const rect = trigger.getBoundingClientRect();
    const popWidth = Math.max(popover.offsetWidth, 1);
    const popHeight = Math.max(popover.offsetHeight, 1);
    const viewWidth = window.innerWidth;
    const viewHeight = window.innerHeight;

    let left = rect.left;
    if (left + popWidth > viewWidth - PADDING) {
      left = rect.right - popWidth;
    }
    left = clamp(left, PADDING, viewWidth - popWidth - PADDING);

    let top = rect.bottom + 4;
    if (top + popHeight > viewHeight - PADDING) {
      top = rect.top - popHeight - 4;
    }
    top = clamp(top, PADDING, viewHeight - popHeight - PADDING);

    setCoords((prev) => (prev.top === top && prev.left === left ? prev : { top, left }));
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) return;
    const trigger = triggerRef.current;
    const theme = readEditorTheme(trigger);
    setThemeStyle(theme.surfaceStyle);
    setIsDark(theme.isDark);
    updatePosition();
    const frame = window.requestAnimationFrame(updatePosition);
    return () => window.cancelAnimationFrame(frame);
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;

    const popover = popoverRef.current;
    const observer = popover ? new ResizeObserver(() => updatePosition()) : null;
    if (popover && observer) observer.observe(popover);

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (triggerRef.current?.contains(target) || popoverRef.current?.contains(target)) return;
      if (document.activeElement instanceof HTMLInputElement && document.activeElement.type === 'color') {
        return;
      }
      setIsOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      observer?.disconnect();
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, updatePosition]);

  const keepEditorSelection = (event: ReactMouseEvent) => {
    const el = event.target as HTMLElement;
    if (el.closest('input, textarea, select, button[type="submit"]')) return;
    event.preventDefault();
  };

  return {
    triggerRef,
    popoverRef,
    isOpen,
    setIsOpen,
    coords,
    themeStyle,
    isDark,
    keepEditorSelection,
  };
}
