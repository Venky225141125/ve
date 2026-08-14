# VE Rich Text Editor

A reusable, production-ready rich text editor for React apps, built with Tiptap and designed to work as a component package for both web apps and Next.js projects.

## Features

- Modular editor architecture
- Rich text formatting tools
- Links, images, tables, YouTube embeds, and task lists
- Custom toolbar configuration
- Theme customization
- Controlled or uncontrolled usage
- Ref-based editor API for programmatic control
- Reusable exports for components, hooks, utils, extensions, and types

## Install

```bash
npm install ve
```

## Basic usage

```tsx
import React, { useRef } from 'react';
import { RichTextEditor, type RichTextEditorRef } from 've';

export default function Example() {
  const editorRef = useRef<RichTextEditorRef>(null);

  return (
    <RichTextEditor
      ref={editorRef}
      defaultValue="<p>Hello from VE</p>"
      onChange={(html) => console.log('Updated:', html)}
      placeholder="Write something amazing..."
    />
  );
}
```

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
