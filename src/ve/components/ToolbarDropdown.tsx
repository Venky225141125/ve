import React, { type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import { useAnchoredPopover } from '../hooks/useAnchoredPopover';

export interface DropdownOption {
  label: string;
  value: string;
  icon?: ReactNode;
  style?: React.CSSProperties;
}

export interface ToolbarDropdownProps {
  id?: string;
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  icon?: ReactNode;
  className?: string;
  isDisabled?: boolean;
  minWidth?: string;
  tooltip?: string;
}

export const ToolbarDropdown: React.FC<ToolbarDropdownProps> = ({
  id,
  label,
  value,
  options,
  onChange,
  icon,
  className = '',
  isDisabled = false,
  minWidth = '110px',
  tooltip,
}) => {
  const { triggerRef, popoverRef, isOpen, setIsOpen, coords, themeStyle, isDark, keepEditorSelection } =
    useAnchoredPopover();

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div ref={triggerRef} className={`rte-dropdown ${className}`.trim()} id={id}>
      <button
        type="button"
        disabled={isDisabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={label}
        title={tooltip || label}
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => {
          e.preventDefault();
          if (!isDisabled) setIsOpen(!isOpen);
        }}
        style={{ minWidth }}
        className="rte-dropdown-trigger"
      >
        <div className="rte-dropdown-label">
          {icon || selectedOption?.icon}
          <span style={selectedOption?.style}>{selectedOption?.label || label}</span>
        </div>
        <ChevronDown size={14} />
      </button>

      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={popoverRef}
            role="listbox"
            className={`rte-menu rte-menu-portal${isDark ? ' dark' : ''}`}
            style={{
              position: 'fixed',
              top: coords.top,
              left: coords.left,
              zIndex: 200,
              maxWidth: 'calc(100vw - 16px)',
              ...themeStyle,
            }}
            onMouseDown={keepEditorSelection}
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`rte-menu-item ${isSelected ? 'is-selected' : ''}`}
                >
                  {opt.icon}
                  <span style={opt.style}>{opt.label}</span>
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </div>
  );
};
