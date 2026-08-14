/**
 * Modular feature toggles for VE RichTextEditor.
 * Disabled features are omitted from the Tiptap extension bundle to minimize bundle size.
 */
export interface RichTextEditorFeatures {
  // Inline formatting
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  code?: boolean;
  superscript?: boolean;
  subscript?: boolean;
  clearFormatting?: boolean;

  // Typography & Styling
  headings?: boolean | { levels?: (1 | 2 | 3 | 4 | 5 | 6)[] };
  paragraph?: boolean;
  fontFamily?: boolean | { fonts?: Array<{ label: string; value: string }> };
  fontSize?: boolean | { sizes?: Array<{ label: string; value: string }> };
  textColor?: boolean | { colors?: string[] };
  highlight?: boolean | { colors?: string[] };
  textAlign?: boolean;

  // Paragraph & Blocks
  blockquote?: boolean;
  codeBlock?: boolean;
  horizontalRule?: boolean;

  // Lists
  bulletList?: boolean;
  orderedList?: boolean;
  taskList?: boolean;

  // Inserts & Media
  links?: boolean | { openOnClick?: boolean; HTMLAttributes?: Record<string, string> };
  images?: boolean | { allowBase64?: boolean; HTMLAttributes?: Record<string, string> };
  tables?: boolean | { resizable?: boolean };
  youtube?: boolean | { addPasteHandler?: boolean };
  emoji?: boolean;
  mentions?: boolean;

  // Utilities
  history?: boolean; // Undo / Redo
  placeholder?: boolean | string;
  characterCount?: boolean | { limit?: number };
  bubbleMenu?: boolean;
  floatingMenu?: boolean;
}

export const DEFAULT_FEATURES: Required<RichTextEditorFeatures> = {
  bold: true,
  italic: true,
  underline: true,
  strike: true,
  code: true,
  superscript: true,
  subscript: true,
  clearFormatting: true,
  headings: true,
  paragraph: true,
  fontFamily: true,
  fontSize: true,
  textColor: true,
  highlight: true,
  textAlign: true,
  blockquote: true,
  codeBlock: true,
  horizontalRule: true,
  bulletList: true,
  orderedList: true,
  taskList: true,
  links: true,
  images: true,
  tables: true,
  youtube: true,
  emoji: true,
  mentions: false,
  history: true,
  placeholder: true,
  characterCount: true,
  bubbleMenu: true,
  floatingMenu: false,
};
