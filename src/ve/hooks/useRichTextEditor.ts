import { useEffect, useCallback, useMemo, useRef } from 'react';
import { useEditor, type Editor, type JSONContent } from '@tiptap/react';
import { createEditorExtensions } from '../extensions';
import { extractRichTextValue, countWords, calculateReadingTime } from '../utils/serialization';
import { applyEditorLink } from '../utils/links';
import { stripEmojiTransaction } from '../extensions/filterEmoji';
import type { RichTextEditorProps, RichTextValue } from '../types/editor';

export interface UseRichTextEditorOptions
  extends Pick<
    RichTextEditorProps,
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'onChangeValue'
    | 'editable'
    | 'placeholder'
    | 'features'
    | 'maxCharacters'
    | 'autoFocus'
    | 'customExtensions'
    | 'dir'
    | 'onFocus'
    | 'onBlur'
    | 'allowEmoji'
  > {
  onUpdate?: (editor: Editor) => void;
}

export interface UseRichTextEditorReturn {
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
  isEmpty: boolean;
  characterCount: number;
  wordCount: number;
  readingTime: { minutes: number; text: string };
  insertImage: (options: {
    src: string;
    alt?: string;
    title?: string;
    width?: string | number;
    alignment?: 'left' | 'center' | 'right' | 'inline';
  }) => boolean;
  insertLink: (options: { href: string; target?: string; text?: string }) => boolean;
  insertTable: (options?: { rows?: number; cols?: number; withHeaderRow?: boolean }) => boolean;
}

function normalizeEditorHtml(html: string): string {
  if (!html || html === '<p></p>') return '';
  return html;
}

function getCharacterCountExtension(editor: Editor) {
  return editor.extensionManager.extensions.find((ext) => ext.name === 'characterCount');
}

function setCharacterLimit(editor: Editor, limit?: number | null) {
  const extension = getCharacterCountExtension(editor);
  if (extension) {
    extension.options.limit = limit ?? null;
  }
}

function withLiftedCharacterLimit<T>(editor: Editor, fn: () => T): T {
  const extension = getCharacterCountExtension(editor);
  const previous = extension?.options.limit;
  if (extension) {
    extension.options.limit = null;
  }
  try {
    return fn();
  } finally {
    if (extension) {
      extension.options.limit = previous ?? null;
    }
  }
}

export function useRichTextEditor(options: UseRichTextEditorOptions = {}): UseRichTextEditorReturn {
  const {
    value,
    defaultValue,
    onChange,
    onChangeValue,
    editable = true,
    placeholder = 'Start writing...',
    features,
    maxCharacters,
    autoFocus = false,
    customExtensions,
    dir = 'ltr',
    onFocus,
    onBlur,
    onUpdate,
    allowEmoji = true,
  } = options;

  const onChangeRef = useRef(onChange);
  const onChangeValueRef = useRef(onChangeValue);
  const onFocusRef = useRef(onFocus);
  const onBlurRef = useRef(onBlur);
  const onUpdateRef = useRef(onUpdate);
  const latestHtmlRef = useRef(normalizeEditorHtml(value ?? defaultValue ?? ''));

  onChangeRef.current = onChange;
  onChangeValueRef.current = onChangeValue;
  onFocusRef.current = onFocus;
  onBlurRef.current = onBlur;
  onUpdateRef.current = onUpdate;

  const featuresKey = JSON.stringify(features ?? {});
  const extensions = useMemo(
    () =>
      createEditorExtensions({
        features,
        placeholder,
        maxCharacters,
        customExtensions,
        allowEmoji,
      }),
    // maxCharacters and allowEmoji are applied live below so toggling them
    // does not remount the editor (that froze the playground page).
    // customExtensions is intentionally omitted: callers should memoize it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [featuresKey, placeholder]
  );

  const editor = useEditor(
    {
      extensions,
      content: value !== undefined ? value : latestHtmlRef.current || defaultValue || '',
      editable,
      autofocus: autoFocus,
      immediatelyRender: false,
      shouldRerenderOnTransaction: true,
      editorProps: {
        attributes: {
          dir,
          class: 'rte-prose-content',
        },
      },
      onUpdate: ({ editor: currentEditor }) => {
        const html = normalizeEditorHtml(currentEditor.getHTML());
        latestHtmlRef.current = html;
        onChangeRef.current?.(html);
        onChangeValueRef.current?.(extractRichTextValue(currentEditor));
        onUpdateRef.current?.(currentEditor);
      },
      onFocus: () => {
        onFocusRef.current?.();
      },
      onBlur: () => {
        onBlurRef.current?.();
      },
    },
    [extensions]
  );

  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    setCharacterLimit(editor, maxCharacters);
  }, [editor, maxCharacters]);

  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    const extension = editor.extensionManager.extensions.find((ext) => ext.name === 'filterEmoji');
    if (!extension) return;

    const blockEmoji = allowEmoji === false;
    extension.options.enabled = blockEmoji;
    if (editor.storage.filterEmoji) {
      editor.storage.filterEmoji.enabled = blockEmoji;
    }

    if (!blockEmoji) return;
    const transaction = stripEmojiTransaction(editor.state);
    if (transaction) {
      editor.view.dispatch(transaction);
    }
  }, [editor, allowEmoji]);

  useEffect(() => {
    if (!editor || editor.isDestroyed || value === undefined) return;

    const currentHTML = normalizeEditorHtml(editor.getHTML());
    const nextHTML = normalizeEditorHtml(value);

    if (currentHTML !== nextHTML) {
      withLiftedCharacterLimit(editor, () => {
        editor.commands.setContent(value || '', { emitUpdate: false });
      });
      latestHtmlRef.current = nextHTML;
    }
  }, [value, editor]);

  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    if (editor.isEditable !== editable) {
      editor.setEditable(editable);
    }
  }, [editable, editor]);

  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        window.dispatchEvent(new CustomEvent('ve:open-link-modal', { detail: editor }));
      }
    };
    editor.view.dom.addEventListener('keydown', onKeyDown);
    return () => editor.view.dom.removeEventListener('keydown', onKeyDown);
  }, [editor]);

  const getHTML = useCallback(() => {
    if (!editor) return '';
    return normalizeEditorHtml(editor.getHTML());
  }, [editor]);

  const getJSON = useCallback(() => {
    if (!editor) return { type: 'doc', content: [] };
    return editor.getJSON();
  }, [editor]);

  const getText = useCallback(() => {
    if (!editor) return '';
    return editor.getText();
  }, [editor]);

  const getValue = useCallback((): RichTextValue => {
    return extractRichTextValue(editor);
  }, [editor]);

  const setContent = useCallback(
    (content: string | JSONContent, emitUpdate = true) => {
      if (!editor) return;
      withLiftedCharacterLimit(editor, () => {
        editor.commands.setContent(content, { emitUpdate });
      });
      if (typeof content === 'string') {
        latestHtmlRef.current = normalizeEditorHtml(content);
      }
    },
    [editor]
  );

  const clearContent = useCallback(
    (emitUpdate = true) => {
      if (!editor) return;
      editor.commands.clearContent(emitUpdate);
      latestHtmlRef.current = '';
    },
    [editor]
  );

  const focus = useCallback(
    (position: 'start' | 'end' | 'all' | number | boolean = true) => {
      if (!editor) return;
      editor.commands.focus(position as never);
    },
    [editor]
  );

  const blur = useCallback(() => {
    if (!editor) return;
    editor.commands.blur();
  }, [editor]);

  const undo = useCallback((): boolean => {
    if (!editor) return false;
    return editor.commands.undo();
  }, [editor]);

  const redo = useCallback((): boolean => {
    if (!editor) return false;
    return editor.commands.redo();
  }, [editor]);

  const insertImage = useCallback(
    (imgOptions: {
      src: string;
      alt?: string;
      title?: string;
      width?: string | number;
      alignment?: 'left' | 'center' | 'right' | 'inline';
    }) => {
      if (!editor) return false;
      return editor.commands.setImage(imgOptions);
    },
    [editor]
  );

  const insertLink = useCallback(
    (linkOptions: { href: string; target?: string; text?: string }) => {
      return applyEditorLink(editor, linkOptions);
    },
    [editor]
  );

  const insertTable = useCallback(
    (tableOptions: { rows?: number; cols?: number; withHeaderRow?: boolean } = {}) => {
      if (!editor) return false;
      const { rows = 3, cols = 3, withHeaderRow = true } = tableOptions;
      return editor.chain().focus().insertTable({ rows, cols, withHeaderRow }).run();
    },
    [editor]
  );

  const text = editor ? editor.getText() : '';
  const isEmpty = editor ? editor.isEmpty : true;
  const characterCount = editor?.storage.characterCount?.characters?.() ?? text.length;
  const wordCount = editor?.storage.characterCount?.words?.() ?? countWords(text);
  const readingTime = calculateReadingTime(text);

  return {
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
    isEmpty,
    characterCount,
    wordCount,
    readingTime,
    insertImage,
    insertLink,
    insertTable,
  };
}
