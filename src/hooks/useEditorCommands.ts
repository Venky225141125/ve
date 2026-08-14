import { useCallback } from 'react';
import type { Editor } from '@tiptap/core';

export function useEditorCommands(editor: Editor | null) {
  const isMarkActive = useCallback(
    (name: string, attributes?: Record<string, any>) => {
      if (!editor) return false;
      return editor.isActive(name, attributes);
    },
    [editor]
  );

  const isNodeActive = useCallback(
    (name: string, attributes?: Record<string, any>) => {
      if (!editor) return false;
      return editor.isActive(name, attributes);
    },
    [editor]
  );

  const toggleBold = useCallback(() => {
    editor?.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor?.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleUnderline = useCallback(() => {
    editor?.chain().focus().toggleUnderline().run();
  }, [editor]);

  const toggleStrike = useCallback(() => {
    editor?.chain().focus().toggleStrike().run();
  }, [editor]);

  const toggleCode = useCallback(() => {
    editor?.chain().focus().toggleCode().run();
  }, [editor]);

  const toggleSubscript = useCallback(() => {
    editor?.chain().focus().toggleSubscript().run();
  }, [editor]);

  const toggleSuperscript = useCallback(() => {
    editor?.chain().focus().toggleSuperscript().run();
  }, [editor]);

  const clearFormatting = useCallback(() => {
    editor?.chain().focus().unsetAllMarks().clearNodes().run();
  }, [editor]);

  const setHeading = useCallback(
    (level: 1 | 2 | 3 | 4 | 5 | 6) => {
      editor?.chain().focus().toggleHeading({ level }).run();
    },
    [editor]
  );

  const setParagraph = useCallback(() => {
    editor?.chain().focus().setParagraph().run();
  }, [editor]);

  const setFontFamily = useCallback(
    (fontFamily: string) => {
      if (!fontFamily || fontFamily === 'inherit') {
        editor?.chain().focus().unsetFontFamily().run();
      } else {
        editor?.chain().focus().setFontFamily(fontFamily).run();
      }
    },
    [editor]
  );

  const setFontSize = useCallback(
    (fontSize: string) => {
      if (!fontSize) {
        editor?.chain().focus().unsetFontSize().run();
      } else {
        editor?.chain().focus().setFontSize(fontSize).run();
      }
    },
    [editor]
  );

  const setTextColor = useCallback(
    (color: string) => {
      if (!color) {
        editor?.chain().focus().unsetColor().run();
      } else {
        editor?.chain().focus().setColor(color).run();
      }
    },
    [editor]
  );

  const setHighlight = useCallback(
    (color: string) => {
      if (!color || color === 'transparent') {
        editor?.chain().focus().unsetHighlight().run();
      } else {
        editor?.chain().focus().setHighlight({ color }).run();
      }
    },
    [editor]
  );

  const setTextAlign = useCallback(
    (alignment: 'left' | 'center' | 'right' | 'justify') => {
      editor?.chain().focus().setTextAlign(alignment).run();
    },
    [editor]
  );

  const toggleBulletList = useCallback(() => {
    editor?.chain().focus().toggleBulletList().run();
  }, [editor]);

  const toggleOrderedList = useCallback(() => {
    editor?.chain().focus().toggleOrderedList().run();
  }, [editor]);

  const toggleTaskList = useCallback(() => {
    editor?.chain().focus().toggleTaskList().run();
  }, [editor]);

  const toggleBlockquote = useCallback(() => {
    editor?.chain().focus().toggleBlockquote().run();
  }, [editor]);

  const toggleCodeBlock = useCallback(() => {
    editor?.chain().focus().toggleCodeBlock().run();
  }, [editor]);

  const insertHorizontalRule = useCallback(() => {
    editor?.chain().focus().setHorizontalRule().run();
  }, [editor]);

  return {
    isMarkActive,
    isNodeActive,
    toggleBold,
    toggleItalic,
    toggleUnderline,
    toggleStrike,
    toggleCode,
    toggleSubscript,
    toggleSuperscript,
    clearFormatting,
    setHeading,
    setParagraph,
    setFontFamily,
    setFontSize,
    setTextColor,
    setHighlight,
    setTextAlign,
    toggleBulletList,
    toggleOrderedList,
    toggleTaskList,
    toggleBlockquote,
    toggleCodeBlock,
    insertHorizontalRule,
  };
}
