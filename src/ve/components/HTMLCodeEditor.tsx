import React, { useState, useEffect } from 'react';
import { Copy, Check, Code, ArrowRightLeft } from 'lucide-react';

export interface HTMLCodeEditorProps {
  html: string;
  onChange: (newHtml: string) => void;
  onClose: () => void;
}

export const HTMLCodeEditor: React.FC<HTMLCodeEditorProps> = ({
  html,
  onChange,
  onClose,
}) => {
  const [content, setContent] = useState(html);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setContent(html);
  }, [html]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    onChange(content);
    onClose();
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 rounded-b-xl overflow-hidden min-h-[300px]">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-mono">
          <Code className="w-4 h-4 text-blue-400" />
          <span>HTML Source Code View</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy HTML'}</span>
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex items-center gap-1 px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Apply & Return to Visual Editor</span>
          </button>
        </div>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 w-full p-4 font-mono text-xs text-blue-300 bg-slate-900 border-none resize-none focus:outline-none leading-relaxed"
        placeholder="<div>Paste or write raw HTML here...</div>"
        rows={12}
        spellCheck={false}
      />
    </div>
  );
};
