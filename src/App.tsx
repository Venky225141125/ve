import React, { useState, useRef, useMemo } from 'react';
import {
  Sparkles,
  Sliders,
  Code2,
  FileCode,
  Eye,
  Copy,
  Check,
  Download,
  Terminal,
  Layers,
  Sun,
  Moon,
  Type,
  Palette,
  BookOpen,
  X,
  Package,
  CheckCircle,
} from 'lucide-react';
import {
  RichTextEditor,
  type RichTextEditorRef,
  type RichTextValue,
  type RichTextEditorFeatures,
  type ToolbarConfig,
  type RichTextEditorTheme,
} from 've';
import { SAMPLE_PRESETS } from './data/sampleContent';
import { GuideModal } from './components/GuideModal';

// Theme presets for visual testing
const THEME_PRESETS: Record<string, { name: string; theme: RichTextEditorTheme }> = {
  default: {
    name: 'Modern Slate',
    theme: {
      primaryColor: '#3b82f6',
      primaryHoverColor: '#2563eb',
      borderRadius: '0.75rem',
    },
  },
  emerald: {
    name: 'Emerald Forest',
    theme: {
      primaryColor: '#10b981',
      primaryHoverColor: '#059669',
      borderColor: '#d1fae5',
      toolbarBackground: '#f0fdf4',
      borderRadius: '1rem',
    },
  },
  warm: {
    name: 'Warm Editorial',
    theme: {
      primaryColor: '#d97706',
      primaryHoverColor: '#b45309',
      fontFamily: 'Merriweather, Georgia, serif',
      lineHeight: '1.8',
      borderRadius: '0.5rem',
    },
  },
  rose: {
    name: 'Sunset Rose',
    theme: {
      primaryColor: '#f43f5e',
      primaryHoverColor: '#e11d48',
      borderRadius: '0.875rem',
    },
  },
  minimal: {
    name: 'Monochrome Strict',
    theme: {
      primaryColor: '#0f172a',
      primaryHoverColor: '#334155',
      borderRadius: '0.25rem',
    },
  },
};

// Toolbar presets
const TOOLBAR_PRESETS: Record<string, { name: string; config: ToolbarConfig }> = {
  full: {
    name: 'Full Toolbar (All Features)',
    config: [
      'undo', 'redo', '|',
      'heading', 'fontFamily', 'fontSize', '|',
      'bold', 'italic', 'underline', 'strike', 'code', 'clearFormatting', '|',
      'textColor', 'highlight', '|',
      'align', '|',
      'bulletList', 'orderedList', 'taskList', '|',
      'blockquote', 'codeBlock', 'horizontalRule', '|',
      'link', 'image', 'table', 'youtube', 'emoji', '|',
      'fullscreen', 'sourceCode'
    ],
  },
  standard: {
    name: 'Standard Editor',
    config: [
      'undo', 'redo', '|',
      'heading', '|',
      'bold', 'italic', 'underline', '|',
      'textColor', 'highlight', '|',
      'bulletList', 'orderedList', 'taskList', '|',
      'blockquote', 'link', 'image', 'table', '|',
      'sourceCode'
    ],
  },
  formattingOnly: {
    name: 'Formatting Only',
    config: [
      'bold', 'italic', 'underline', 'strike', 'code', '|',
      'textColor', 'highlight', '|',
      'alignLeft', 'alignCenter', 'alignRight', '|',
      'bulletList', 'orderedList'
    ],
  },
  minimal: {
    name: 'Minimal Clean',
    config: ['bold', 'italic', 'link', '|', 'bulletList', 'orderedList'],
  },
};

export function App() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('showcase');
  const [content, setContent] = useState<string>(SAMPLE_PRESETS[0].html);
  const [richValue, setRichValue] = useState<RichTextValue | null>(null);

  // Editor configuration states
  const [isControlled, setIsControlled] = useState<boolean>(true);
  const [isEditable, setIsEditable] = useState<boolean>(true);
  const [stickyToolbar, setStickyToolbar] = useState<boolean>(true);
  const [bubbleMenu, setBubbleMenu] = useState<boolean>(true);
  const [showStats, setShowStats] = useState<boolean>(true);
  const [maxCharsEnabled, setMaxCharsEnabled] = useState<boolean>(false);
  const [maxChars, setMaxChars] = useState<number>(1000);
  const [selectedThemeKey, setSelectedThemeKey] = useState<string>('default');
  const [selectedToolbarKey, setSelectedToolbarKey] = useState<string>('full');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [activeInspectorTab, setActiveInspectorTab] = useState<'preview' | 'html' | 'json' | 'code' | 'guide'>('html');
  const [copiedState, setCopiedState] = useState<string | null>(null);

  // Feature flags
  const [features, setFeatures] = useState<RichTextEditorFeatures>({
    bold: true,
    italic: true,
    underline: true,
    strike: true,
    code: true,
    headings: true,
    textColor: true,
    highlight: true,
    fontFamily: true,
    fontSize: true,
    textAlign: true,
    bulletList: true,
    orderedList: true,
    taskList: true,
    blockquote: true,
    codeBlock: true,
    tables: true,
    links: true,
    images: true,
    youtube: true,
  });

  const editorRef = useRef<RichTextEditorRef>(null);

  // Handle Preset change
  const handlePresetSelect = (presetId: string) => {
    const found = SAMPLE_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setSelectedPresetId(presetId);
      setContent(found.html);
      if (editorRef.current) {
        editorRef.current.setContent(found.html);
      }
    }
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedState(type);
    setTimeout(() => setCopiedState(null), 2000);
  };

  const handleDownloadHTML = () => {
    const html = editorRef.current?.getHTML() || content;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'document.html';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Mock upload handler demonstrating image upload API
  const handleImageUpload = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Returns base64 or public url
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  // Generate React / Next.js code snippet based on active configuration
  const generatedCode = useMemo(() => {
    const featureLines = Object.entries(features)
      .filter(([_, enabled]) => !enabled)
      .map(([key]) => `    ${key}: false,`)
      .join('\n');

    return `import React, { useState, useRef } from 'react';
import { RichTextEditor, type RichTextEditorRef } from 've';

export default function DocumentEditor() {
  const [content, setContent] = useState(\`<p>Hello World</p>\`);
  const editorRef = useRef<RichTextEditorRef>(null);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <RichTextEditor
        ref={editorRef}
        value={content}
        onChange={setContent}
        editable={${isEditable}}
        stickyToolbar={${stickyToolbar}}
        bubbleMenu={${bubbleMenu}}
        showStats={${showStats}}${maxCharsEnabled ? `\n        maxCharacters={${maxChars}}` : ''}
        theme={${JSON.stringify(THEME_PRESETS[selectedThemeKey].theme, null, 2).replace(/\n/g, '\n        ')}}
        features={{
${featureLines ? featureLines + '\n' : ''}        }}
      />
    </div>
  );
}`;
  }, [
    features,
    isEditable,
    stickyToolbar,
    bubbleMenu,
    showStats,
    maxCharsEnabled,
    maxChars,
    selectedThemeKey,
  ]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors duration-200`}>
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-bold text-sm tracking-wider">
              VE
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                  Rich Text Editor
                </h1>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800">
                  package `ve`
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Modular, production-ready React & Next.js editor library
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Guide & Docs Button */}
            <button
              type="button"
              onClick={() => setIsGuideOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors shadow-2xs"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>VE Guide & Docs</span>
            </button>

            {/* Presets Selector */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 dark:text-slate-400 hidden md:inline">Preset:</span>
              <select
                value={selectedPresetId}
                onChange={(e) => handlePresetSelect(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SAMPLE_PRESETS.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Download Button */}
            <button
              type="button"
              onClick={handleDownloadHTML}
              title="Download HTML"
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Dark / Light Toggle */}
            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor & Output Column */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          {/* Ref API Quick Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium px-1">
              <Terminal className="w-3.5 h-3.5 text-blue-500" />
              <span>Ref Actions:</span>
            </div>

            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => editorRef.current?.focus()}
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              >
                focus()
              </button>
              <button
                type="button"
                onClick={() => editorRef.current?.undo()}
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              >
                undo()
              </button>
              <button
                type="button"
                onClick={() => editorRef.current?.redo()}
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              >
                redo()
              </button>
              <button
                type="button"
                onClick={() => {
                  const val = editorRef.current?.getValue();
                  if (val) {
                    alert(`Word count: ${editorRef.current?.getText().split(/\\s+/).filter(Boolean).length}`);
                  }
                }}
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              >
                getValue()
              </button>
              <button
                type="button"
                onClick={() => editorRef.current?.clearContent()}
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 transition-colors"
              >
                clearContent()
              </button>
            </div>
          </div>

          {/* Core Rich Text Editor Instance */}
          <div className="relative shadow-sm rounded-xl">
            <RichTextEditor
              ref={editorRef}
              value={isControlled ? content : undefined}
              defaultValue={!isControlled ? content : undefined}
              onChange={(newHtml) => {
                setContent(newHtml);
              }}
              onChangeValue={(val) => {
                setRichValue(val);
              }}
              editable={isEditable}
              features={features}
              toolbar={TOOLBAR_PRESETS[selectedToolbarKey].config}
              theme={THEME_PRESETS[selectedThemeKey].theme}
              onImageUpload={handleImageUpload}
              stickyToolbar={stickyToolbar}
              bubbleMenu={bubbleMenu}
              showStats={showStats}
              maxCharacters={maxCharsEnabled ? maxChars : undefined}
              placeholder="Write your story, design specifications, or notes here..."
              className="min-h-[420px]"
            />
          </div>

          {/* Real-time State & Inspector Panel */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
            {/* Inspector Tabs */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 bg-slate-50/70 dark:bg-slate-950/60">
              <div className="flex items-center gap-1 overflow-x-auto py-2">
                <button
                  type="button"
                  onClick={() => setActiveInspectorTab('html')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    activeInspectorTab === 'html'
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Serialized HTML</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveInspectorTab('preview')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    activeInspectorTab === 'preview'
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Rendered Preview</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveInspectorTab('json')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    activeInspectorTab === 'json'
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>ProseMirror AST (JSON)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveInspectorTab('code')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    activeInspectorTab === 'code'
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>React Usage Code</span>
                </button>
              </div>

              <div className="py-2">
                <button
                  type="button"
                  onClick={() => {
                    if (activeInspectorTab === 'html') handleCopy(content, 'html');
                    else if (activeInspectorTab === 'json')
                      handleCopy(JSON.stringify(editorRef.current?.getJSON() || {}, null, 2), 'json');
                    else if (activeInspectorTab === 'code') handleCopy(generatedCode, 'code');
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  {copiedState ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedState ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Inspector Body */}
            <div className="p-4 bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto max-h-[280px]">
              {activeInspectorTab === 'html' && (
                <pre className="text-emerald-400 whitespace-pre-wrap break-all leading-relaxed">
                  {content || '<p></p>'}
                </pre>
              )}

              {activeInspectorTab === 'preview' && (
                <div
                  className="bg-white dark:bg-slate-900 p-4 rounded text-slate-900 dark:text-slate-100 font-sans leading-relaxed ProseMirror"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              )}

              {activeInspectorTab === 'json' && (
                <pre className="text-amber-300 whitespace-pre leading-relaxed">
                  {JSON.stringify(editorRef.current?.getJSON() || richValue?.json || {}, null, 2)}
                </pre>
              )}

              {activeInspectorTab === 'code' && (
                <pre className="text-sky-300 whitespace-pre leading-relaxed">
                  {generatedCode}
                </pre>
              )}
            </div>
          </div>
        </section>

        {/* Configuration Sidebar */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          {/* General Mode & Settings */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
              <Sliders className="w-4 h-4 text-blue-500" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Editor Props & Mode</h2>
            </div>

            <div className="space-y-3 text-xs">
              {/* Controlled vs Uncontrolled */}
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Mode</span>
                <button
                  type="button"
                  onClick={() => setIsControlled(!isControlled)}
                  className={`px-2.5 py-1 rounded-full font-semibold transition-colors ${
                    isControlled
                      ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {isControlled ? 'Controlled (value)' : 'Uncontrolled (defaultValue)'}
                </button>
              </label>

              {/* Editable Mode */}
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Interactivity</span>
                <button
                  type="button"
                  onClick={() => setIsEditable(!isEditable)}
                  className={`px-2.5 py-1 rounded-full font-semibold transition-colors ${
                    isEditable
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                  }`}
                >
                  {isEditable ? 'Editable (true)' : 'Read-Only (false)'}
                </button>
              </label>

              {/* Sticky Toolbar */}
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Sticky Toolbar</span>
                <input
                  type="checkbox"
                  checked={stickyToolbar}
                  onChange={(e) => setStickyToolbar(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
              </label>

              {/* Bubble Menu */}
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Floating Bubble Menu</span>
                <input
                  type="checkbox"
                  checked={bubbleMenu}
                  onChange={(e) => setBubbleMenu(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
              </label>

              {/* Stats Bar */}
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Word / Character Counter</span>
                <input
                  type="checkbox"
                  checked={showStats}
                  onChange={(e) => setShowStats(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
              </label>

              {/* Max Characters Limit */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Limit Max Characters</span>
                  <input
                    type="checkbox"
                    checked={maxCharsEnabled}
                    onChange={(e) => setMaxCharsEnabled(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                </label>
                {maxCharsEnabled && (
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="200"
                      max="3000"
                      step="100"
                      value={maxChars}
                      onChange={(e) => setMaxChars(parseInt(e.target.value, 10))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-500 w-16 text-right">
                      {maxChars} ch
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Theming & Toolbar Presets */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
              <Palette className="w-4 h-4 text-purple-500" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Theme & Toolbar Layout</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1.5">
                  Theme Preset
                </label>
                <select
                  value={selectedThemeKey}
                  onChange={(e) => setSelectedThemeKey(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(THEME_PRESETS).map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1.5">
                  Toolbar Layout Configuration
                </label>
                <select
                  value={selectedToolbarKey}
                  onChange={(e) => setSelectedToolbarKey(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(TOOLBAR_PRESETS).map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Granular Extension / Feature Toggles */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-500" />
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Feature Toggles</h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  const allEnabled = Object.values(features).every(Boolean);
                  const updated: Record<string, boolean> = {};
                  Object.keys(features).forEach((k) => {
                    updated[k] = !allEnabled;
                  });
                  setFeatures(updated as RichTextEditorFeatures);
                }}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Toggle All
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(features).map(([key, val]) => (
                <label
                  key={key}
                  className="flex items-center gap-2 p-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer text-slate-700 dark:text-slate-300"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(val)}
                    onChange={(e) =>
                      setFeatures((prev) => ({
                        ...prev,
                        [key]: e.target.checked,
                      }))
                    }
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                  />
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>
      </main>

      {/* Interactive Library Guide & Documentation Modal */}
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
}

export default App;
