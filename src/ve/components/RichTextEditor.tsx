import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
  useCallback,
  useEffect,
  useLayoutEffect,
} from 'react';
import { EditorContent } from '@tiptap/react';
import { useRichTextEditor } from '../hooks/useRichTextEditor';
import { EditorToolbar } from './EditorToolbar';
import { EditorBubbleMenu } from './BubbleMenu';
import { EditorStats } from './EditorStats';
import { HTMLCodeEditor } from './HTMLCodeEditor';
import { buildThemeStyles, readControlContrast } from '../utils/theme';
import { sanitizeHTML } from '../utils/serialization';
import { resolveToolbarItems, toolbarOffersItem } from '../utils/constants';
import { resolveStatsConfig } from './EditorStats';
import type { CSSProperties } from 'react';
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
      style,
      cssVariables,
      dark,
      onImageUpload,
      maxCharacters,
      showStats = false,
      allowEmoji = true,
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
    const toolbarFeatures = {
      ...features,
      emoji: allowEmoji === false ? false : features.emoji,
    };
    const resolvedToolbar = resolveToolbarItems(toolbar);
    const canUseEmoji =
      allowEmoji !== false && toolbarOffersItem(resolvedToolbar, 'emoji', toolbarFeatures);
    const statsConfig = resolveStatsConfig(showStats);

    const editorState = useRichTextEditor({
      value,
      defaultValue,
      onChange,
      onChangeValue,
      editable,
      placeholder,
      features,
      allowEmoji: canUseEmoji,
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

    const themeStyles = buildThemeStyles(theme, cssVariables);
    const [contrastStyle, setContrastStyle] = useState<CSSProperties>({});

    useLayoutEffect(() => {
      const root = containerRef.current;
      if (!root) return;

      const apply = () => {
        const next = readControlContrast(root);
        setContrastStyle((prev) => {
          const previous = prev as Record<string, string>;
          const upcoming = next as Record<string, string>;
          if (
            previous['--rte-on-toolbar'] === upcoming['--rte-on-toolbar'] &&
            previous['--rte-on-surface'] === upcoming['--rte-on-surface'] &&
            previous['--rte-on-hover'] === upcoming['--rte-on-hover'] &&
            previous['--rte-on-active'] === upcoming['--rte-on-active']
          ) {
            return prev;
          }
          return next;
        });
      };

      apply();
      const observer = new MutationObserver(apply);
      observer.observe(root, { attributes: true, attributeFilter: ['class', 'style'] });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      return () => observer.disconnect();
    }, [theme, dark, cssVariables]);

    return (
      <div
        ref={containerRef}
        id={id}
        role="region"
        aria-label={ariaLabel}
        style={{ ...themeStyles, ...contrastStyle, ...style }}
        className={`rte-root ${dark ? 'dark' : ''} ${isFullscreen ? 'rte-fullscreen' : ''} ${className}`.trim()}
      >
        {resolvedToolbar !== false && (
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
                toolbar={resolvedToolbar}
                features={toolbarFeatures}
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

        {statsConfig && (
          <EditorStats
            wordCount={wordCount}
            characterCount={characterCount}
            readingTime={readingTime}
            maxCharacters={maxCharacters}
            isEditable={editable}
            config={statsConfig}
          />
        )}
      </div>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';
