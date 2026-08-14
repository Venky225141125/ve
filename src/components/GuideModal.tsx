import React, { useState } from 'react';
import {
  X,
  Package,
  Terminal,
  BookOpen,
  Copy,
  Check,
  Code2,
  Layers,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'quickstart' | 'nextjs' | 'hook' | 'theme' | 'testing'>('quickstart');

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const SNIPPETS = {
    install: `npm install ve
# peer: react and react-dom >= 18`,
    quickstart: `import React, { useState, useRef } from 'react';
import { RichTextEditor, type RichTextEditorRef } from 've';
import 've/styles.css';

export function MyEditor() {
  const [content, setContent] = useState('<p>Welcome to <strong>VE</strong>!</p>');
  const editorRef = useRef<RichTextEditorRef>(null);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <RichTextEditor
        ref={editorRef}
        value={content}
        onChange={setContent}
        placeholder="Write something brilliant..."
        stickyToolbar={true}
        bubbleMenu={true}
        showStats={true}
      />
    </div>
  );
}`,
    nextjs: `// In Next.js App Router (app/editor/page.tsx)
'use client';

import dynamic from 'next/dynamic';
import 've/styles.css';

const RichTextEditor = dynamic(
  () => import('ve').then((mod) => mod.RichTextEditor),
  { ssr: false, loading: () => <div>Loading editor…</div> }
);

export default function Page() {
  return (
    <main>
      <RichTextEditor defaultValue="<h1>Next.js + VE</h1><p>Ready to edit!</p>" />
    </main>
  );
}`,
    hookUsage: `import React from 'react';
import { useRichTextEditor, EditorToolbar } from 've';
import 've/styles.css';

export function HeadlessEditor() {
  const { editor, getHTML, characterCount, wordCount } = useRichTextEditor({
    defaultValue: '<p>Headless control</p>',
    onChange: (html) => console.log('Updated:', html),
  });

  return (
    <div>
      <EditorToolbar editor={editor} />
      <div className="border p-4 my-2" />
      <p className="text-xs text-slate-500">{wordCount} words | {characterCount} chars</p>
    </div>
  );
}`,
    customTheme: `import { RichTextEditor, type RichTextEditorTheme } from 've';

const customTheme: RichTextEditorTheme = {
  primaryColor: '#8b5cf6',
  primaryHoverColor: '#7c3aed',
  activeBackground: '#f5f3ff',
  borderColor: '#e9d5ff',
  fontFamily: 'Inter, system-ui, sans-serif',
  borderRadius: '0.75rem',
};

<RichTextEditor theme={customTheme} />`,
    testing: `# Run TypeScript linting & type checks
npm run lint

# Run production build validation
npm run build

# Run local development server with HMR
npm run dev`
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ve-guide-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20">
              VE
            </div>
            <div>
              <h2 id="ve-guide-title" className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                VE Rich Text Editor Library Guide
                <span className="text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  v1.0.0 Ready
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Architecture, reusability as <code className="text-blue-600 dark:text-blue-400">package ve</code>, testing & integration guide
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close guide"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('quickstart')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'quickstart'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Quickstart
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('nextjs')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'nextjs'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            Next.js & SSR
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('hook')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'hook'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Headless Hook
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('theme')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'theme'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Theming & Styling
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('testing')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'testing'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Testing & Verification
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 dark:text-slate-300">
          {/* Top Folder Structure Summary */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-500" />
              VE Library Folder Layout (<code>/src/ve/</code>)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-blue-600 dark:text-blue-400">ve/components</span>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Toolbar, modals, stats, source code editor, bubble menu</p>
              </div>
              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">ve/hooks</span>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">useRichTextEditor, useEditorCommands</p>
              </div>
              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-purple-600 dark:text-purple-400">ve/extensions</span>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Custom Image, FontSize, CodeBlock, Tables, YouTube</p>
              </div>
              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-amber-600 dark:text-amber-400">ve/utils & types</span>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Full TS interfaces, HTML serialization, theme engine</p>
              </div>
            </div>
          </div>

          {activeTab === 'quickstart' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                  1. How to import & use
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  Use either the <code className="text-blue-600 dark:text-blue-400 font-mono">ve</code> package entry point or the <code className="text-blue-600 dark:text-blue-400 font-mono">@ve</code> alias:
                </p>
                <div className="relative">
                  <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                    <code>{SNIPPETS.quickstart}</code>
                  </pre>
                  <button
                    type="button"
                    onClick={() => handleCopy(SNIPPETS.quickstart, 'quickstart')}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="Copy code"
                  >
                    {copiedKey === 'quickstart' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-xs">
                  <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white">Full Ref API</span>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">getHTML, getJSON, getText, setContent, clearContent, focus, undo, redo</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 text-xs">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white">Controlled & Uncontrolled</span>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">Supports standard value/onChange and defaultValue</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/60 text-xs">
                  <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white">Modular Extensions</span>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">Enable or disable any feature with a single boolean flag</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'nextjs' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                  Next.js App Router & Pages Router Integration
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  VE is configured with <code className="text-blue-600 dark:text-blue-400 font-mono">immediatelyRender: false</code> to prevent SSR hydration mismatches. For clean dynamic loading:
                </p>
                <div className="relative">
                  <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                    <code>{SNIPPETS.nextjs}</code>
                  </pre>
                  <button
                    type="button"
                    onClick={() => handleCopy(SNIPPETS.nextjs, 'nextjs')}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    {copiedKey === 'nextjs' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hook' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                  Headless Architecture with <code>useRichTextEditor</code>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  Need a custom UI without the default container? Use the headless hook:
                </p>
                <div className="relative">
                  <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                    <code>{SNIPPETS.hookUsage}</code>
                  </pre>
                  <button
                    type="button"
                    onClick={() => handleCopy(SNIPPETS.hookUsage, 'hook')}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    {copiedKey === 'hook' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                  Theme Customization Engine
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  Pass any theme object. VE automatically binds CSS custom variables (<code>--rte-primary</code>, <code>--rte-radius</code>, etc.):
                </p>
                <div className="relative">
                  <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                    <code>{SNIPPETS.customTheme}</code>
                  </pre>
                  <button
                    type="button"
                    onClick={() => handleCopy(SNIPPETS.customTheme, 'theme')}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    {copiedKey === 'theme' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'testing' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                  Testing, Type Checks & Verification
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  Standard terminal commands to verify the library and build artifacts:
                </p>
                <div className="relative">
                  <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                    <code>{SNIPPETS.testing}</code>
                  </pre>
                  <button
                    type="button"
                    onClick={() => handleCopy(SNIPPETS.testing, 'testing')}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    {copiedKey === 'testing' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Exported from <code>src/ve/index.ts</code>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
          >
            Got it, Back to Playground
          </button>
        </div>
      </div>
    </div>
  );
};
