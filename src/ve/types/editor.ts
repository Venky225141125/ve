import type { ReactNode, CSSProperties } from 'react';
import type { Editor, JSONContent } from '@tiptap/core';
import type { RichTextEditorFeatures } from './features';
import type { ToolbarConfig, CustomToolbarProps } from './toolbar';
import type { RichTextEditorTheme } from './theme';

export interface RichTextValue {
  html: string;
  json: JSONContent;
  text: string;
}

export type ImageUploadHandler = (file: File) => Promise<string>;

export interface RichTextEditorRef {
  editor: Editor | null;
  getHTML: () => string;
  getJSON: () => JSONContent;
  getText: () => string;
  getValue: () => RichTextValue;
  setContent: (content: string | JSONContent, emitUpdate?: boolean) => void;
  clearContent: (emitUpdate?: boolean) => void;
  focus: (position?: 'start' | 'end' | 'all' | number | boolean) => void;
  blur: () => void;
  undo: () => boolean;
  redo: () => boolean;
}

export interface RichTextEditorProps {
  value?: string;
  defaultValue?: string;
  onChange?: (html: string) => void;
  onChangeValue?: (value: RichTextValue) => void;
  onBlur?: (e?: any) => void;
  onFocus?: (e?: any) => void;
  editable?: boolean;
  placeholder?: string;
  features?: RichTextEditorFeatures;
  toolbar?: ToolbarConfig | false;
  renderToolbar?: (props: CustomToolbarProps) => ReactNode;
  /**
   * Named theme tokens. Safe to change at runtime (role theme, dark mode, etc).
   * Maps onto `--rte-*` CSS variables on the editor root.
   */
  theme?: RichTextEditorTheme;
  /**
   * Arbitrary CSS for this instance (height, CSS variables, etc).
   * Merged after `theme`, so it wins on conflicts.
   */
  style?: CSSProperties;
  /**
   * Extra CSS variables without putting them inside `theme`.
   * Example: `{ '--rte-primary': '#7c3aed' }`.
   */
  cssVariables?: Record<string, string>;
  /** Force the editor chrome into dark tokens even if `html` is light. */
  dark?: boolean;
  onImageUpload?: ImageUploadHandler;
  maxCharacters?: number;
  showStats?: boolean;
  stickyToolbar?: boolean;
  bubbleMenu?: boolean;
  autoFocus?: boolean | 'start' | 'end' | 'all' | number;
  dir?: 'ltr' | 'rtl' | 'auto';
  className?: string;
  toolbarClassName?: string;
  contentClassName?: string;
  customExtensions?: any[];
  ariaLabel?: string;
  id?: string;
}
