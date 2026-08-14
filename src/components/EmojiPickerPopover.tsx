import React, { useState, useRef, useEffect } from 'react';
import { Smile } from 'lucide-react';
import type { Editor } from '@tiptap/core';

export interface EmojiPickerPopoverProps {
  editor: Editor | null;
  isDisabled?: boolean;
}

const EMOJI_CATEGORIES: Record<string, string[]> = {
  'Frequently Used': ['😀', '😍', '🎉', '🚀', '🔥', '💡', '✅', '⭐', '👍', '❤️', '✨', '👏'],
  'Smiles & People': ['😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘', '😋', '😛', '🤔', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕'],
  'Gestures & Hands': ['👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️'],
  'Objects & Symbols': ['💡', '🔥', '✨', '⭐', '🌟', '💥', '⚡', '🎉', '🎊', '🎈', '🎁', '🏆', '🥇', '🥈', '🥉', '🎯', '🚀', '📌', '📍', '📎', '🔒', '🔑', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '💯', '💢', '💬', '🔔', '📢', '⚠️', '⛔', '🚫', '✅', '❌', '❓', '❗'],
  'Nature & Tech': ['💻', '📱', '⌨️', '🖥️', '💾', '💿', '📸', '🎧', '⚡', '☀️', '🌙', '⭐', '☁️', '🌧️', '❄️', '🌈', '🌲', '🌴', '🌱', '🌿', '☘️', '🍀', '☕', '🍕', '🍔', '🍟', '🍣', '🍰', '🍻'],
};

export const EmojiPickerPopover: React.FC<EmojiPickerPopoverProps> = ({
  editor,
  isDisabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const insertEmoji = (emoji: string) => {
    if (!editor) return;
    editor.chain().focus().insertContent(emoji).run();
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        disabled={isDisabled}
        title="Insert Emoji"
        aria-label="Insert Emoji"
        aria-expanded={isOpen}
        onClick={(e) => {
          e.preventDefault();
          if (!isDisabled) setIsOpen(!isOpen);
        }}
        className={`
          relative inline-flex items-center justify-center p-1.5 min-w-[32px] min-h-[32px] rounded text-sm transition-colors
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rte-primary,#3b82f6)]
          ${
            isDisabled
              ? 'opacity-40 cursor-not-allowed text-slate-400'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }
        `}
      >
        <Smile className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1.5 p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl w-72 max-h-80 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
          <div className="mb-2">
            <input
              type="text"
              placeholder="Search emojis..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[var(--rte-primary,#3b82f6)]"
            />
          </div>

          <div className="space-y-3">
            {Object.entries(EMOJI_CATEGORIES).map(([cat, emojis]) => {
              const filtered = search
                ? emojis.filter((e) => e.includes(search))
                : emojis;

              if (filtered.length === 0) return null;

              return (
                <div key={cat}>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                    {cat}
                  </div>
                  <div className="grid grid-cols-6 gap-1">
                    {filtered.map((em, idx) => (
                      <button
                        key={`${em}-${idx}`}
                        type="button"
                        onClick={() => insertEmoji(em)}
                        className="text-lg p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-transform hover:scale-125 focus:outline-none"
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
