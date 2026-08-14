import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Editor } from '@tiptap/core';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Link as LinkIcon,
  Highlighter,
  Heading1,
  Heading2,
  Quote,
} from 'lucide-react';

export interface BubbleMenuProps {
  editor: Editor | null;
  onOpenLinkModal?: () => void;
}

export const EditorBubbleMenu: React.FC<BubbleMenuProps> = ({
  editor,
  onOpenLinkModal,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!editor || editor.isDestroyed || !editor.view) {
      setIsVisible(false);
      return;
    }

    const { state, view } = editor;
    const { selection } = state;

    // Only display when text is selected (not empty cursor)
    if (selection.empty) {
      setIsVisible(false);
      return;
    }

    try {
      const fromPos = view.coordsAtPos(selection.from);
      const toPos = view.coordsAtPos(selection.to);
      const editorBounds = view.dom.getBoundingClientRect();

      const top = Math.min(fromPos.top, toPos.top) - 48;
      const left = (fromPos.left + toPos.left) / 2;

      // Ensure it stays within viewport
      const boundedLeft = Math.max(120, Math.min(window.innerWidth - 120, left));
      const boundedTop = Math.max(10, top);

      setCoords({
        top: boundedTop,
        left: boundedLeft,
      });
      setIsVisible(true);
    } catch {
      setIsVisible(false);
    }
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      // Delay slightly for accurate DOM coordinates
      requestAnimationFrame(updatePosition);
    };

    editor.on('selectionUpdate', handleUpdate);
    editor.on('transaction', handleUpdate);
    editor.on('blur', () => {
      // Small timeout to allow button clicks in menu
      setTimeout(() => {
        if (!menuRef.current?.contains(document.activeElement)) {
          setIsVisible(false);
        }
      }, 150);
    });

    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);

    return () => {
      editor.off('selectionUpdate', handleUpdate);
      editor.off('transaction', handleUpdate);
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [editor, updatePosition]);

  if (!editor || !isVisible) return null;

  return (
    <div
      ref={menuRef}
      role="toolbar"
      aria-label="Floating text selection formatting menu"
      style={{
        position: 'fixed',
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        transform: 'translateX(-50%)',
        zIndex: 50,
      }}
      className="flex items-center gap-0.5 p-1 bg-slate-900 dark:bg-slate-800 text-white rounded-lg shadow-xl border border-slate-700 dark:border-slate-600 animate-in fade-in zoom-in-95 duration-100 backdrop-blur-xs select-none"
      onMouseDown={(e) => {
        // Prevent losing editor focus on click
        e.preventDefault();
      }}
    >
      <button
        type="button"
        title="Bold (Cmd+B)"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1.5 rounded hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors ${
          editor.isActive('bold') ? 'text-blue-400 font-bold bg-slate-800' : 'text-slate-200'
        }`}
      >
        <Bold className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        title="Italic (Cmd+I)"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors ${
          editor.isActive('italic') ? 'text-blue-400 font-bold bg-slate-800' : 'text-slate-200'
        }`}
      >
        <Italic className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        title="Underline (Cmd+U)"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-1.5 rounded hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors ${
          editor.isActive('underline') ? 'text-blue-400 font-bold bg-slate-800' : 'text-slate-200'
        }`}
      >
        <UnderlineIcon className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        title="Strikethrough"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-1.5 rounded hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors ${
          editor.isActive('strike') ? 'text-blue-400 font-bold bg-slate-800' : 'text-slate-200'
        }`}
      >
        <Strikethrough className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        title="Inline Code"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-1.5 rounded hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors ${
          editor.isActive('code') ? 'text-blue-400 font-bold bg-slate-800' : 'text-slate-200'
        }`}
      >
        <Code className="w-3.5 h-3.5" />
      </button>

      <span className="w-px h-4 bg-slate-700 mx-0.5" />

      <button
        type="button"
        title="Heading 1"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-1.5 rounded hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors ${
          editor.isActive('heading', { level: 1 }) ? 'text-blue-400 bg-slate-800' : 'text-slate-200'
        }`}
      >
        <Heading1 className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        title="Heading 2"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-1.5 rounded hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors ${
          editor.isActive('heading', { level: 2 }) ? 'text-blue-400 bg-slate-800' : 'text-slate-200'
        }`}
      >
        <Heading2 className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        title="Quote"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-1.5 rounded hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors ${
          editor.isActive('blockquote') ? 'text-blue-400 bg-slate-800' : 'text-slate-200'
        }`}
      >
        <Quote className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        title="Highlight"
        onClick={() => editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run()}
        className={`p-1.5 rounded hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors ${
          editor.isActive('highlight') ? 'text-yellow-400 bg-slate-800' : 'text-slate-200'
        }`}
      >
        <Highlighter className="w-3.5 h-3.5" />
      </button>

      {onOpenLinkModal && (
        <button
          type="button"
          title="Link"
          onClick={onOpenLinkModal}
          className={`p-1.5 rounded hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors ${
            editor.isActive('link') ? 'text-blue-400 bg-slate-800' : 'text-slate-200'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
