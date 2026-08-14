import type { Editor, JSONContent } from '@tiptap/core';
import type { ReactNode } from 'react';
import type { RichTextEditorFeatures } from './features';
import type { ToolbarConfig, CustomToolbarProps } from './toolbar';
import type { RichTextEditorTheme } from './theme';

export interface RichTextValue {
  /** Serialized clean HTML output */
  html: string;
  /** ProseMirror JSON structure */
  json: JSONContent;
  /** Plain text representation with clean line breaks */
  text: string;
}

export type ImageUploadHandler = (file: File) => Promise<string>;

export interface RichTextEditorRef {
  editor: Editor | null;
  getHTML: () => string;
  getJSON: () => JSONContent;
  getText: () => string;
  getValue: () => RichTextValue;
  setContent: (content: string | JSONContent) => void;
  clearContent: () => void;
  focus: () => void;
  blur: () => void;
  undo: () => void;
  redo: () => void;
}

export interface RichTextEditorProps {
  /**
   * Controlled HTML or text content.
   * When provided, updates to this prop synchronize into the editor.
   */
  value?: string;

  /**
   * Initial uncontrolled HTML or text content.
   */
  defaultValue?: string;

  /**
   * Called whenever the content changes with the updated HTML string.
   */
  onChange?: (html: string) => void;

  /**
   * Extended change handler providing HTML, JSON, and plain text simultaneously.
   */
  onChangeValue?: (value: RichTextValue) => void;

  /**
   * Whether the editor is interactive or read-only.
   * @default true
   */
  editable?: boolean;

  /**
   * Placeholder text shown when the editor is empty.
   * @default "Start writing..."
   */
  placeholder?: string;

  /**
   * Granular feature configuration to enable/disable extensions.
   */
  features?: RichTextEditorFeatures;

  /**
   * Toolbar items to render, or `false` to hide the toolbar.
   */
  toolbar?: ToolbarConfig;

  /**
   * Custom toolbar render function for fully bespoke toolbars.
   */
  renderToolbar?: (props: CustomToolbarProps) => ReactNode;

  /**
   * Theme configuration overriding default CSS variables.
   */
  theme?: RichTextEditorTheme;

  /**
   * Asynchronous handler for uploading images (e.g. to S3, Cloudinary, API).
   * Receives the `File` and should return the uploaded public image URL.
   */
  onImageUpload?: ImageUploadHandler;

  /**
   * Maximum character count allowed.
   */
  maxCharacters?: number;

  /**
   * Whether to display character/word count and stats at the bottom.
   * @default true
   */
  showStats?: boolean;

  /**
   * Whether the toolbar stays sticky when scrolling long documents.
   * @default true
   */
  stickyToolbar?: boolean;

  /**
   * Whether to display a floating bubble menu on text selection.
   * @default true
   */
  bubbleMenu?: boolean;

  /**
   * Auto focus the editor on mount.
   * @default false
   */
  autoFocus?: boolean | 'start' | 'end' | 'all';

  /**
   * Text direction ('ltr' | 'rtl' | 'auto').
   * @default "ltr"
   */
  dir?: 'ltr' | 'rtl' | 'auto';

  /**
   * Root container CSS class name.
   */
  className?: string;

  /**
   * Toolbar wrapper CSS class name.
   */
  toolbarClassName?: string;

  /**
   * Editable content prose area CSS class name.
   */
  contentClassName?: string;

  /**
   * Additional custom Tiptap extensions.
   */
  customExtensions?: any[];

  /**
   * Accessibility label for the editor content region.
   * @default "Rich text editor content area"
   */
  ariaLabel?: string;

  /**
   * Unique ID for container and accessibility bindings.
   */
  id?: string;

  /**
   * Callback fired on editor focus.
   */
  onFocus?: () => void;

  /**
   * Callback fired on editor blur.
   */
  onBlur?: () => void;
}
