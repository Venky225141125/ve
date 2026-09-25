import { mergeAttributes } from '@tiptap/core';
import { Table, TableView } from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';

export const TABLE_BORDER_STYLES = ['full', 'outer', 'double', 'dashed', 'none'] as const;
export type TableBorderStyle = (typeof TABLE_BORDER_STYLES)[number];

const BORDER_CLASS = /rte-table-border-(full|outer|double|dashed|none)/;

export function isTableBorderStyle(value: unknown): value is TableBorderStyle {
  return typeof value === 'string' && (TABLE_BORDER_STYLES as readonly string[]).includes(value);
}

/** Keep pasted or stored colors to plain CSS color values. */
export function safeCssColor(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const color = value.trim();
  if (!color || color.length > 40) return null;
  if (/^#[0-9a-f]{3,8}$/i.test(color)) return color;
  if (/^(?:rgb|hsl)a?\(\s*[\d.%\s,/+()-]+\)$/i.test(color)) return color;
  if (/^[a-z]+$/i.test(color)) return color;
  return null;
}

function readStyleValue(element: HTMLElement, property: string): string | null {
  const raw = element.getAttribute('style');
  if (!raw) return null;
  const match = raw.match(new RegExp(`(?:^|;)\\s*${property}\\s*:\\s*([^;]+)`, 'i'));
  return match?.[1]?.trim() ?? null;
}

function colorAttribute(name: 'backgroundColor' | 'textColor', cssProperty: string, dataName: string) {
  return {
    default: null as string | null,
    parseHTML: (element: HTMLElement) =>
      safeCssColor(element.getAttribute(dataName)) || safeCssColor(readStyleValue(element, cssProperty)),
    renderHTML: (attributes: Record<string, unknown>) => {
      const value = safeCssColor(attributes[name]);
      if (!value) return {};
      return {
        [dataName]: value,
        style: `${cssProperty}: ${value}`,
      };
    },
  };
}

function cellColorAttributes() {
  return {
    backgroundColor: colorAttribute('backgroundColor', 'background-color', 'data-background-color'),
    textColor: colorAttribute('textColor', 'color', 'data-text-color'),
  };
}

function borderStyleOf(node: ProseMirrorNode): TableBorderStyle {
  return isTableBorderStyle(node.attrs.borderStyle) ? node.attrs.borderStyle : 'full';
}

function syncTableChrome(table: HTMLTableElement, node: ProseMirrorNode) {
  const border = borderStyleOf(node);
  for (const className of [...table.classList]) {
    if (className.startsWith('rte-table-border-')) table.classList.remove(className);
  }
  table.classList.add('rte-table', `rte-table-border-${border}`);
  table.setAttribute('data-border', border);

  if (node.attrs.striped) {
    table.classList.add('rte-table-striped');
    table.setAttribute('data-striped', 'true');
  } else {
    table.classList.remove('rte-table-striped');
    table.removeAttribute('data-striped');
  }
}

/**
 * Resizable tables render through a node view that does not copy later attribute
 * changes onto the DOM. This view keeps border and stripe classes in sync.
 */
export class StyledTableView extends TableView {
  constructor(
    node: ProseMirrorNode,
    cellMinWidth: number,
    view?: ConstructorParameters<typeof TableView>[2],
    HTMLAttributes: Record<string, unknown> = {},
  ) {
    super(node, cellMinWidth, view, HTMLAttributes);
    syncTableChrome(this.table, node);
  }

  update(node: ProseMirrorNode) {
    const updated = super.update(node);
    if (updated) syncTableChrome(this.table, node);
    return updated;
  }
}

export const StyledTable = Table.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      borderStyle: {
        default: 'full' as TableBorderStyle,
        parseHTML: (element: HTMLElement) => {
          const data = element.getAttribute('data-border');
          if (isTableBorderStyle(data)) return data;
          const match = element.getAttribute('class')?.match(BORDER_CLASS);
          return match && isTableBorderStyle(match[1]) ? match[1] : null;
        },
        renderHTML: (attributes: { borderStyle?: unknown }) => {
          const border = isTableBorderStyle(attributes.borderStyle) ? attributes.borderStyle : 'full';
          return {
            'data-border': border,
            class: `rte-table-border-${border}`,
          };
        },
      },
      striped: {
        default: false,
        parseHTML: (element: HTMLElement) =>
          element.getAttribute('data-striped') === 'true' || element.classList.contains('rte-table-striped'),
        renderHTML: (attributes: { striped?: boolean }) => {
          if (!attributes.striped) return {};
          return {
            'data-striped': 'true',
            class: 'rte-table-striped',
          };
        },
      },
    };
  },
});

export const StyledTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      ...cellColorAttributes(),
    };
  },
  renderHTML({ HTMLAttributes }) {
    return ['td', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
});

export const StyledTableHeader = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      ...cellColorAttributes(),
    };
  },
  renderHTML({ HTMLAttributes }) {
    return ['th', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
});
