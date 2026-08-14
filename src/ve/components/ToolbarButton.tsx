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
      <div className="rte-btn-wrap">
        <button
          ref={ref}
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

        {isHovered && !isDisabled && (
          <div role="tooltip" className="rte-tooltip">
            <span>{titleText}</span>
            {shortcut && <kbd>{shortcut}</kbd>}
          </div>
        )}
      </div>
    );
  }
);

ToolbarButton.displayName = 'ToolbarButton';
