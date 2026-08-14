export interface ContentPreset {
  id: string;
  name: string;
  description: string;
  html: string;
}

export const SAMPLE_PRESETS: ContentPreset[] = [
  {
    id: 'showcase',
    name: 'Full Feature Showcase',
    description: 'Demonstrates tables, task lists, code blocks, typography, images, and highlights',
    html: `
<h1>Modular Rich Text Editor for React & Next.js</h1>
<p>Welcome to the <strong>production-ready</strong>, accessible, and extensible rich text editor built on top of <em>Tiptap</em> and <em>ProseMirror</em>.</p>

<blockquote style="text-align: left;">
  "Simplicity is prerequisite for reliability. Build decoupled, modular components that scale effortlessly."
</blockquote>

<h2>Key Architectural Capabilities</h2>
<p>Here is a breakdown of the core engine and its key feature set:</p>

<table style="min-width: 100px">
  <thead>
    <tr>
      <th>Module</th>
      <th>Feature</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>State Engine</strong></td>
      <td>Controlled & Uncontrolled synchronization</td>
      <td>Ready</td>
    </tr>
    <tr>
      <td><strong>SSR & Next.js</strong></td>
      <td>Zero hydration mismatch with immediatelyRender: false</td>
      <td>Compliant</td>
    </tr>
    <tr>
      <td><strong>Theming</strong></td>
      <td>CSS variable-driven styling system</td>
      <td>Customizable</td>
    </tr>
  </tbody>
</table>

<h2>Project Checklist</h2>
<ul data-type="taskList">
  <li data-checked="true"><label><input type="checkbox" checked="checked"><span></span></label><div><p>Design headless state hooks with comprehensive command wrappers</p></div></li>
  <li data-checked="true"><label><input type="checkbox" checked="checked"><span></span></label><div><p>Implement customizable toolbar with dropdowns, popovers, and color pickers</p></div></li>
  <li data-checked="false"><label><input type="checkbox"><span></span></label><div><p>Publish reusable package to npm and share documentation</p></div></li>
</ul>

<h2>Code Highlight Sample</h2>
<pre><code>// Clean usage in any modern React or Next.js app
import { RichTextEditor } from '@your-org/rich-text-editor';

export function NoteEditor() {
  const [content, setContent] = useState('&lt;p&gt;Start drafting...&lt;/p&gt;');
  return &lt;RichTextEditor value={content} onChange={setContent} /&gt;;
}</code></pre>

<p>You can also highlight key ideas with <mark style="background-color: #fef08a; color: #854d0e;">vibrant colored highlights</mark> or adjust text sizes dynamically for maximum visual clarity.</p>
    `.trim(),
  },
  {
    id: 'technical-doc',
    name: 'Technical Architecture Doc',
    description: 'System design specification with tables, code snippets, and callouts',
    html: `
<h1>RFC-104: Client-Side Rich Text Architecture</h1>
<p>This technical design doc outlines the integration guidelines for the rich text editor component across micro-frontends.</p>

<h3>1. Design Goals</h3>
<ul>
  <li>Zero dependency on paid enterprise subscriptions</li>
  <li>Strict TypeScript type-safety across all hooks and command wrappers</li>
  <li>Fast bundle tree-shaking with opt-in feature toggles</li>
</ul>

<h3>2. Props Specification</h3>
<pre><code>interface RichTextEditorProps {
  value?: string;
  defaultValue?: string;
  onChange?: (html: string) => void;
  features?: RichTextEditorFeatures;
  editable?: boolean;
}</code></pre>

<p>For more information, consult the internal engineering guidelines.</p>
    `.trim(),
  },
  {
    id: 'blog-post',
    name: 'Blog Post Draft',
    description: 'Editorial article layout with pull quotes and typography',
    html: `
<h1>The Art of Modern Web Typography</h1>
<p>Great typography in web applications creates visual harmony and reduces cognitive strain for the reader.</p>

<blockquote style="text-align: left;">
  "Good typography begins with appropriate vertical rhythm, disciplined font scales, and crisp contrast."
</blockquote>

<p>When selecting typefaces for long-form content, prioritize high legibility at body sizes (16px+) with line heights between 1.5 and 1.7.</p>
    `.trim(),
  },
  {
    id: 'minimal',
    name: 'Minimal Blank Note',
    description: 'Clean canvas for quick testing',
    html: `<p>Start typing your thoughts here...</p>`,
  },
];
