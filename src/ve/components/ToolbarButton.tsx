import React, { forwardRef, useState } from 'react';
import type { ToolbarButtonProps } from '../types/toolbar';

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

    const titleText = tooltip || label;
    const computedAriaLabel = ariaLabel || label || tooltip || 'Toolbar button';

    return (
      <div className="relative inline-flex items-center">
        <button
          ref={ref}
          id={id}
          type="button"
          aria-label={computedAriaLabel}
          aria-pressed={isActive}
          disabled={isDisabled}
          onClick={(e) => {
            e.preventDefault();
            if (!isDisabled) {
              onClick();
            }
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
          className={`
            relative inline-flex items-center justify-center p-1.5 min-w-[32px] min-h-[32px] rounded text-sm transition-colors duration-150
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rte-primary,#3b82f6)]
            ${
              isDisabled
                ? 'opacity-40 cursor-not-allowed text-slate-400 dark:text-slate-600'
                : isActive
                ? 'bg-[var(--rte-primary-hover,rgba(59,130,246,0.15))] text-[var(--rte-primary,#3b82f6)] font-semibold shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
            }
            ${className}
          `}
        >
          {icon}
        </button>

        {/* Accessible Tooltip with Shortcut badge */}
        {isHovered && !isDisabled && (
          <div
            role="tooltip"
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-slate-900 text-slate-100 dark:bg-slate-100 dark:text-slate-900 text-xs rounded shadow-lg whitespace-nowrap z-50 pointer-events-none flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-100"
          >
            <span>{titleText}</span>
            {shortcut && (
              <kbd className="px-1 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-300 dark:bg-slate-200 dark:text-slate-700 rounded border border-slate-700 dark:border-slate-300">
                {shortcut}
              </kbd>
            )}
          </div>
        )}
      </div>
    );
  }
);

ToolbarButton.displayName = 'ToolbarButton';
