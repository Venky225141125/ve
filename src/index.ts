// Main Component
export { RichTextEditor } from './components/RichTextEditor';

// Subcomponents & UI
export { EditorToolbar } from './components/EditorToolbar';
export { ToolbarButton } from './components/ToolbarButton';
export { ToolbarDropdown } from './components/ToolbarDropdown';
export { ColorPickerPopover } from './components/ColorPickerPopover';
export { EmojiPickerPopover } from './components/EmojiPickerPopover';
export { LinkModal } from './components/LinkModal';
export { ImageModal } from './components/ImageModal';
export { YoutubeModal } from './components/YoutubeModal';
export { TableBuilderModal } from './components/TableBuilderModal';
export { EditorBubbleMenu } from './components/BubbleMenu';
export { EditorStats } from './components/EditorStats';
export { HTMLCodeEditor } from './components/HTMLCodeEditor';

// Hooks
export { useRichTextEditor } from './hooks/useRichTextEditor';
export { useEditorCommands } from './hooks/useEditorCommands';

// Extensions
export { createEditorExtensions, FontSize, CustomImage } from './extensions';

// Utils & Helpers
export {
  sanitizeHTML,
  extractRichTextValue,
  countWords,
  calculateReadingTime,
  buildThemeStyles,
  DEFAULT_TOOLBAR_ITEMS,
  DEFAULT_FONT_FAMILIES,
  DEFAULT_FONT_SIZES,
  TEXT_COLORS,
  HIGHLIGHT_COLORS,
} from './utils';

// Types
export type {
  RichTextEditorProps,
  RichTextEditorRef,
  RichTextValue,
  ImageUploadHandler,
  RichTextEditorFeatures,
  ToolbarItem,
  CustomToolbarItem,
  ToolbarConfig,
  CustomToolbarProps,
  RichTextEditorTheme,
} from './types';
