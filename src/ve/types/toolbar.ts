import type { ReactNode } from 'react';
import type { Editor } from '@tiptap/core';

export type StandardToolbarItem =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'code'
  | 'superscript'
  | 'subscript'
  | 'clearFormatting'
  | 'heading'
  | 'paragraph'
  | 'fontFamily'
  | 'fontSize'
  | 'textColor'
  | 'highlight'
  | 'align'
  | 'alignLeft'
  | 'alignCenter'
  | 'alignRight'
  | 'alignJustify'
  | 'bulletList'
  | 'orderedList'
  | 'taskList'
  | 'blockquote'
  | 'codeBlock'
  | 'horizontalRule'
  | 'link'
  | 'image'
  | 'table'
  | 'youtube'
  | 'emoji'
  | 'undo'
  | 'redo'
  | 'fullscreen'
  | 'sourceCode'
  | '|';

export interface CustomToolbarItem {
  id: string;
  name: string;
  icon?: ReactNode;
  title?: string;
  onClick: (editor: Editor) => void;
  isActive?: (editor: Editor) => boolean;
  isDisabled?: (editor: Editor) => boolean;
}

export type ToolbarItem = StandardToolbarItem | CustomToolbarItem;

export type ToolbarGroup = ToolbarItem[];

export type ToolbarConfig = ToolbarItem[] | ToolbarGroup[] | false;

export interface CustomToolbarProps {
  editor: Editor | null;
  disabled?: boolean;
  isFullscreen?: boolean;
  isSourceCodeView?: boolean;
  toggleFullscreen?: () => void;
  toggleSourceCode?: () => void;
}

export interface ToolbarButtonProps {
  id?: string;
  label: string;
  tooltip?: string;
  shortcut?: string;
  icon: ReactNode;
  isActive?: boolean;
  isDisabled?: boolean;
  onClick: () => void;
  className?: string;
  ariaLabel?: string;
}
