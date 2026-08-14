import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
  useCallback,
} from 'react';
import { EditorContent } from '@tiptap/react';
import { useRichTextEditor } from '../hooks/useRichTextEditor';
import { EditorToolbar } from './EditorToolbar';
import { EditorBubbleMenu } from './BubbleMenu';
import { EditorStats } from './EditorStats';
import { HTMLCodeEditor } from './HTMLCodeEditor';
import { buildThemeStyles } from '../utils/theme';
import type { RichTextEditorProps, RichTextEditorRef } from '../types/editor';

export const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  (props, ref) => {
    const {
      value,
      defaultValue,
      onChange,
      onChangeValue,
      editable = true,
      placeholder = 'Start writing...',
      features = {},
      toolbar,
      renderToolbar,
      theme,
      onImageUpload,
      maxCharacters,
      showStats = true,
      stickyToolbar = true,
      bubbleMenu = true,
      autoFocus = false,
      dir = 'ltr',
      className = '',
      toolbarClassName = '',
      contentClassName = '',
      customExtensions,
      ariaLabel = 'Rich text editor content area',
      id,
      onFocus,
      onBlur,
    } = props;

    // Fullscreen and Source Code state
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isSourceCodeView, setIsSourceCodeView] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Initialize core editor logic hook
    const editorState = useRichTextEditor({
      value,
      defaultValue,
      onChange,
      onChangeValue,
      editable,
      placeholder,
      features,
      maxCharacters,
      autoFocus,
      customExtensions,
      dir,
      onFocus,
      onBlur,
    });

    const {
      editor,
      getHTML,
      getJSON,
      getText,
      getValue,
      setContent,
      clearContent,
      focus,
      blur,
      undo,
      redo,
      characterCount,
      wordCount,
      readingTime,
    } = editorState;

    // Expose ref API to parent components
    useImperativeHandle(
      ref,
      (): RichTextEditorRef => ({
        editor,
        getHTML,
        getJSON,
        getText,
        getValue,
        setContent,
        clearContent,
        focus,
        blur,
        undo,
        redo,
      }),
      [editor, getHTML, getJSON, getText, getValue, setContent, clearContent, focus, blur, undo, redo]
    );

    const handleToggleFullscreen = useCallback(() => {
      setIsFullscreen((prev) => !prev);
    }, []);

    const handleToggleSourceCode = useCallback(() => {
      setIsSourceCodeView((prev) => !prev);
    }, []);

    const handleApplySourceCode = useCallback(
      (newHtml: string) => {
        if (editor) {
          editor.commands.setContent(newHtml, { emitUpdate: true });
        }
      },
      [editor]
    );

    // Dynamic style computation for theme CSS variables
    const themeStyles = buildThemeStyles(theme);

    return (
      <div
        ref={containerRef}
        id={id}
        role="region"
        aria-label={ariaLabel}
        style={themeStyles}
        className={`
          rich-text-editor-container
          relative flex flex-col w-full
          bg-[var(--rte-background,#ffffff)] dark:bg-[var(--rte-background,#0f172a)]
          border border-slate-200 dark:border-slate-800
          text-slate-900 dark:text-slate-100
          rounded-xl shadow-xs transition-all duration-200
          ${isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen max-h-screen overflow-hidden' : ''}
          ${className}
        `}
      >
        {/* Sticky/Static Toolbar */}
        {toolbar !== false && (
          <div
            className={`
              rte-toolbar-wrapper
              ${stickyToolbar ? 'sticky top-0 z-20' : ''}
              ${isFullscreen ? 'top-0' : ''}
              ${toolbarClassName}
            `}
          >
            {renderToolbar ? (
              renderToolbar({
                editor,
                isFullscreen,
                isSourceCodeView,
                toggleFullscreen: handleToggleFullscreen,
                toggleSourceCode: handleToggleSourceCode,
              })
            ) : (
              <EditorToolbar
                editor={editor}
                toolbar={toolbar}
                features={features}
                onImageUpload={onImageUpload}
                isFullscreen={isFullscreen}
                onToggleFullscreen={handleToggleFullscreen}
                isSourceCodeView={isSourceCodeView}
                onToggleSourceCode={handleToggleSourceCode}
                disabled={!editable}
              />
            )}
          </div>
        )}

        {/* Bubble Menu on Selection */}
        {bubbleMenu && editable && !isSourceCodeView && editor && (
          <EditorBubbleMenu editor={editor} />
        )}

        {/* Editor Body */}
        <div
          className={`
            rte-body-wrapper flex-1 overflow-y-auto min-h-[180px]
            ${isFullscreen ? 'max-h-[calc(100vh-80px)]' : ''}
          `}
        >
          {isSourceCodeView ? (
            <HTMLCodeEditor
              html={getHTML()}
              onChange={handleApplySourceCode}
              onClose={() => setIsSourceCodeView(false)}
            />
          ) : (
            <EditorContent
              editor={editor}
              className={`
                rte-editor-content
                h-full text-slate-800 dark:text-slate-200
                ${contentClassName}
              `}
            />
          )}
        </div>

        {/* Bottom Status & Count Bar */}
        {showStats && (
          <EditorStats
            wordCount={wordCount}
            characterCount={characterCount}
            readingTime={readingTime}
            maxCharacters={maxCharacters}
            isEditable={editable}
          />
        )}
      </div>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';
