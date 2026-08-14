import React, { useEffect, useState } from 'react';
import { Youtube as YoutubeIcon, X } from 'lucide-react';
import { ThemedPortal } from './ThemedPortal';

export interface YoutubeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (options: { src: string; width: number; height: number }) => void;
}

const YOUTUBE_PATTERN =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/)[\w-]+/i;

export const YoutubeModal: React.FC<YoutubeModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [url, setUrl] = useState('');
  const [width, setWidth] = useState(640);
  const [height, setHeight] = useState(360);
  const [error, setError] = useState<string | null>(null);

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
    const trimmed = url.trim();
    if (!trimmed || !YOUTUBE_PATTERN.test(trimmed)) {
      setError('Please provide a valid YouTube URL');
      return;
    }

    onSubmit({ src: trimmed, width, height });
    setUrl('');
    setError(null);
    onClose();
  };

  return (
    <ThemedPortal
      open={isOpen}
      role="dialog"
      aria-modal="true"
      aria-labelledby="youtube-modal-title"
      className="rte-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="rte-modal">
        <div className="rte-modal-header">
          <div className="rte-modal-title">
            <YoutubeIcon size={16} />
            <h2 id="youtube-modal-title">Embed YouTube Video</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="rte-btn">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="rte-modal-body">
          {error && <div className="rte-error">{error}</div>}

          <div className="rte-field">
            <label htmlFor="ve-youtube-url">YouTube Video URL *</label>
            <input
              id="ve-youtube-url"
              type="text"
              required
              autoFocus
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="rte-input"
            />
          </div>

          <div className="rte-grid-2">
            <div className="rte-field">
              <label htmlFor="ve-youtube-width">Width (px)</label>
              <input
                id="ve-youtube-width"
                type="number"
                min={240}
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="rte-input"
              />
            </div>
            <div className="rte-field">
              <label htmlFor="ve-youtube-height">Height (px)</label>
              <input
                id="ve-youtube-height"
                type="number"
                min={135}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="rte-input"
              />
            </div>
          </div>

          <div className="rte-modal-footer">
            <div className="rte-actions">
              <button type="button" onClick={onClose} className="rte-btn-ghost">
                Cancel
              </button>
              <button type="submit" className="rte-btn-primary">
                Embed Video
              </button>
            </div>
          </div>
        </form>
      </div>
    </ThemedPortal>
  );
};
