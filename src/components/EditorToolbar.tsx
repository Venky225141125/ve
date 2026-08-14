import React, { useState } from 'react';
import type { Editor } from '@tiptap/core';
import {
  Undo,
  Redo,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  RemoveFormatting,
  Baseline,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  Code2,
  Minus,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Youtube as YoutubeIcon,
  Smile,
  Maximize2,
  Minimize2,
  CodeXml,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Pilcrow,
} from 'lucide-react';

import { ToolbarButton } from './ToolbarButton';
import { ToolbarDropdown } from './ToolbarDropdown';
import { ColorPickerPopover } from './ColorPickerPopover';
import { TableBuilderModal } from './TableBuilderModal';
import { EmojiPickerPopover } from './EmojiPickerPopover';
import { LinkModal } from './LinkModal';
import { ImageModal } from './ImageModal';
import { YoutubeModal } from './YoutubeModal';
import {
  DEFAULT_FONT_FAMILIES,
  DEFAULT_FONT_SIZES,
  TEXT_COLORS,
  HIGHLIGHT_COLORS,
  DEFAULT_TOOLBAR_ITEMS,
} from '../utils/constants';
import type { ToolbarConfig, ToolbarItem, CustomToolbarItem } from '../types/toolbar';
import type { RichTextEditorFeatures } from '../types/features';
import type { ImageUploadHandler } from '../types/editor';

export interface EditorToolbarProps {
  editor: Editor | null;
  toolbar?: ToolbarConfig;
  features?: RichTextEditorFeatures;
  onImageUpload?: ImageUploadHandler;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  isSourceCodeView?: boolean;
  onToggleSourceCode?: () => void;
  className?: string;
  disabled?: boolean;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  toolbar = DEFAULT_TOOLBAR_ITEMS,
  features = {},
  onImageUpload,
  isFullscreen = false,
  onToggleFullscreen,
  isSourceCodeView = false,
  onToggleSourceCode,
  className = '',
  disabled = false,
}) => {
  // Modal states
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isYoutubeModalOpen, setIsYoutubeModalOpen] = useState(false);

  if (toolbar === false || !editor) return null;

  // Flatten or use items array
  const toolbarItems = (Array.isArray(toolbar)
    ? toolbar.flat()
    : DEFAULT_TOOLBAR_ITEMS) as ToolbarItem[];

  // Current states
  const isMac = typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const modKey = isMac ? '⌘' : 'Ctrl+';

  // Heading options
  const headingOptions = [
    { label: 'Paragraph', value: 'p', icon: <Pilcrow className="w-3.5 h-3.5" /> },
    { label: 'Heading 1', value: 'h1', icon: <Heading1 className="w-3.5 h-3.5" /> },
    { label: 'Heading 2', value: 'h2', icon: <Heading2 className="w-3.5 h-3.5" /> },
    { label: 'Heading 3', value: 'h3', icon: <Heading3 className="w-3.5 h-3.5" /> },
    { label: 'Heading 4', value: 'h4', icon: <Heading4 className="w-3.5 h-3.5" /> },
    { label: 'Heading 5', value: 'h5', icon: <Heading5 className="w-3.5 h-3.5" /> },
    { label: 'Heading 6', value: 'h6', icon: <Heading6 className="w-3.5 h-3.5" /> },
  ];

  let currentHeadingValue = 'p';
  if (editor.isActive('heading', { level: 1 })) currentHeadingValue = 'h1';
  else if (editor.isActive('heading', { level: 2 })) currentHeadingValue = 'h2';
  else if (editor.isActive('heading', { level: 3 })) currentHeadingValue = 'h3';
  else if (editor.isActive('heading', { level: 4 })) currentHeadingValue = 'h4';
  else if (editor.isActive('heading', { level: 5 })) currentHeadingValue = 'h5';
  else if (editor.isActive('heading', { level: 6 })) currentHeadingValue = 'h6';

  // Alignment Options
  const alignOptions = [
    { label: 'Left', value: 'left', icon: <AlignLeft className="w-3.5 h-3.5" /> },
    { label: 'Center', value: 'center', icon: <AlignCenter className="w-3.5 h-3.5" /> },
    { label: 'Right', value: 'right', icon: <AlignRight className="w-3.5 h-3.5" /> },
    { label: 'Justify', value: 'justify', icon: <AlignJustify className="w-3.5 h-3.5" /> },
  ];

  let currentAlignValue = 'left';
  if (editor.isActive({ textAlign: 'center' })) currentAlignValue = 'center';
  else if (editor.isActive({ textAlign: 'right' })) currentAlignValue = 'right';
  else if (editor.isActive({ textAlign: 'justify' })) currentAlignValue = 'justify';

  // Current Font
  const currentFontFamily = editor.getAttributes('textStyle').fontFamily || 'inherit';
  const currentFontSize = editor.getAttributes('textStyle').fontSize || '16px';
  const currentTextColor = editor.getAttributes('textStyle').color || '#000000';
  const currentHighlightColor = editor.getAttributes('highlight').color || 'transparent';

  // Font options config
  const fontFamilies =
    typeof features.fontFamily === 'object' && features.fontFamily.fonts
      ? features.fontFamily.fonts
      : DEFAULT_FONT_FAMILIES;

  const fontSizes =
    typeof features.fontSize === 'object' && features.fontSize.sizes
      ? features.fontSize.sizes
      : DEFAULT_FONT_SIZES;

  const textColors =
    typeof features.textColor === 'object' && features.textColor.colors
      ? features.textColor.colors
      : TEXT_COLORS;

  const highlightColors =
    typeof features.highlight === 'object' && features.highlight.colors
      ? features.highlight.colors
      : HIGHLIGHT_COLORS;

  const renderItem = (item: ToolbarItem, index: number) => {
    if (typeof item === 'object') {
      const custom = item as CustomToolbarItem;
      return (
        <ToolbarButton
          key={custom.id || `custom-${index}`}
          id={custom.id}
          label={custom.label}
          tooltip={custom.tooltip || custom.label}
          shortcut={custom.shortcut}
          icon={custom.icon || <span>{custom.label}</span>}
          isActive={custom.isActive ? custom.isActive(editor) : false}
          isDisabled={disabled || (custom.isDisabled ? custom.isDisabled(editor) : false)}
          onClick={() => custom.onClick(editor)}
        />
      );
    }

    switch (item) {
      case '|':
        return (
          <span
            key={`sep-${index}`}
            className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-1 self-center shrink-0"
          />
        );

      case 'undo':
        return (
          <ToolbarButton
            key="undo"
            label="Undo"
            shortcut={`${modKey}Z`}
            icon={<Undo className="w-4 h-4" />}
            isDisabled={disabled || !editor.can().undo()}
            onClick={() => editor.chain().focus().undo().run()}
          />
        );

      case 'redo':
        return (
          <ToolbarButton
            key="redo"
            label="Redo"
            shortcut={`${modKey}Shift+Z`}
            icon={<Redo className="w-4 h-4" />}
            isDisabled={disabled || !editor.can().redo()}
            onClick={() => editor.chain().focus().redo().run()}
          />
        );

      case 'heading':
        return (
          <ToolbarDropdown
            key="heading"
            label="Heading Style"
            tooltip="Heading formatting"
            value={currentHeadingValue}
            options={headingOptions}
            minWidth="120px"
            isDisabled={disabled}
            onChange={(val) => {
              if (val === 'p') {
                editor.chain().focus().setParagraph().run();
              } else {
                const level = parseInt(val.replace('h', ''), 10) as 1 | 2 | 3 | 4 | 5 | 6;
                editor.chain().focus().toggleHeading({ level }).run();
              }
            }}
          />
        );

      case 'fontFamily':
        return (
          <ToolbarDropdown
            key="fontFamily"
            label="Font Family"
            tooltip="Change font family"
            value={currentFontFamily}
            options={fontFamilies}
            minWidth="140px"
            isDisabled={disabled}
            onChange={(val) => {
              if (val === 'inherit') {
                editor.chain().focus().unsetFontFamily().run();
              } else {
                editor.chain().focus().setFontFamily(val).run();
              }
            }}
          />
        );

      case 'fontSize':
        return (
          <ToolbarDropdown
            key="fontSize"
            label="Font Size"
            tooltip="Change text size"
            value={currentFontSize}
            options={fontSizes}
            minWidth="90px"
            isDisabled={disabled}
            onChange={(val) => {
              editor.chain().focus().setFontSize(val).run();
            }}
          />
        );

      case 'bold':
        return (
          <ToolbarButton
            key="bold"
            label="Bold"
            shortcut={`${modKey}B`}
            icon={<Bold className="w-4 h-4" />}
            isActive={editor.isActive('bold')}
            isDisabled={disabled}
            onClick={() => editor.chain().focus().toggleBold().run()}
          />
        );

      case 'italic':
        return (
          <ToolbarButton
            key="italic"
            label="Italic"
            shortcut={`${modKey}I`}
            icon={<Italic className="w-4 h-4" />}
            isActive={editor.isActive('italic')}
            isDisabled={disabled}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          />
        );

      case 'underline':
        return (
          <ToolbarButton
            key="underline"
            label="Underline"
            shortcut={`${modKey}U`}
            icon={<UnderlineIcon className="w-4 h-4" />}
            isActive={editor.isActive('underline')}
            isDisabled={disabled}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          />
        );

      case 'strike':
        return (
          <ToolbarButton
            key="strike"
            label="Strikethrough"
            shortcut={`${modKey}Shift+X`}
            icon={<Strikethrough className="w-4 h-4" />}
            isActive={editor.isActive('strike')}
            isDisabled={disabled}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          />
        );

      case 'code':
        return (
          <ToolbarButton
            key="code"
            label="Inline Code"
            shortcut={`${modKey}E`}
            icon={<Code className="w-4 h-4" />}
            isActive={editor.isActive('code')}
            isDisabled={disabled}
            onClick={() => editor.chain().focus().toggleCode().run()}
          />
        );

      case 'superscript':
        return (
          <ToolbarButton
            key="superscript"
            label="Superscript"
            shortcut={`${modKey}.`}
            icon={<SuperscriptIcon className="w-4 h-4" />}
            isActive={editor.isActive('superscript')}
            isDisabled={disabled}
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
          />
        );

      case 'subscript':
        return (
          <ToolbarButton
            key="subscript"
            label="Subscript"
            shortcut={`${modKey},`}
            icon={<SubscriptIcon className="w-4 h-4" />}
            isActive={editor.isActive('subscript')}
            isDisabled={disabled}
            onClick={() => editor.chain().focus().toggleSubscript().run()}
          />
        );

      case 'clearFormatting':
        return (
          <ToolbarButton
            key="clearFormatting"
            label="Clear Formatting"
            tooltip="Remove styles and formatting"
            icon={<RemoveFormatting className="w-4 h-4" />}
            isDisabled={disabled}
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          />
        );

      case 'textColor':
        return (
          <ColorPickerPopover
            key="textColor"
            label="Text Color"
            tooltip="Change text color"
            icon={<Baseline className="w-4 h-4" />}
            activeColor={currentTextColor}
            colors={textColors}
            isDisabled={disabled}
            onChange={(c) => editor.chain().focus().setColor(c).run()}
            onClear={() => editor.chain().focus().unsetColor().run()}
          />
        );

      case 'highlight':
        return (
          <ColorPickerPopover
            key="highlight"
            label="Highlight Color"
            tooltip="Text highlight background"
            icon={<Highlighter className="w-4 h-4" />}
            activeColor={currentHighlightColor}
            colors={highlightColors}
            isDisabled={disabled}
            onChange={(c) => editor.chain().focus().setHighlight({ color: c }).run()}
            onClear={() => editor.chain().focus().unsetHighlight().run()}
          />
        );

      case 'align':
        return (
          <ToolbarDropdown
            key="align"
            label="Alignment"
            tooltip="Text alignment"
            value={currentAlignValue}
            options={alignOptions}
            minWidth="95px"
            isDisabled={disabled}
            onChange={(val) => {
              editor.chain().focus().setTextAlign(val).run();
            }}
          />
        );

      case 'alignLeft':
        return (
          <ToolbarButton
            key="alignLeft"
            label="Align Left"
            icon={<AlignLeft className="w-4 h-4" />}
            isActive={editor.isActive({ textAlign: 'left' })}
            isDisabled={disabled}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
          />
        );

      case 'alignCenter':
        return (
          <ToolbarButton
            key="alignCenter"
            label="Align Center"
            icon={<AlignCenter className="w-4 h-4" />}
            isActive={editor.isActive({ textAlign: 'center' })}
            isDisabled={disabled}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
          />
        );

      case 'alignRight':
        return (
          <ToolbarButton
            key="alignRight"
            label="Align Right"
            icon={<AlignRight className="w-4 h-4" />}
            isActive={editor.isActive({ textAlign: 'right' })}
            isDisabled={disabled}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
          />
        );

      case 'alignJustify':
        return (
          <ToolbarButton
            key="alignJustify"
            label="Justify"
            icon={<AlignJustify className="w-4 h-4" />}
            isActive={editor.isActive({ textAlign: 'justify' })}
            isDisabled={disabled}
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          />
        );

      case 'bulletList':
        return (
          <ToolbarButton
            key="bulletList"
            label="Bullet List"
            shortcut={`${modKey}Shift+8`}
            icon={<List className="w-4 h-4" />}
            isActive={editor.isActive('bulletList')}
            isDisabled={disabled}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          />
        );

      case 'orderedList':
        return (
          <ToolbarButton
            key="orderedList"
            label="Numbered List"
            shortcut={`${modKey}Shift+7`}
            icon={<ListOrdered className="w-4 h-4" />}
            isActive={editor.isActive('orderedList')}
            isDisabled={disabled}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          />
        );

      case 'taskList':
        return (
          <ToolbarButton
            key="taskList"
            label="Task List"
            shortcut={`${modKey}Shift+9`}
            icon={<ListTodo className="w-4 h-4" />}
            isActive={editor.isActive('taskList')}
            isDisabled={disabled}
            onClick={() => editor.chain().focus().toggleTaskList().run()}
          />
        );

      case 'blockquote':
        return (
          <ToolbarButton
            key="blockquote"
            label="Blockquote"
            shortcut={`${modKey}Shift+B`}
            icon={<Quote className="w-4 h-4" />}
            isActive={editor.isActive('blockquote')}
            isDisabled={disabled}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          />
        );

      case 'codeBlock':
        return (
          <ToolbarButton
            key="codeBlock"
            label="Code Block"
            shortcut={`${modKey}Alt+C`}
            icon={<Code2 className="w-4 h-4" />}
            isActive={editor.isActive('codeBlock')}
            isDisabled={disabled}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          />
        );

      case 'horizontalRule':
        return (
          <ToolbarButton
            key="horizontalRule"
            label="Divider"
            tooltip="Insert horizontal divider"
            icon={<Minus className="w-4 h-4" />}
            isDisabled={disabled}
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          />
        );

      case 'link':
        return (
          <ToolbarButton
            key="link"
            label="Link"
            shortcut={`${modKey}K`}
            icon={<LinkIcon className="w-4 h-4" />}
            isActive={editor.isActive('link')}
            isDisabled={disabled}
            onClick={() => setIsLinkModalOpen(true)}
          />
        );

      case 'image':
        return (
          <ToolbarButton
            key="image"
            label="Image"
            tooltip="Insert or upload image"
            icon={<ImageIcon className="w-4 h-4" />}
            isDisabled={disabled}
            onClick={() => setIsImageModalOpen(true)}
          />
        );

      case 'table':
        return <TableBuilderModal key="table" editor={editor} isDisabled={disabled} />;

      case 'youtube':
        return (
          <ToolbarButton
            key="youtube"
            label="YouTube Video"
            tooltip="Embed YouTube video"
            icon={<YoutubeIcon className="w-4 h-4" />}
            isDisabled={disabled}
            onClick={() => setIsYoutubeModalOpen(true)}
          />
        );

      case 'emoji':
        return <EmojiPickerPopover key="emoji" editor={editor} isDisabled={disabled} />;

      case 'fullscreen':
        return onToggleFullscreen ? (
          <ToolbarButton
            key="fullscreen"
            label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            tooltip={isFullscreen ? 'Exit fullscreen mode' : 'Expand to fullscreen'}
            icon={isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            isActive={isFullscreen}
            isDisabled={disabled}
            onClick={onToggleFullscreen}
          />
        ) : null;

      case 'sourceCode':
        return onToggleSourceCode ? (
          <ToolbarButton
            key="sourceCode"
            label="HTML Source"
            tooltip="Toggle HTML source editor"
            icon={<CodeXml className="w-4 h-4" />}
            isActive={isSourceCodeView}
            isDisabled={disabled}
            onClick={onToggleSourceCode}
          />
        ) : null;

      default:
        return null;
    }
  };

  const currentLinkHref = editor.getAttributes('link').href || '';
  const currentLinkTarget = editor.getAttributes('link').target || '_blank';

  return (
    <>
      <div
        role="toolbar"
        aria-label="Rich text editor toolbar"
        className={`
          flex flex-wrap items-center gap-1 p-2 border-b
          border-slate-200 dark:border-slate-800 bg-[var(--rte-toolbar-background,theme(colors.slate.50/80%))] dark:bg-slate-900/90
          backdrop-blur-xs transition-colors duration-150
          ${className}
        `}
      >
        {toolbarItems.map((item, idx) => renderItem(item, idx))}
      </div>

      {/* Link Dialog */}
      <LinkModal
        isOpen={isLinkModalOpen}
        initialHref={currentLinkHref}
        initialTarget={currentLinkTarget}
        onClose={() => setIsLinkModalOpen(false)}
        onSubmit={({ href, target, text }) => {
          if (!href) {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
          } else if (text && editor.state.selection.empty) {
            editor.chain().focus().insertContent(`<a href="${href}" target="${target}">${text}</a>`).run();
          } else {
            editor.chain().focus().extendMarkRange('link').setLink({ href, target }).run();
          }
        }}
        onRemove={() => {
          editor.chain().focus().extendMarkRange('link').unsetLink().run();
        }}
      />

      {/* Image Dialog */}
      <ImageModal
        isOpen={isImageModalOpen}
        onImageUpload={onImageUpload}
        onClose={() => setIsImageModalOpen(false)}
        onSubmit={(imgAttrs) => {
          (editor.commands as any).setImage(imgAttrs);
        }}
      />

      {/* YouTube Dialog */}
      <YoutubeModal
        isOpen={isYoutubeModalOpen}
        onClose={() => setIsYoutubeModalOpen(false)}
        onSubmit={({ src, width, height }) => {
          editor.commands.setYoutubeVideo({ src, width, height });
        }}
      />
    </>
  );
};
