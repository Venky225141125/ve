import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import { EditorContent } from '@tiptap/react';
import { useRichTextEditor } from '../hooks/useRichTextEditor';
import { EditorToolbar } from './EditorToolbar';
import { EditorBubbleMenu } from './BubbleMenu';
import { EditorStats } from './EditorStats';
import { HTMLCodeEditor } from './HTMLCodeEditor';
import { buildThemeStyles } from '../utils/theme';
import { sanitizeHTML } from '../utils/serialization';
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

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isSourceCodeView, setIsSourceCodeView] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

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
        setContent(sanitizeHTML(newHtml), true);
      },
      [setContent]
    );

    useEffect(() => {
      if (!isFullscreen) return;
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setIsFullscreen(false);
        }
      };
      window.addEventListener('keydown', onKeyDown);
      return () => window.removeEventListener('keydown', onKeyDown);
    }, [isFullscreen]);

    const themeStyles = buildThemeStyles(theme);

    return (
      <div
        ref={containerRef}
        id={id}
        role="region"
        aria-label={ariaLabel}
        style={themeStyles}
        className={`rte-root ${isFullscreen ? 'rte-fullscreen' : ''} ${className}`.trim()}
      >
        {toolbar !== false && (
          <div className={`rte-toolbar-wrapper ${stickyToolbar ? 'rte-sticky' : ''} ${toolbarClassName}`.trim()}>
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

        {bubbleMenu && editable && !isSourceCodeView && editor && (
          <EditorBubbleMenu
            editor={editor}
            onOpenLinkModal={() => {
              window.dispatchEvent(new CustomEvent('ve:open-link-modal', { detail: editor }));
            }}
          />
        )}

        <div className="rte-body">
          {isSourceCodeView ? (
            <HTMLCodeEditor
              html={getHTML()}
              onChange={handleApplySourceCode}
              onClose={() => setIsSourceCodeView(false)}
            />
          ) : (
            <EditorContent editor={editor} className={`rte-editor-content ${contentClassName}`.trim()} />
          )}
        </div>

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
