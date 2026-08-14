import React, { useState, useRef, useEffect, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`} id={id}>
      <button
        type="button"
        disabled={isDisabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={label}
        title={tooltip || label}
        onClick={(e) => {
          e.preventDefault();
          if (!isDisabled) setIsOpen(!isOpen);
        }}
        style={{ minWidth }}
        className={`
          flex items-center justify-between gap-1.5 px-2 py-1.5 text-xs font-medium rounded border transition-colors duration-150
          border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rte-primary,#3b82f6)]
          ${
            isDisabled
              ? 'opacity-40 cursor-not-allowed text-slate-400'
              : 'text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-850'
          }
        `}
      >
        <div className="flex items-center gap-1.5 truncate">
          {icon || selectedOption?.icon}
          <span className="truncate" style={selectedOption?.style}>
            {selectedOption?.label || label}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 opacity-60 shrink-0" />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute z-50 mt-1 max-h-60 w-max min-w-[140px] overflow-auto rounded-md bg-white dark:bg-slate-900 p-1 shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none animate-in fade-in zoom-in-95 duration-100"
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
                className={`
                  w-full flex items-center justify-start gap-2 px-2.5 py-1.5 text-xs rounded transition-colors text-left
                  ${
                    isSelected
                      ? 'bg-[var(--rte-primary-hover,rgba(59,130,246,0.15))] text-[var(--rte-primary,#3b82f6)] font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }
                `}
              >
                {opt.icon}
                <span className="truncate" style={opt.style}>
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
