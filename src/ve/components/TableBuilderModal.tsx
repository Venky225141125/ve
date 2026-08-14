import React, { useState, useRef, useEffect } from 'react';
import { Table as TableIcon, Plus, Trash2, Merge } from 'lucide-react';
import type { Editor } from '@tiptap/core';

export interface TableBuilderModalProps {
  editor: Editor | null;
  isDisabled?: boolean;
}

export const TableBuilderModal: React.FC<TableBuilderModalProps> = ({
  editor,
  isDisabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoverRows, setHoverRows] = useState(3);
  const [hoverCols, setHoverCols] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);

  const isInsideTable = editor?.isActive('table') ?? false;

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

  const insertTable = (rows: number, cols: number) => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        disabled={isDisabled}
        title="Insert or modify table"
        aria-label="Table menu"
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
              : isInsideTable
              ? 'bg-[var(--rte-primary-hover,rgba(59,130,246,0.15))] text-[var(--rte-primary,#3b82f6)]'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }
        `}
      >
        <TableIcon className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1.5 p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl w-64 animate-in fade-in zoom-in-95 duration-100">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 pb-1.5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <span>{isInsideTable ? 'Table Actions' : 'Insert Table'}</span>
            {!isInsideTable && (
              <span className="text-[11px] text-[var(--rte-primary,#3b82f6)] font-mono">
                {hoverCols} × {hoverRows}
              </span>
            )}
          </div>

          {!isInsideTable ? (
            <div>
              {/* Interactive Grid Selector */}
              <div
                className="grid grid-cols-6 gap-1 p-1 bg-slate-50 dark:bg-slate-800/60 rounded-md mb-2 cursor-pointer"
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
                        className={`w-6 h-6 rounded-xs border transition-colors ${
                          isHighlighted
                            ? 'bg-[var(--rte-primary,#3b82f6)] border-[var(--rte-primary,#3b82f6)]'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                        }`}
                      />
                    );
                  })
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
                Click to insert {hoverCols} × {hoverRows} table
              </p>
            </div>
          ) : (
            <div className="space-y-1 text-xs">
              <div className="grid grid-cols-2 gap-1 mb-2">
                <button
                  type="button"
                  onClick={() => {
                    editor?.chain().focus().addRowBefore().run();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-500" />
                  <span>Add Row Above</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editor?.chain().focus().addRowAfter().run();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-500" />
                  <span>Add Row Below</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editor?.chain().focus().addColumnBefore().run();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-500" />
                  <span>Add Col Left</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editor?.chain().focus().addColumnAfter().run();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-500" />
                  <span>Add Col Right</span>
                </button>
              </div>

              <div className="pt-1 border-t border-slate-100 dark:border-slate-800 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    editor?.chain().focus().mergeOrSplit().run();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  <Merge className="w-3.5 h-3.5 text-amber-500" />
                  <span>Merge / Split Cell</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editor?.chain().focus().toggleHeaderRow().run();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  <TableIcon className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Toggle Header Row</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editor?.chain().focus().deleteRow().run();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Current Row</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editor?.chain().focus().deleteColumn().run();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Current Column</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editor?.chain().focus().deleteTable().run();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded bg-red-50 dark:bg-red-950/50 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Whole Table</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
