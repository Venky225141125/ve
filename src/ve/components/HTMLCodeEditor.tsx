import React, { useEffect, useState } from 'react';
import { Copy, Check, Code, ArrowRightLeft } from 'lucide-react';

export interface HTMLCodeEditorProps {
  html: string;
  onChange: (newHtml: string) => void;
  onClose: () => void;
}

export const HTMLCodeEditor: React.FC<HTMLCodeEditorProps> = ({ html, onChange, onClose }) => {
  const [content, setContent] = useState(html);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setContent(html);
  }, [html]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    onChange(content);
    onClose();
  };

  return (
    <div className="rte-source">
      <div className="rte-source-bar">
        <div>
          <Code size={16} /> HTML Source Code View
        </div>
        <div className="rte-actions">
          <button type="button" onClick={handleCopy} className="rte-btn-ghost">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy HTML'}
          </button>
          <button type="button" onClick={handleApply} className="rte-btn-primary">
            <ArrowRightLeft size={14} />
            Apply & Return to Visual Editor
          </button>
        </div>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="<p>Paste or write raw HTML here...</p>"
        rows={12}
        spellCheck={false}
      />
    </div>
  );
};
