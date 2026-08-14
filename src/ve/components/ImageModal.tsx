import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, Link as LinkIcon, X, Loader2, AlignLeft, AlignCenter, AlignRight, Check } from 'lucide-react';
import type { ImageUploadHandler } from '../types/editor';

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

  if (!isOpen) return null;

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
        // Fallback to base64 Data URL if no upload handler provided
        finalUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Failed to read image file'));
          reader.readAsDataURL(file);
        });
      }

      setSrc(finalUrl);
      if (!alt) setAlt(file.name.replace(/\.[^/.]+$/, ''));
    } catch (err: any) {
      setError(err?.message || 'Failed to process image file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
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

    // Reset
    setSrc('');
    setAlt('');
    setTitle('');
    setWidth('100%');
    setAlignment('center');
    setError(null);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold">
            <ImageIcon className="w-4 h-4 text-[var(--rte-primary,#3b82f6)]" />
            <h2 id="image-modal-title" className="text-sm font-semibold">
              Insert Image
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

        {/* Tab switcher */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-slate-900 text-[var(--rte-primary,#3b82f6)] shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'url'
                ? 'bg-white dark:bg-slate-900 text-[var(--rte-primary,#3b82f6)] shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            Image URL
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-2.5 text-xs bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/60 rounded-lg text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {activeTab === 'upload' ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileUpload(e.target.files[0]);
                  }
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
                className={`
                  border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-150
                  ${
                    dragOver
                      ? 'border-[var(--rte-primary,#3b82f6)] bg-[var(--rte-primary-hover,rgba(59,130,246,0.05))]'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/30'
                  }
                `}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center justify-center py-2 text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin text-[var(--rte-primary,#3b82f6)] mb-2" />
                    <p className="text-xs font-medium">Processing image...</p>
                  </div>
                ) : src ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative max-h-36 max-w-full rounded overflow-hidden border border-slate-200 dark:border-slate-700">
                      <img src={src} alt="Uploaded preview" className="max-h-36 object-contain" />
                    </div>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Image ready. Click to change.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-[var(--rte-primary,#3b82f6)] rounded-full mb-2">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-0.5">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      PNG, JPG, WebP, GIF, or SVG
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Image Web URL *
              </label>
              <input
                type="url"
                required
                value={src}
                onChange={(e) => setSrc(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[var(--rte-primary,#3b82f6)]"
              />
            </div>
          )}

          {/* Alt & Title */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Alt Text (Accessibility)
              </label>
              <input
                type="text"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Image description..."
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[var(--rte-primary,#3b82f6)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Caption / Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Optional caption..."
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[var(--rte-primary,#3b82f6)]"
              />
            </div>
          </div>

          {/* Alignment & Width */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Alignment
              </label>
              <div className="flex border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 bg-slate-50 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setAlignment('left')}
                  className={`flex-1 py-1 flex items-center justify-center rounded text-xs transition-colors ${
                    alignment === 'left' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500'
                  }`}
                  title="Align Left"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setAlignment('center')}
                  className={`flex-1 py-1 flex items-center justify-center rounded text-xs transition-colors ${
                    alignment === 'center' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500'
                  }`}
                  title="Align Center"
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setAlignment('right')}
                  className={`flex-1 py-1 flex items-center justify-center rounded text-xs transition-colors ${
                    alignment === 'right' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500'
                  }`}
                  title="Align Right"
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Width Preset
              </label>
              <select
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[var(--rte-primary,#3b82f6)]"
              >
                <option value="100%">100% (Full width)</option>
                <option value="75%">75% Width</option>
                <option value="50%">50% (Half width)</option>
                <option value="300px">300px (Compact)</option>
                <option value="500px">500px (Medium)</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!src || isUploading}
              className="px-4 py-1.5 text-xs font-medium bg-[var(--rte-primary,#3b82f6)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
            >
              Insert Image
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
