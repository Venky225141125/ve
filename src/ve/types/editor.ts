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
  theme?: RichTextEditorTheme;
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
