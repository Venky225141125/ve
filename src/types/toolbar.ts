import type { Editor } from '@tiptap/core';
import type { ReactNode } from 'react';

export type StandardToolbarItem =
  | 'history'
  | 'undo'
  | 'redo'
  | 'heading'
  | 'fontFamily'
  | 'fontSize'
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'code'
  | 'superscript'
  | 'subscript'
  | 'clearFormatting'
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
  | 'fullscreen'
  | 'sourceCode'
  | '|';

export type ToolbarItem = StandardToolbarItem | CustomToolbarItem;

export interface CustomToolbarItem {
  id: string;
  label: string;
  icon?: ReactNode;
  tooltip?: string;
  shortcut?: string;
  isActive?: (editor: Editor) => boolean;
  isDisabled?: (editor: Editor) => boolean;
  onClick: (editor: Editor) => void;
}

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
