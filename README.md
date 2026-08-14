# VE Rich Text Editor

A drop-in rich text editor for React and Next.js — the same idea as ReactQuill, with a modern Tiptap engine.

```tsx
import { RichTextEditor } from 've-rich-text-editor';
import 've-rich-text-editor/styles.css';

export function App() {
  return (
    <RichTextEditor
      defaultValue="<p>Hello from VE</p>"
      onChange={(html) => console.log(html)}
    />
  );
}
```

## Install

```bash
npm install ve-rich-text-editor
```

`react` and `react-dom` (>= 18) are peer dependencies.

Styles ship with the package. Import them once in your app:

```tsx
import 've-rich-text-editor/styles.css';
```

The component also imports styles from the main entry, so a single `import { RichTextEditor } from 've-rich-text-editor'` is enough in most bundlers.

## Usage

### Controlled (ReactQuill-style)

```tsx
import { useState } from 'react';
import { RichTextEditor } from 've-rich-text-editor';
import 've-rich-text-editor/styles.css';

export default function Editor() {
  const [value, setValue] = useState('<p>Start writing…</p>');

  return <RichTextEditor value={value} onChange={setValue} />;
}
```

### Uncontrolled

```tsx
<RichTextEditor
  defaultValue="<p>Hello</p>"
  onChange={(html) => console.log(html)}
/>
```

### Ref API

```tsx
import { useRef } from 'react';
import { RichTextEditor, type RichTextEditorRef } from 've-rich-text-editor';

const editorRef = useRef<RichTextEditorRef>(null);

editorRef.current?.getHTML();
editorRef.current?.getJSON();
editorRef.current?.getText();
editorRef.current?.setContent('<p>Replaced</p>');
editorRef.current?.clearContent();
editorRef.current?.undo();
editorRef.current?.focus();
```

### Next.js App Router

```tsx
'use client';

import dynamic from 'next/dynamic';
import 've-rich-text-editor/styles.css';

const RichTextEditor = dynamic(
  () => import('ve-rich-text-editor').then((mod) => mod.RichTextEditor),
  { ssr: false }
);

export default function Page() {
  return <RichTextEditor defaultValue="<p>Ready</p>" />;
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — | Controlled HTML |
| `defaultValue` | `string` | `''` | Uncontrolled initial HTML |
| `onChange` | `(html: string) => void` | — | Fires on every edit |
| `onChangeValue` | `(value: { html, json, text }) => void` | — | Structured output |
| `editable` | `boolean` | `true` | Read-only when `false` |
| `placeholder` | `string` | `'Start writing...'` | Empty-state text |
| `features` | `RichTextEditorFeatures` | all on | Toggle headings, tables, images, etc. |
| `toolbar` | `ToolbarConfig \| false` | full toolbar | Custom item list, or hide |
| `theme` | `RichTextEditorTheme` | — | Dynamic colors, fonts, radius (`--rte-*` vars) |
| `style` | `CSSProperties` | — | Instance CSS (height, extra variables). Wins over `theme` |
| `cssVariables` | `Record<string, string>` | — | Extra `--rte-*` (or any) CSS variables |
| `dark` | `boolean` | — | Force dark chrome on this editor |
| `className` | `string` | — | Class on the editor root |
| `onImageUpload` | `(file: File) => Promise<string>` | base64 fallback | Upload handler |
| `maxCharacters` | `number` | — | Character limit |
| `showStats` | `boolean` | `true` | Word / character bar |
| `stickyToolbar` | `boolean` | `true` | Pin toolbar |
| `bubbleMenu` | `boolean` | `true` | Selection formatting bar |

## Custom styles

Pass a `theme` object, `cssVariables`, and/or `style`. Changing them in React state updates the editor immediately (role themes, dark mode, live preview).

```tsx
<RichTextEditor
  value={html}
  onChange={setHtml}
  dark={isDark}
  theme={{
    primaryColor: '#2563eb',      // or '#7c3aed' for client, '#06b6d4' for user
    primaryHoverColor: '#1d4ed8',
    backgroundColor: '#ffffff',
    popoverColor: '#ffffff',
    borderColor: '#e2e8f0',
    textColor: '#0f172a',
    borderRadius: '0.625rem',
  }}
  cssVariables={{
    '--rte-control-hover': '#eff6ff',
  }}
  style={{ minHeight: 280 }}
  className="w-full"
/>
```

Host CSS tokens (`--primary`, `--popover`, `--border`, `--radius`) are picked up automatically if you do not pass `theme`. `style` and `cssVariables` always win over those defaults.

## Local development

```bash
npm install
npm run dev
```

## Build for publishing

```bash
npm run build
npm publish
```

## Repo

- GitHub: https://github.com/Venky225141125/ve

## License

MIT
