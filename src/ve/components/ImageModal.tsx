import React, { useEffect, useRef, useState } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  X,
  Loader2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Check,
} from 'lucide-react';
import type { ImageUploadHandler } from '../types/editor';
import { ThemedPortal } from './ThemedPortal';

export interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (options: {
    src: string;
    alt?: string;
    title?: string;
    width?: string | number;
    alignment?: 'left' | 'center' | 'right' | 'inline';
    caption?: string;
  }) => void;
  onImageUpload?: ImageUploadHandler;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onImageUpload,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [src, setSrc] = useState('');
  const [alt, setAlt] = useState('');
  const [title, setTitle] = useState('');
  const [width, setWidth] = useState('100%');
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right' | 'inline'>('center');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, SVG, WebP, GIF).');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      let finalUrl = '';
      if (onImageUpload) {
        finalUrl = await onImageUpload(file);
      } else {
        finalUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Failed to read image file'));
          reader.readAsDataURL(file);
        });
      }

      setSrc(finalUrl);
      if (!alt) setAlt(file.name.replace(/\.[^/.]+$/, ''));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to process image file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!src.trim()) {
      setError('Image URL or file is required.');
      return;
    }

    onSubmit({
      src: src.trim(),
      alt: alt.trim() || undefined,
      title: title.trim() || undefined,
      width: width || '100%',
      alignment,
    });

    setSrc('');
    setAlt('');
    setTitle('');
    setWidth('100%');
    setAlignment('center');
    setError(null);
    onClose();
  };

  return (
    <ThemedPortal
      open={isOpen}
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-modal-title"
      className="rte-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="rte-modal rte-modal-lg">
        <div className="rte-modal-header">
          <div className="rte-modal-title">
            <ImageIcon size={16} />
            <h2 id="image-modal-title">Insert Image</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="rte-btn">
            <X size={16} />
          </button>
        </div>

        <div className="rte-tabs">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`rte-tab ${activeTab === 'upload' ? 'is-active' : ''}`}
          >
            <Upload size={14} />
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`rte-tab ${activeTab === 'url' ? 'is-active' : ''}`}
          >
            <LinkIcon size={14} />
            Image URL
          </button>
        </div>

        <form onSubmit={handleSubmit} className="rte-modal-body">
          {error && <div className="rte-error">{error}</div>}

          {activeTab === 'upload' ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="rte-hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                }}
              />
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`rte-dropzone ${dragOver ? 'is-over' : ''}`}
              >
                {isUploading ? (
                  <div>
                    <Loader2 size={24} className="rte-spin" />
                    <p>Processing image...</p>
                  </div>
                ) : src ? (
                  <div>
                    <img src={src} alt="Uploaded preview" className="rte-preview-img" />
                    <p>
                      <Check size={14} /> Image ready. Click to change.
                    </p>
                  </div>
                ) : (
                  <div>
                    <Upload size={20} />
                    <p>Click to upload or drag and drop</p>
                    <p className="rte-muted">PNG, JPG, WebP, GIF, or SVG</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rte-field">
              <label htmlFor="ve-image-url">Image Web URL *</label>
              <input
                id="ve-image-url"
                type="text"
                required
                value={src}
                onChange={(e) => setSrc(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="rte-input"
              />
            </div>
          )}

          <div className="rte-grid-2">
            <div className="rte-field">
              <label htmlFor="ve-image-alt">Alt Text (Accessibility)</label>
              <input
                id="ve-image-alt"
                type="text"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Image description..."
                className="rte-input"
              />
            </div>
            <div className="rte-field">
              <label htmlFor="ve-image-title">Caption / Title</label>
              <input
                id="ve-image-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Optional caption..."
                className="rte-input"
              />
            </div>
          </div>

          <div className="rte-grid-2">
            <div className="rte-field">
              <span className="rte-label">Alignment</span>
              <div className="rte-align-group">
                <button
                  type="button"
                  onClick={() => setAlignment('left')}
                  className={alignment === 'left' ? 'is-active' : ''}
                  title="Align Left"
                >
                  <AlignLeft size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setAlignment('center')}
                  className={alignment === 'center' ? 'is-active' : ''}
                  title="Align Center"
                >
                  <AlignCenter size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setAlignment('right')}
                  className={alignment === 'right' ? 'is-active' : ''}
                  title="Align Right"
                >
                  <AlignRight size={14} />
                </button>
              </div>
            </div>
            <div className="rte-field">
              <label htmlFor="ve-image-width">Width Preset</label>
              <select
                id="ve-image-width"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="rte-select"
              >
                <option value="100%">100% (Full width)</option>
                <option value="75%">75% Width</option>
                <option value="50%">50% (Half width)</option>
                <option value="300px">300px (Compact)</option>
                <option value="500px">500px (Medium)</option>
              </select>
            </div>
          </div>

          <div className="rte-modal-footer">
            <div className="rte-actions">
              <button type="button" onClick={onClose} className="rte-btn-ghost">
                Cancel
              </button>
              <button type="submit" disabled={!src || isUploading} className="rte-btn-primary">
                Insert Image
              </button>
            </div>
          </div>
        </form>
      </div>
    </ThemedPortal>
  );
};
