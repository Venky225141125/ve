import React, { useState, useRef, useEffect } from 'react';
import { Pipette, Check, X } from 'lucide-react';

export interface ColorPickerPopoverProps {
  id?: string;
  label: string;
  tooltip?: string;
  icon: React.ReactNode;
  activeColor?: string;
  colors: string[];
  onChange: (color: string) => void;
  onClear: () => void;
  isDisabled?: boolean;
}

export const ColorPickerPopover: React.FC<ColorPickerPopoverProps> = ({
  id,
  label,
  tooltip,
  icon,
  activeColor,
  colors,
  onChange,
  onClear,
  isDisabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customHex, setCustomHex] = useState(activeColor || '#000000');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeColor && activeColor !== 'transparent') {
      setCustomHex(activeColor);
    }
  }, [activeColor]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customHex) {
      onChange(customHex);
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative inline-block" id={id}>
      <button
        type="button"
        disabled={isDisabled}
        title={tooltip || label}
        aria-label={label}
        aria-expanded={isOpen}
        onClick={(e) => {
          e.preventDefault();
          if (!isDisabled) setIsOpen(!isOpen);
        }}
        className={`
          relative inline-flex items-center justify-center p-1.5 min-w-[32px] min-h-[32px] rounded text-sm transition-colors
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rte-primary,#3b82f6)]
          ${
            isDisabled
              ? 'opacity-40 cursor-not-allowed text-slate-400'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }
        `}
      >
        <div className="flex flex-col items-center">
          {icon}
          {activeColor && activeColor !== 'transparent' && (
            <span
              className="w-4 h-1 mt-0.5 rounded-full border border-black/10 dark:border-white/20"
              style={{ backgroundColor: activeColor }}
            />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1.5 p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl w-56 animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>{label}</span>
            <button
              type="button"
              onClick={() => {
                onClear();
                setIsOpen(false);
              }}
              className="text-[11px] text-red-500 hover:text-red-600 dark:text-red-400 flex items-center gap-1 hover:underline"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          </div>

          {/* Palette Swatches */}
          <div className="grid grid-cols-5 gap-1.5 mb-3">
            {colors.map((c) => {
              const isSelected = activeColor?.toLowerCase() === c.toLowerCase();
              return (
                <button
                  key={c}
                  type="button"
                  aria-label={`Color ${c}`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (c === 'transparent') {
                      onClear();
                    } else {
                      onChange(c);
                    }
                    setIsOpen(false);
                  }}
                  className="w-8 h-8 rounded-md border border-slate-200 dark:border-slate-700 relative flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--rte-primary,#3b82f6)]"
                  style={{
                    backgroundColor: c === 'transparent' ? 'transparent' : c,
                    backgroundImage:
                      c === 'transparent'
                        ? 'linear-gradient(45deg, #ef4444 1px, transparent 1px, transparent 100%)'
                        : undefined,
                  }}
                >
                  {isSelected && (
                    <Check
                      className={`w-3.5 h-3.5 ${
                        c === '#ffffff' || c === '#fef08a' || c === '#bbf7d0'
                          ? 'text-slate-900'
                          : 'text-white'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Custom Hex Picker */}
          <form onSubmit={handleCustomSubmit} className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <div className="relative flex-1">
                <input
                  type="color"
                  value={customHex.startsWith('#') && customHex.length === 7 ? customHex : '#3b82f6'}
                  onChange={(e) => setCustomHex(e.target.value)}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  title="Pick custom color"
                />
                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs">
                  <Pipette className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <input
                    type="text"
                    value={customHex}
                    onChange={(e) => setCustomHex(e.target.value)}
                    placeholder="#000000"
                    className="w-full bg-transparent font-mono text-xs focus:outline-none text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-2.5 py-1 bg-[var(--rte-primary,#3b82f6)] text-white text-xs font-medium rounded hover:opacity-90 transition-opacity"
              >
                Apply
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
