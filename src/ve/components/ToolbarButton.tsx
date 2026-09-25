import React, { forwardRef, useCallback, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ToolbarButtonProps } from '../types/toolbar';

const VIEWPORT_GAP = 8;
const TOOLTIP_GAP = 6;

function assignRef<T>(ref: React.ForwardedRef<T>, node: T | null) {
  if (typeof ref === 'function') ref(node);
  else if (ref) ref.current = node;
}

export const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  (
    {
      id,
      label,
      tooltip,
      shortcut,
      icon,
      isActive = false,
      isDisabled = false,
      onClick,
      className = '',
      ariaLabel,
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false);
    const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);

    const titleText = tooltip || label;
    const computedAriaLabel = ariaLabel || label || tooltip || 'Toolbar button';
    const showTooltip = isHovered && !isDisabled && Boolean(titleText);

    const updatePosition = useCallback(() => {
      const button = buttonRef.current;
      const tip = tooltipRef.current;
      if (!button || !tip) return;

      const rect = button.getBoundingClientRect();
      const tipWidth = tip.offsetWidth;
      const tipHeight = tip.offsetHeight;
      const placeAbove = rect.top >= tipHeight + TOOLTIP_GAP + VIEWPORT_GAP;
      const top = placeAbove ? rect.top - tipHeight - TOOLTIP_GAP : rect.bottom + TOOLTIP_GAP;
      const maxLeft = Math.max(VIEWPORT_GAP, window.innerWidth - tipWidth - VIEWPORT_GAP);
      const left = Math.min(Math.max(VIEWPORT_GAP, rect.left + rect.width / 2 - tipWidth / 2), maxLeft);

      setPos((prev) => (prev && prev.top === top && prev.left === left ? prev : { top, left }));
    }, []);

    useLayoutEffect(() => {
      if (!showTooltip) {
        setPos(null);
        return;
      }

      updatePosition();
      const frame = window.requestAnimationFrame(updatePosition);
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
      return () => {
        window.cancelAnimationFrame(frame);
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition, true);
      };
    }, [showTooltip, titleText, shortcut, updatePosition]);

    return (
      <div className="rte-btn-wrap">
        <button
          ref={(node) => {
            buttonRef.current = node;
            assignRef(ref, node);
          }}
          id={id}
          type="button"
          aria-label={computedAriaLabel}
          aria-pressed={isActive}
          disabled={isDisabled}
          onClick={(e) => {
            e.preventDefault();
            if (!isDisabled) onClick();
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
          className={`rte-btn ${isActive ? 'is-active' : ''} ${className}`.trim()}
        >
          {icon}
        </button>

        {showTooltip &&
          typeof document !== 'undefined' &&
          createPortal(
            <div
              ref={tooltipRef}
              role="tooltip"
              className="rte-tooltip"
              style={{
                top: pos?.top ?? -9999,
                left: pos?.left ?? 0,
                visibility: pos ? 'visible' : 'hidden',
              }}
            >
              <span>{titleText}</span>
              {shortcut && <kbd>{shortcut}</kbd>}
            </div>,
            document.body
          )}
      </div>
    );
  }
);

ToolbarButton.displayName = 'ToolbarButton';
