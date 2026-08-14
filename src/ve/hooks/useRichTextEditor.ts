import { useEffect, useCallback, useMemo } from 'react';
import { useEditor, type Editor, type JSONContent } from '@tiptap/react';
import { createEditorExtensions } from '../extensions';
import { extractRichTextValue, countWords, calculateReadingTime } from '../utils/serialization';
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
  } = options;

  // Memoize extensions to prevent unnecessary editor recreation
  const extensions = useMemo(() => {
    return createEditorExtensions({
      features,
      placeholder,
      maxCharacters,
      customExtensions,
    });
  }, [features, placeholder, maxCharacters, customExtensions]);

  const initialContent = value !== undefined ? value : defaultValue ?? '';

  const editor = useEditor({
    extensions,
    content: initialContent,
    editable,
    autofocus: autoFocus,
    // Critical for Next.js App Router and SSR hydration compatibility
    immediatelyRender: false,
    editorProps: {
      attributes: {
        dir,
        class: 'rte-prose-content focus:outline-none min-h-[160px] py-4 px-5 text-inherit',
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      const html = currentEditor.getHTML();
      const cleanHtml = html === '<p></p>' ? '' : html;

      onChange?.(cleanHtml);

      if (onChangeValue) {
        onChangeValue(extractRichTextValue(currentEditor));
      }

      onUpdate?.(currentEditor);
    },
    onFocus: () => {
      onFocus?.();
    },
    onBlur: () => {
      onBlur?.();
    },
  });

  // Synchronize controlled `value` prop
  useEffect(() => {
    if (!editor || value === undefined) return;

    const currentHTML = editor.getHTML();
    const cleanCurrent = currentHTML === '<p></p>' ? '' : currentHTML;
    const cleanNew = value === '<p></p>' ? '' : value;

    if (cleanCurrent !== cleanNew) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  // Synchronize `editable` prop
  useEffect(() => {
    if (!editor) return;
    if (editor.isEditable !== editable) {
      editor.setEditable(editable);
    }
  }, [editable, editor]);

  // Editor Action Callbacks
  const getHTML = useCallback(() => {
    if (!editor) return '';
    const html = editor.getHTML();
    return html === '<p></p>' ? '' : html;
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
      editor.commands.setContent(content, { emitUpdate });
    },
    [editor]
  );

  const clearContent = useCallback(
    (emitUpdate = true) => {
      if (!editor) return;
      editor.commands.clearContent(emitUpdate);
    },
    [editor]
  );

  const focus = useCallback(
    (position: 'start' | 'end' | 'all' | number | boolean = true) => {
      if (!editor) return;
      editor.commands.focus(position as any);
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
      return (editor.commands as any).setImage(imgOptions);
    },
    [editor]
  );

  const insertLink = useCallback(
    ({ href, target = '_blank', text }: { href: string; target?: string; text?: string }) => {
      if (!editor) return false;

      if (!href) {
        return editor.chain().focus().extendMarkRange('link').unsetLink().run();
      }

      if (text && editor.state.selection.empty) {
        return editor
          .chain()
          .focus()
          .insertContent(`<a href="${href}" target="${target}">${text}</a>`)
          .run();
      }

      return editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href, target })
        .run();
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
