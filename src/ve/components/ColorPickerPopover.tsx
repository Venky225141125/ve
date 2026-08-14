import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Pipette, Check, X } from 'lucide-react';
import { useAnchoredPopover } from '../hooks/useAnchoredPopover';

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

function isLightColor(color: string): boolean {
  const hex = color.replace('#', '');
  if (hex.length !== 3 && hex.length !== 6) return false;
  const full = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex;
  const n = parseInt(full, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
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
  const { triggerRef, popoverRef, isOpen, setIsOpen, coords, themeStyle, isDark, keepEditorSelection } =
    useAnchoredPopover();
  const [customHex, setCustomHex] = useState('#3b82f6');

  useEffect(() => {
    if (activeColor && activeColor !== 'transparent' && activeColor.startsWith('#')) {
      setCustomHex(activeColor);
    }
  }, [activeColor]);

  const applyColor = (color: string) => {
    onChange(color);
    setIsOpen(false);
  };

  const hexValue =
    customHex.startsWith('#') && (customHex.length === 4 || customHex.length === 7)
      ? customHex.length === 4
        ? `#${customHex[1]}${customHex[1]}${customHex[2]}${customHex[2]}${customHex[3]}${customHex[3]}`
        : customHex
      : '#3b82f6';

  return (
    <div ref={triggerRef} className="rte-dropdown" id={id}>
      <button
        type="button"
        disabled={isDisabled}
        title={tooltip || label}
        aria-label={label}
        aria-expanded={isOpen}
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => {
          e.preventDefault();
          if (!isDisabled) setIsOpen(!isOpen);
        }}
        className={`rte-btn ${isOpen ? 'is-active' : ''}`}
      >
        <span className="rte-color-trigger">
          {icon}
          <span
            className="rte-color-bar"
            style={{
              background:
                activeColor && activeColor !== 'transparent' ? activeColor : 'currentColor',
            }}
          />
        </span>
      </button>

      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={popoverRef}
            className={`rte-popover rte-color-panel${isDark ? ' dark' : ''}`}
            style={{
              position: 'fixed',
              top: coords.top,
              left: coords.left,
              zIndex: 200,
              width: 252,
              maxWidth: 'calc(100vw - 16px)',
              ...themeStyle,
            }}
            onMouseDown={keepEditorSelection}
          >
            <div className="rte-color-panel-header">
              <span>{label}</span>
              <button
                type="button"
                onClick={() => {
                  onClear();
                  setIsOpen(false);
                }}
                className="rte-btn-danger"
              >
                <X size={12} />
                Reset
              </button>
            </div>

            <div className="rte-swatches">
              {colors.map((c) => {
                const isSelected = Boolean(
                  activeColor && c !== 'transparent' && activeColor.toLowerCase() === c.toLowerCase()
                );
                return (
                  <button
                    key={c}
                    type="button"
                    aria-label={`Color ${c}`}
                    title={c}
                    onClick={(e) => {
                      e.preventDefault();
                      if (c === 'transparent') {
                        onClear();
                        setIsOpen(false);
                      } else {
                        applyColor(c);
                      }
                    }}
                    className={`rte-swatch ${isSelected ? 'is-selected' : ''}`}
                    style={{
                      backgroundColor: c === 'transparent' ? '#fff' : c,
                      backgroundImage:
                        c === 'transparent'
                          ? 'linear-gradient(45deg, transparent 46%, #ef4444 46%, #ef4444 54%, transparent 54%)'
                          : undefined,
                    }}
                  >
                    {isSelected && <Check size={14} color={isLightColor(c) ? '#0f172a' : '#fff'} />}
                  </button>
                );
              })}
            </div>

            <form
              className="rte-color-custom"
              onSubmit={(e) => {
                e.preventDefault();
                if (customHex.trim()) applyColor(customHex.trim());
              }}
            >
              <input
                type="color"
                value={hexValue}
                onChange={(e) => {
                  setCustomHex(e.target.value);
                  onChange(e.target.value);
                }}
                title="Pick a custom color"
                className="rte-color-native"
              />
              <input
                type="text"
                value={customHex}
                onChange={(e) => setCustomHex(e.target.value)}
                placeholder="#3b82f6"
                className="rte-input"
                aria-label="Custom hex color"
              />
              <button type="submit" className="rte-btn-primary">
                <Pipette size={14} />
                Apply
              </button>
            </form>
          </div>,
          document.body
        )}
    </div>
  );
};
