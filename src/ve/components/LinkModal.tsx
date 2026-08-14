import React, { useState, useEffect } from 'react';
import { Link as LinkIcon, ExternalLink, X, Trash2 } from 'lucide-react';
import { normalizeHref } from '../utils/links';
import { ThemedPortal } from './ThemedPortal';

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

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!href.trim()) {
      onRemove();
      onClose();
      return;
    }

    onSubmit({
      href: normalizeHref(href),
      target: openInNewTab ? '_blank' : '_self',
      text: text.trim() || undefined,
    });
    onClose();
  };

  return (
    <ThemedPortal
      open={isOpen}
      role="dialog"
      aria-modal="true"
      aria-labelledby="link-modal-title"
      className="rte-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="rte-modal">
        <div className="rte-modal-header">
          <div className="rte-modal-title">
            <LinkIcon size={16} />
            <h2 id="link-modal-title">{initialHref ? 'Edit Link' : 'Insert Link'}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="rte-btn">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="rte-modal-body">
          <div className="rte-field">
            <label htmlFor="ve-link-url">Link URL *</label>
            <input
              id="ve-link-url"
              type="text"
              autoFocus
              required
              value={href}
              onChange={(e) => setHref(e.target.value)}
              placeholder="https://example.com"
              className="rte-input"
            />
          </div>

          <div className="rte-field">
            <label htmlFor="ve-link-text">Link Text (optional)</label>
            <input
              id="ve-link-text"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Display text..."
              className="rte-input"
            />
          </div>

          <label className="rte-check">
            <input
              type="checkbox"
              checked={openInNewTab}
              onChange={(e) => setOpenInNewTab(e.target.checked)}
            />
            <ExternalLink size={14} />
            <span>Open in new browser tab</span>
          </label>

          <div className="rte-modal-footer">
            {initialHref ? (
              <button
                type="button"
                onClick={() => {
                  onRemove();
                  onClose();
                }}
                className="rte-btn-danger"
              >
                <Trash2 size={14} />
                Remove Link
              </button>
            ) : (
              <div />
            )}

            <div className="rte-actions">
              <button type="button" onClick={onClose} className="rte-btn-ghost">
                Cancel
              </button>
              <button type="submit" className="rte-btn-primary">
                {initialHref ? 'Save Changes' : 'Insert Link'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </ThemedPortal>
  );
};
