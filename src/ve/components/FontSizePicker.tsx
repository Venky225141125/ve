import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Minus, Plus } from 'lucide-react';
import { useAnchoredPopover } from '../hooks/useAnchoredPopover';
import { DEFAULT_FONT_SIZES } from '../utils/constants';

export interface FontSizePickerProps {
  value: string;
  options?: Array<{ label: string; value: string }>;
  isDisabled?: boolean;
  onChange: (value: string) => void;
  onClear?: () => void;
}

function parseSize(value: string): { amount: string; unit: string } {
  const match = String(value || '').trim().match(/^(\d+(?:\.\d+)?)([a-z%]*)$/i);
  if (!match) return { amount: '16', unit: 'px' };
  return { amount: match[1], unit: match[2] || 'px' };
}

export function normalizeFontSize(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (/^\d+(?:\.\d+)?$/.test(trimmed)) return `${trimmed}px`;
  if (/^\d+(?:\.\d+)?(px|pt|em|rem|%)$/i.test(trimmed)) {
    const parsed = parseSize(trimmed);
    return `${parsed.amount}${parsed.unit}`;
  }
  return null;
}

export const FontSizePicker: React.FC<FontSizePickerProps> = ({
  value,
  options = DEFAULT_FONT_SIZES,
  isDisabled = false,
  onChange,
  onClear,
}) => {
  const { triggerRef, popoverRef, isOpen, setIsOpen, coords, themeStyle, isDark, keepEditorSelection } =
    useAnchoredPopover();
  const parsed = parseSize(value || '16px');
  const [draft, setDraft] = useState(parsed.amount);
  const [unit, setUnit] = useState(parsed.unit || 'px');

  useEffect(() => {
    const next = parseSize(value || '16px');
    setDraft(next.amount);
    setUnit(next.unit || 'px');
  }, [value, isOpen]);

  const displayValue = value || '16px';
  const selectedLabel =
    options.find((opt) => opt.value === displayValue)?.label || displayValue;

  const mergedOptions = useMemo(() => {
    if (options.some((opt) => opt.value === displayValue)) return options;
    return [{ label: `${displayValue} (Custom)`, value: displayValue }, ...options];
  }, [options, displayValue]);

  const applySize = (next: string) => {
    const normalized = normalizeFontSize(next);
    if (!normalized) return;
    onChange(normalized);
    setIsOpen(false);
  };

  const nudge = (delta: number) => {
    const current = Number.parseFloat(parsed.amount);
    if (Number.isNaN(current)) return;
    const next = Math.max(1, Math.round((current + delta) * 10) / 10);
    onChange(`${next}${parsed.unit || 'px'}`);
  };

  return (
    <div ref={triggerRef} className="rte-dropdown rte-fontsize">
      <div className="rte-fontsize-group">
        <button
          type="button"
          className="rte-btn"
          title="Decrease font size"
          disabled={isDisabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => nudge(-1)}
        >
          <Minus size={14} />
        </button>
        <button
          type="button"
          disabled={isDisabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label="Font size"
          title="Font size"
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => {
            e.preventDefault();
            if (!isDisabled) setIsOpen(!isOpen);
          }}
          className="rte-dropdown-trigger rte-fontsize-trigger"
        >
          <span>{selectedLabel.replace(/\s*\(.*\)$/, '')}</span>
          <ChevronDown size={14} />
        </button>
        <button
          type="button"
          className="rte-btn"
          title="Increase font size"
          disabled={isDisabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => nudge(1)}
        >
          <Plus size={14} />
        </button>
      </div>

      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={popoverRef}
            role="listbox"
            className={`rte-popover rte-fontsize-panel${isDark ? ' dark' : ''}`}
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
            <form
              className="rte-fontsize-custom"
              onSubmit={(e) => {
                e.preventDefault();
                applySize(`${draft}${unit}`);
              }}
            >
              <input
                type="number"
                min={1}
                step={1}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="rte-input"
                aria-label="Custom font size"
                autoFocus
              />
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="rte-select"
                aria-label="Font size unit"
              >
                <option value="px">px</option>
                <option value="pt">pt</option>
                <option value="em">em</option>
                <option value="rem">rem</option>
                <option value="%">%</option>
              </select>
              <button type="submit" className="rte-btn-primary">
                Apply
              </button>
            </form>

            <div className="rte-fontsize-list">
              {onClear && (
                <button
                  type="button"
                  className="rte-menu-item"
                  onClick={() => {
                    onClear();
                    setIsOpen(false);
                  }}
                >
                  Default size
                </button>
              )}
              {mergedOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={opt.value === displayValue}
                  className={`rte-menu-item ${opt.value === displayValue ? 'is-selected' : ''}`}
                  style={{ fontSize: opt.value }}
                  onClick={() => applySize(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
