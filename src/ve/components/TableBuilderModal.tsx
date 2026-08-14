import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Table as TableIcon, Plus, Trash2, Merge } from 'lucide-react';
import type { Editor } from '@tiptap/core';
import { useAnchoredPopover } from '../hooks/useAnchoredPopover';

export interface TableBuilderModalProps {
  editor: Editor | null;
  isDisabled?: boolean;
}

export const TableBuilderModal: React.FC<TableBuilderModalProps> = ({
  editor,
  isDisabled = false,
}) => {
  const { triggerRef, popoverRef, isOpen, setIsOpen, coords, themeStyle, isDark, keepEditorSelection } =
    useAnchoredPopover();
  const [hoverRows, setHoverRows] = useState(3);
  const [hoverCols, setHoverCols] = useState(3);
  const isInsideTable = editor?.isActive('table') ?? false;

  const insertTable = (rows: number, cols: number) => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
    setIsOpen(false);
  };

  const run = (command: () => void) => {
    command();
    setIsOpen(false);
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
          if (!isDisabled) setIsOpen(!isOpen);
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
            className={`rte-popover${isDark ? ' dark' : ''}`}
            style={{
              position: 'fixed',
              top: coords.top,
              left: coords.left,
              zIndex: 200,
              minWidth: 220,
              ...themeStyle,
            }}
            onMouseDown={keepEditorSelection}
          >
            <div className="rte-modal-title" style={{ marginBottom: 8 }}>
              <span>{isInsideTable ? 'Table Actions' : 'Insert Table'}</span>
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
                  onClick={() => run(() => editor?.chain().focus().toggleHeaderRow().run())}
                >
                  <TableIcon size={14} /> Toggle Header Row
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
