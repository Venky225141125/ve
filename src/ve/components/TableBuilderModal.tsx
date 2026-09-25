import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Table as TableIcon,
  Plus,
  Trash2,
  Merge,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Columns3,
  Rows3,
} from 'lucide-react';
import type { Editor } from '@tiptap/core';
import { useAnchoredPopover } from '../hooks/useAnchoredPopover';
import { TEXT_COLORS } from '../utils/constants';
import { isTableBorderStyle, type TableBorderStyle } from '../extensions/table';
import {
  isHeaderColumnActive,
  setCellAlign,
  setCurrentCellColor,
  setHeaderRowColor,
  setTableBorder,
  toggleTableStriped,
  type CellAlign,
} from '../utils/table';

export interface TableBuilderModalProps {
  editor: Editor | null;
  isDisabled?: boolean;
}

const BORDER_OPTIONS: { id: TableBorderStyle; label: string; title: string }[] = [
  { id: 'full', label: 'Full', title: 'Complete border around every cell' },
  { id: 'outer', label: 'Outer', title: 'Border around the outside of the table' },
  { id: 'double', label: 'Double', title: 'Double border around every cell' },
  { id: 'dashed', label: 'Dashed', title: 'Dashed border around every cell' },
  { id: 'none', label: 'None', title: 'Remove table borders' },
];

const FILL_COLORS = [
  '#f8fafc', '#e2e8f0', '#cbd5e1', '#94a3b8',
  '#fee2e2', '#ffedd5', '#fef9c3', '#dcfce7',
  '#cffafe', '#dbeafe', '#ede9fe', '#fce7f3',
  '#fecaca', '#fed7aa', '#fde68a', '#bbf7d0',
  '#0f172a', '#1e293b', '#b91c1c', '#1d4ed8',
  '#15803d', '#7c3aed', '#be185d', '#ffffff',
];

const ALIGN_OPTIONS: { id: CellAlign; label: string; icon: typeof AlignLeft }[] = [
  { id: 'left', label: 'Align left', icon: AlignLeft },
  { id: 'center', label: 'Align center', icon: AlignCenter },
  { id: 'right', label: 'Align right', icon: AlignRight },
];

function colorsMatch(current: string | null | undefined, swatch: string): boolean {
  if (!current) return false;
  return current.trim().toLowerCase() === swatch.toLowerCase();
}

export const TableBuilderModal: React.FC<TableBuilderModalProps> = ({
  editor,
  isDisabled = false,
}) => {
  const { triggerRef, popoverRef, isOpen, setIsOpen, coords, themeStyle, isDark, keepEditorSelection } =
    useAnchoredPopover();
  const [hoverRows, setHoverRows] = useState(3);
  const [hoverCols, setHoverCols] = useState(3);
  const [colorTarget, setColorTarget] = useState<'header' | 'cell'>('cell');
  const [colorKind, setColorKind] = useState<'background' | 'text'>('background');
  const [, setEditorVersion] = useState(0);
  const isInsideTable = editor?.isActive('table') ?? false;

  useEffect(() => {
    if (!editor || !isOpen) return;
    const refresh = () => setEditorVersion((version) => version + 1);
    editor.on('transaction', refresh);
    return () => {
      editor.off('transaction', refresh);
    };
  }, [editor, isOpen]);

  const insertTable = (rows: number, cols: number) => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
    setIsOpen(false);
  };

  const run = (command: () => void) => {
    command();
    setIsOpen(false);
  };

  const openMenu = () => {
    setColorTarget(editor?.isActive('tableHeader') ? 'header' : 'cell');
    setColorKind('background');
    setIsOpen(true);
  };

  const inHeader = editor?.isActive('tableHeader') ?? false;
  const tableAttrs = editor?.getAttributes('table');
  const borderStyle = isTableBorderStyle(tableAttrs?.borderStyle) ? tableAttrs.borderStyle : 'full';
  const striped = Boolean(tableAttrs?.striped);
  const headerColumn = editor ? isHeaderColumnActive(editor) : false;
  const cellAttrs = inHeader ? editor?.getAttributes('tableHeader') : editor?.getAttributes('tableCell');
  const align = (cellAttrs?.align as CellAlign | null) || 'left';
  const activeColor =
    colorTarget === 'header'
      ? colorKind === 'background'
        ? (cellAttrs?.backgroundColor as string | null)
        : (cellAttrs?.textColor as string | null)
      : colorKind === 'background'
        ? (cellAttrs?.backgroundColor as string | null)
        : (cellAttrs?.textColor as string | null);
  const palette = colorKind === 'background' ? FILL_COLORS : TEXT_COLORS;
  const headerColorLocked = colorTarget === 'header' && !inHeader;

  const applyColor = (color: string | null) => {
    if (!editor || headerColorLocked) return;
    if (colorTarget === 'header') {
      setHeaderRowColor(editor, colorKind === 'background' ? 'backgroundColor' : 'textColor', color);
      return;
    }
    setCurrentCellColor(editor, colorKind === 'background' ? 'backgroundColor' : 'textColor', color);
  };

  return (
    <div ref={triggerRef} className="rte-dropdown">
      <button
        type="button"
        disabled={isDisabled}
        title="Insert or modify table"
        aria-label="Table menu"
        aria-expanded={isOpen}
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => {
          e.preventDefault();
          if (isDisabled) return;
          if (isOpen) setIsOpen(false);
          else openMenu();
        }}
        className={`rte-btn ${isInsideTable || isOpen ? 'is-active' : ''}`}
      >
        <TableIcon size={16} />
      </button>

      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={popoverRef}
            className={`rte-popover${isInsideTable ? ' rte-table-menu' : ''}${isDark ? ' dark' : ''}`}
            style={{
              position: 'fixed',
              top: coords.top,
              left: coords.left,
              zIndex: 200,
              minWidth: isInsideTable ? 292 : 220,
              ...themeStyle,
            }}
            onMouseDown={keepEditorSelection}
          >
            <div className="rte-modal-title" style={{ marginBottom: 8 }}>
              <span>{isInsideTable ? 'Table options' : 'Insert Table'}</span>
              {!isInsideTable && (
                <span className="rte-muted">
                  {hoverCols} × {hoverRows}
                </span>
              )}
            </div>

            {!isInsideTable ? (
              <div>
                <div
                  className="rte-table-grid"
                  onMouseLeave={() => {
                    setHoverRows(3);
                    setHoverCols(3);
                  }}
                >
                  {Array.from({ length: 6 }).map((_, rIdx) =>
                    Array.from({ length: 6 }).map((__, cIdx) => {
                      const r = rIdx + 1;
                      const c = cIdx + 1;
                      const isHighlighted = r <= hoverRows && c <= hoverCols;
                      return (
                        <div
                          key={`${r}-${c}`}
                          onMouseEnter={() => {
                            setHoverRows(r);
                            setHoverCols(c);
                          }}
                          onClick={() => insertTable(r, c)}
                          className={`rte-table-cell ${isHighlighted ? 'is-on' : ''}`}
                        />
                      );
                    })
                  )}
                </div>
                <p className="rte-muted">
                  Click to insert {hoverCols} × {hoverRows} table
                </p>
              </div>
            ) : (
              <div>
                <div className="rte-menu-label">Border</div>
                <div className="rte-border-options" role="group" aria-label="Table border">
                  {BORDER_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={`rte-border-option${borderStyle === option.id ? ' is-selected' : ''}`}
                      title={option.title}
                      aria-label={option.title}
                      aria-pressed={borderStyle === option.id}
                      onClick={() => editor && setTableBorder(editor, option.id)}
                    >
                      <span className={`rte-border-preview is-${option.id}`} />
                      {option.label}
                    </button>
                  ))}
                </div>

                <div className="rte-menu-label">Color</div>
                <div className="rte-segment" role="group" aria-label="Where to apply color">
                  <button
                    type="button"
                    className={colorTarget === 'header' ? 'is-active' : ''}
                    aria-pressed={colorTarget === 'header'}
                    onClick={() => setColorTarget('header')}
                  >
                    Header row
                  </button>
                  <button
                    type="button"
                    className={colorTarget === 'cell' ? 'is-active' : ''}
                    aria-pressed={colorTarget === 'cell'}
                    onClick={() => setColorTarget('cell')}
                  >
                    This cell
                  </button>
                </div>
                <div className="rte-segment" role="group" aria-label="Color type">
                  <button
                    type="button"
                    className={colorKind === 'background' ? 'is-active' : ''}
                    aria-pressed={colorKind === 'background'}
                    onClick={() => setColorKind('background')}
                  >
                    Background
                  </button>
                  <button
                    type="button"
                    className={colorKind === 'text' ? 'is-active' : ''}
                    aria-pressed={colorKind === 'text'}
                    onClick={() => setColorKind('text')}
                  >
                    Text
                  </button>
                </div>
                <div className={`rte-table-colors${headerColorLocked ? ' is-disabled' : ''}`}>
                  <div className="rte-table-color-head">
                    <span className="rte-menu-label" style={{ paddingBottom: 6 }}>
                      {colorTarget === 'header' ? 'Header row' : 'This cell'}{' '}
                      {colorKind === 'background' ? 'background' : 'text'}
                    </span>
                    <button
                      type="button"
                      className="rte-table-reset"
                      disabled={headerColorLocked}
                      onClick={() => applyColor(null)}
                    >
                      Reset
                    </button>
                  </div>
                  {headerColorLocked && (
                    <p className="rte-table-hint">Click a header cell, then open this menu to color the header row.</p>
                  )}
                  <div className="rte-table-swatches">
                    {palette.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`rte-swatch${colorsMatch(activeColor, color) ? ' is-selected' : ''}`}
                        style={{ background: color }}
                        title={color}
                        aria-label={color}
                        disabled={headerColorLocked}
                        onClick={() => applyColor(color)}
                      />
                    ))}
                  </div>
                </div>

                <div className="rte-menu-label">Align cell</div>
                <div className="rte-segment" role="group" aria-label="Cell alignment">
                  {ALIGN_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={align === option.id ? 'is-active' : ''}
                        title={option.label}
                        aria-label={option.label}
                        aria-pressed={align === option.id}
                        onClick={() => editor && setCellAlign(editor, option.id)}
                      >
                        <Icon size={14} />
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  className={`rte-menu-item${striped ? ' is-selected' : ''}`}
                  aria-pressed={striped}
                  onClick={() => editor && toggleTableStriped(editor)}
                >
                  <Rows3 size={14} /> Striped rows
                  {striped && <span className="rte-menu-state">On</span>}
                </button>
                <button
                  type="button"
                  className={`rte-menu-item${headerColumn ? ' is-selected' : ''}`}
                  aria-pressed={headerColumn}
                  onClick={() => editor?.chain().focus().toggleHeaderColumn().run()}
                >
                  <Columns3 size={14} /> Header column
                  {headerColumn && <span className="rte-menu-state">On</span>}
                </button>
                <button
                  type="button"
                  className="rte-menu-item"
                  onClick={() => editor?.chain().focus().toggleHeaderRow().run()}
                >
                  <TableIcon size={14} /> Header row
                </button>

                <div className="rte-menu-divider" />

                <button
                  type="button"
                  className="rte-menu-item"
                  onClick={() => run(() => editor?.chain().focus().addRowBefore().run())}
                >
                  <Plus size={14} /> Add Row Above
                </button>
                <button
                  type="button"
                  className="rte-menu-item"
                  onClick={() => run(() => editor?.chain().focus().addRowAfter().run())}
                >
                  <Plus size={14} /> Add Row Below
                </button>
                <button
                  type="button"
                  className="rte-menu-item"
                  onClick={() => run(() => editor?.chain().focus().addColumnBefore().run())}
                >
                  <Plus size={14} /> Add Col Left
                </button>
                <button
                  type="button"
                  className="rte-menu-item"
                  onClick={() => run(() => editor?.chain().focus().addColumnAfter().run())}
                >
                  <Plus size={14} /> Add Col Right
                </button>
                <button
                  type="button"
                  className="rte-menu-item"
                  onClick={() => run(() => editor?.chain().focus().mergeOrSplit().run())}
                >
                  <Merge size={14} /> Merge / Split Cell
                </button>
                <button
                  type="button"
                  className="rte-menu-item"
                  onClick={() => run(() => editor?.chain().focus().deleteRow().run())}
                >
                  <Trash2 size={14} /> Delete Current Row
                </button>
                <button
                  type="button"
                  className="rte-menu-item"
                  onClick={() => run(() => editor?.chain().focus().deleteColumn().run())}
                >
                  <Trash2 size={14} /> Delete Current Column
                </button>
                <button
                  type="button"
                  className="rte-menu-item"
                  onClick={() => run(() => editor?.chain().focus().deleteTable().run())}
                >
                  <Trash2 size={14} /> Delete Whole Table
                </button>
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  );
};
