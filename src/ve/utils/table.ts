import type { Editor } from '@tiptap/core';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import type { EditorState } from '@tiptap/pm/state';
import { CellSelection } from '@tiptap/pm/tables';
import { isTableBorderStyle, safeCssColor, type TableBorderStyle } from '../extensions/table';

export type CellAlign = 'left' | 'center' | 'right';

interface TableContext {
  row: ProseMirrorNode;
  rowPos: number;
  cellIndex: number;
  rowIndex: number;
  table: ProseMirrorNode;
}

function tableContext(state: EditorState): TableContext | null {
  const $pos = state.selection.$from;
  let tableDepth = -1;
  let rowDepth = -1;
  let cellDepth = -1;

  for (let depth = $pos.depth; depth > 0; depth -= 1) {
    const name = $pos.node(depth).type.name;
    if (name === 'table') tableDepth = depth;
    else if (name === 'tableRow') rowDepth = depth;
    else if ((name === 'tableCell' || name === 'tableHeader') && cellDepth < 0) cellDepth = depth;
  }

  if (tableDepth < 0 || rowDepth < 0) return null;

  return {
    table: $pos.node(tableDepth),
    row: $pos.node(rowDepth),
    rowPos: $pos.before(rowDepth),
    cellIndex: cellDepth >= 0 ? $pos.index(cellDepth) : 0,
    rowIndex: $pos.index(rowDepth),
  };
}

export function isHeaderColumnActive(editor: Editor): boolean {
  const ctx = tableContext(editor.state);
  if (!ctx || ctx.table.childCount < 2) return false;
  const lastRow = ctx.table.child(ctx.table.childCount - 1);
  const index = Math.min(ctx.cellIndex, Math.max(0, lastRow.childCount - 1));
  return lastRow.child(index)?.type.name === 'tableHeader';
}

export function setTableBorder(editor: Editor, borderStyle: TableBorderStyle): boolean {
  if (!isTableBorderStyle(borderStyle)) return false;
  return editor
    .chain()
    .focus()
    .command(({ tr, state }) => {
      const $pos = state.selection.$from;
      for (let depth = $pos.depth; depth > 0; depth -= 1) {
        if ($pos.node(depth).type.name !== 'table') continue;
        tr.setNodeMarkup($pos.before(depth), undefined, {
          ...$pos.node(depth).attrs,
          borderStyle,
        });
        return true;
      }
      return false;
    })
    .run();
}

export function toggleTableStriped(editor: Editor): boolean {
  const striped = !editor.getAttributes('table').striped;
  return editor
    .chain()
    .focus()
    .command(({ tr, state }) => {
      const $pos = state.selection.$from;
      for (let depth = $pos.depth; depth > 0; depth -= 1) {
        if ($pos.node(depth).type.name !== 'table') continue;
        tr.setNodeMarkup($pos.before(depth), undefined, {
          ...$pos.node(depth).attrs,
          striped,
        });
        return true;
      }
      return false;
    })
    .run();
}

function cellsInSelection(state: EditorState): { node: ProseMirrorNode; pos: number }[] {
  const { selection } = state;
  if (selection instanceof CellSelection) {
    const cells: { node: ProseMirrorNode; pos: number }[] = [];
    selection.forEachCell((node, pos) => {
      cells.push({ node, pos });
    });
    return cells;
  }

  const $pos = selection.$from;
  for (let depth = $pos.depth; depth > 0; depth -= 1) {
    const name = $pos.node(depth).type.name;
    if (name === 'tableCell' || name === 'tableHeader') {
      return [{ node: $pos.node(depth), pos: $pos.before(depth) }];
    }
  }
  return [];
}

export function setCellAlign(editor: Editor, align: CellAlign): boolean {
  return editor
    .chain()
    .focus()
    .command(({ tr, state }) => {
      const cells = cellsInSelection(state);
      if (!cells.length) return false;

      const updates: { pos: number; attrs: Record<string, unknown> }[] = [];
      cells.forEach(({ node, pos }) => {
        updates.push({ pos, attrs: { ...node.attrs, align } });
        node.descendants((child, offset) => {
          if (child.type.name !== 'paragraph' && child.type.name !== 'heading') return;
          updates.push({
            pos: pos + 1 + offset,
            attrs: { ...child.attrs, textAlign: align },
          });
        });
      });

      updates
        .sort((a, b) => b.pos - a.pos)
        .forEach((update) => {
          const current = tr.doc.nodeAt(update.pos);
          if (!current) return;
          tr.setNodeMarkup(update.pos, undefined, { ...current.attrs, ...update.attrs });
        });
      return true;
    })
    .run();
}

export function setCurrentCellColor(
  editor: Editor,
  kind: 'backgroundColor' | 'textColor',
  color: string | null,
): boolean {
  const safe = color === null ? null : safeCssColor(color);
  if (color !== null && !safe) return false;
  return editor.chain().focus().setCellAttribute(kind, safe).run();
}

export function setHeaderRowColor(
  editor: Editor,
  kind: 'backgroundColor' | 'textColor',
  color: string | null,
): boolean {
  const safe = color === null ? null : safeCssColor(color);
  if (color !== null && !safe) return false;

  return editor
    .chain()
    .focus()
    .command(({ tr, state }) => {
      const ctx = tableContext(state);
      if (!ctx) return false;

      const targets: { pos: number; node: ProseMirrorNode }[] = [];
      ctx.row.forEach((cell, offset) => {
        if (cell.type.name !== 'tableHeader') return;
        targets.push({ pos: ctx.rowPos + 1 + offset, node: cell });
      });
      if (!targets.length) return false;

      for (let index = targets.length - 1; index >= 0; index -= 1) {
        const target = targets[index];
        tr.setNodeMarkup(target.pos, undefined, {
          ...target.node.attrs,
          [kind]: safe,
        });
      }
      return true;
    })
    .run();
}
