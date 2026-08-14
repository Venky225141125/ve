import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
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

const VIEWPORT_PADDING = 8;
const MENU_GAP = 8;

function clamp(value: number, min: number, max: number): number {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
}

export const EditorBubbleMenu: React.FC<BubbleMenuProps> = ({ editor, onOpenLinkModal }) => {
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

    if (selection.empty || !view.hasFocus()) {
      setIsVisible(false);
      return;
    }

    try {
      const fromPos = view.coordsAtPos(selection.from);
      const toPos = view.coordsAtPos(selection.to);
      const selectionTop = Math.min(fromPos.top, toPos.top);
      const selectionBottom = Math.max(
        fromPos.bottom ?? fromPos.top + 18,
        toPos.bottom ?? toPos.top + 18
      );
      const selectionCenter = (fromPos.left + toPos.left) / 2;

      const menuEl = menuRef.current;
      const menuWidth = menuEl?.offsetWidth || 360;
      const menuHeight = menuEl?.offsetHeight || 40;

      const maxLeft = window.innerWidth - menuWidth - VIEWPORT_PADDING;
      const left = clamp(selectionCenter - menuWidth / 2, VIEWPORT_PADDING, maxLeft);

      const above = selectionTop - menuHeight - MENU_GAP;
      const below = selectionBottom + MENU_GAP;
      const top =
        above >= VIEWPORT_PADDING
          ? above
          : clamp(below, VIEWPORT_PADDING, window.innerHeight - menuHeight - VIEWPORT_PADDING);

      setCoords((prev) => (prev.top === top && prev.left === left ? prev : { top, left }));
      setIsVisible(true);
    } catch {
      setIsVisible(false);
    }
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      requestAnimationFrame(updatePosition);
    };

    const handleBlur = () => {
      window.setTimeout(() => {
        if (!menuRef.current?.contains(document.activeElement)) {
          setIsVisible(false);
        }
      }, 150);
    };

    editor.on('selectionUpdate', handleUpdate);
    editor.on('transaction', handleUpdate);
    editor.on('blur', handleBlur);
    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);

    return () => {
      editor.off('selectionUpdate', handleUpdate);
      editor.off('transaction', handleUpdate);
      editor.off('blur', handleBlur);
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [editor, updatePosition]);

  useLayoutEffect(() => {
    if (isVisible) {
      updatePosition();
    }
  }, [isVisible, updatePosition]);

  if (!editor || typeof document === 'undefined') return null;

  const btn = (active: boolean) => `rte-btn ${active ? 'is-active' : ''}`;

  return createPortal(
    <div
      ref={menuRef}
      role="toolbar"
      aria-label="Floating text selection formatting menu"
      aria-hidden={!isVisible}
      style={{
        position: 'fixed',
        top: coords.top,
        left: coords.left,
        zIndex: 80,
        visibility: isVisible ? 'visible' : 'hidden',
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
      className="rte-bubble"
      onMouseDown={(e) => {
        e.preventDefault();
      }}
    >
      <button
        type="button"
        title="Bold"
        className={btn(editor.isActive('bold'))}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={14} />
      </button>
      <button
        type="button"
        title="Italic"
        className={btn(editor.isActive('italic'))}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={14} />
      </button>
      <button
        type="button"
        title="Underline"
        className={btn(editor.isActive('underline'))}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon size={14} />
      </button>
      <button
        type="button"
        title="Strikethrough"
        className={btn(editor.isActive('strike'))}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough size={14} />
      </button>
      <button
        type="button"
        title="Inline Code"
        className={btn(editor.isActive('code'))}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code size={14} />
      </button>
      <span className="rte-sep" />
      <button
        type="button"
        title="Heading 1"
        className={btn(editor.isActive('heading', { level: 1 }))}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 size={14} />
      </button>
      <button
        type="button"
        title="Heading 2"
        className={btn(editor.isActive('heading', { level: 2 }))}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 size={14} />
      </button>
      <button
        type="button"
        title="Quote"
        className={btn(editor.isActive('blockquote'))}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote size={14} />
      </button>
      <button
        type="button"
        title="Highlight"
        className={btn(editor.isActive('highlight'))}
        onClick={() => editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run()}
      >
        <Highlighter size={14} />
      </button>
      <button
        type="button"
        title="Link"
        className={btn(editor.isActive('link'))}
        onClick={() => onOpenLinkModal?.()}
      >
        <LinkIcon size={14} />
      </button>
    </div>,
    document.body
  );
};
