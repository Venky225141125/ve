import React, { useState, useEffect } from 'react';
import { Link as LinkIcon, ExternalLink, X, Trash2 } from 'lucide-react';

export interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (options: { href: string; target: string; text?: string }) => void;
  onRemove: () => void;
  initialHref?: string;
  initialTarget?: string;
  initialText?: string;
}

export const LinkModal: React.FC<LinkModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onRemove,
  initialHref = '',
  initialTarget = '_blank',
  initialText = '',
}) => {
  const [href, setHref] = useState(initialHref);
  const [text, setText] = useState(initialText);
  const [openInNewTab, setOpenInNewTab] = useState(initialTarget === '_blank');

  useEffect(() => {
    if (isOpen) {
      setHref(initialHref);
      setText(initialText);
      setOpenInNewTab(initialTarget === '_blank');
    }
  }, [isOpen, initialHref, initialTarget, initialText]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!href.trim()) {
      onRemove();
      onClose();
      return;
    }

    let formattedHref = href.trim();
    if (!/^https?:\/\//i.test(formattedHref) && !/^mailto:/i.test(formattedHref) && !/^tel:/i.test(formattedHref) && !/^#/i.test(formattedHref)) {
      formattedHref = `https://${formattedHref}`;
    }

    onSubmit({
      href: formattedHref,
      target: openInNewTab ? '_blank' : '_self',
      text: text.trim() || undefined,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="link-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold">
            <LinkIcon className="w-4 h-4 text-[var(--rte-primary,#3b82f6)]" />
            <h2 id="link-modal-title" className="text-sm font-semibold">
              {initialHref ? 'Edit Link' : 'Insert Link'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Link URL *
            </label>
            <div className="relative">
              <input
                type="text"
                autoFocus
                required
                value={href}
                onChange={(e) => setHref(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[var(--rte-primary,#3b82f6)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Link Text (optional)
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Display text..."
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[var(--rte-primary,#3b82f6)]"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400 select-none">
            <input
              type="checkbox"
              checked={openInNewTab}
              onChange={(e) => setOpenInNewTab(e.target.checked)}
              className="rounded border-slate-300 dark:border-slate-700 text-[var(--rte-primary,#3b82f6)] focus:ring-[var(--rte-primary,#3b82f6)]"
            />
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open in new browser tab</span>
          </label>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            {initialHref ? (
              <button
                type="button"
                onClick={() => {
                  onRemove();
                  onClose();
                }}
                className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600 dark:text-red-400 px-2 py-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove Link
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-medium bg-[var(--rte-primary,#3b82f6)] text-white rounded-lg hover:opacity-90 transition-opacity shadow-xs"
              >
                {initialHref ? 'Save Changes' : 'Insert Link'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
