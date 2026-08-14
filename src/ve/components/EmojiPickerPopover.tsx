import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Smile } from 'lucide-react';
import type { Editor } from '@tiptap/core';
import { useAnchoredPopover } from '../hooks/useAnchoredPopover';

export interface EmojiPickerPopoverProps {
  editor: Editor | null;
  isDisabled?: boolean;
}

const EMOJI_CATEGORIES: Record<string, string[]> = {
  'Frequently Used': ['😀', '😍', '🎉', '🚀', '🔥', '💡', '✅', '⭐', '👍', '❤️', '✨', '👏'],
  'Smiles & People': [
    '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘',
    '😋', '😛', '🤔', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😔', '😪', '🤤',
    '😴', '😷', '🤒', '🤕',
  ],
  'Gestures & Hands': [
    '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '👋', '🤚',
    '🖐️', '✋', '🖖', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️',
  ],
  'Objects & Symbols': [
    '💡', '🔥', '✨', '⭐', '🌟', '💥', '⚡', '🎉', '🎊', '🎈', '🎁', '🏆', '🥇', '🎯', '🚀',
    '📌', '📍', '📎', '🔒', '🔑', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '💯', '💬',
    '🔔', '📢', '⚠️', '⛔', '🚫', '✅', '❌', '❓', '❗',
  ],
  'Nature & Tech': [
    '💻', '📱', '⌨️', '🖥️', '💾', '📸', '🎧', '☀️', '🌙', '☁️', '🌧️', '❄️', '🌈', '🌲', '🌴',
    '🌱', '🌿', '☘️', '🍀', '☕', '🍕', '🍔', '🍟', '🍣', '🍰', '🍻',
  ],
};

export const EmojiPickerPopover: React.FC<EmojiPickerPopoverProps> = ({
  editor,
  isDisabled = false,
}) => {
  const { triggerRef, popoverRef, isOpen, setIsOpen, coords, themeStyle, isDark, keepEditorSelection } =
    useAnchoredPopover();
  const [search, setSearch] = useState('');

  const insertEmoji = (emoji: string) => {
    if (!editor) return;
    editor.chain().focus().insertContent(emoji).run();
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div ref={triggerRef} className="rte-dropdown">
      <button
        type="button"
        disabled={isDisabled}
        title="Insert Emoji"
        aria-label="Insert Emoji"
        aria-expanded={isOpen}
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => {
          e.preventDefault();
          if (!isDisabled) setIsOpen(!isOpen);
        }}
        className={`rte-btn ${isOpen ? 'is-active' : ''}`}
      >
        <Smile size={16} />
      </button>

      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={popoverRef}
            className={`rte-popover${isDark ? ' dark' : ''}`}
            style={{
              position: 'fixed',
              top: coords.top,
              left: coords.left,
              zIndex: 200,
              width: 288,
              maxHeight: 320,
              ...themeStyle,
            }}
            onMouseDown={keepEditorSelection}
          >
            <input
              type="text"
              placeholder="Search emojis..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rte-input"
              style={{ marginBottom: 8 }}
            />
            {Object.entries(EMOJI_CATEGORIES).map(([cat, emojis]) => {
              const filtered = search ? emojis.filter((e) => e.includes(search)) : emojis;
              if (filtered.length === 0) return null;
              return (
                <div key={cat} style={{ marginBottom: 12 }}>
                  <div className="rte-muted" style={{ textAlign: 'left', marginBottom: 6 }}>
                    {cat}
                  </div>
                  <div className="rte-emoji-grid">
                    {filtered.map((em, idx) => (
                      <button
                        key={`${em}-${idx}`}
                        type="button"
                        onClick={() => insertEmoji(em)}
                        className="rte-emoji-btn"
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>,
          document.body
        )}
    </div>
  );
};
