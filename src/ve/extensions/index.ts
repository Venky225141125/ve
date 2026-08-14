import type { AnyExtension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import FontFamily from '@tiptap/extension-font-family';
import TextAlign from '@tiptap/extension-text-align';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import Youtube from '@tiptap/extension-youtube';
import CharacterCount from '@tiptap/extension-character-count';
import Placeholder from '@tiptap/extension-placeholder';

import { FontSize } from './fontSize';
import { CustomImage } from './images';
import type { RichTextEditorFeatures } from '../types/features';

export interface CreateExtensionsOptions {
  features?: RichTextEditorFeatures;
  placeholder?: string;
  maxCharacters?: number;
  customExtensions?: AnyExtension[];
}

export function createEditorExtensions(options: CreateExtensionsOptions = {}): AnyExtension[] {
  const {
    features = {},
    placeholder = 'Start writing...',
    maxCharacters,
    customExtensions = []
  } = options;

  const exts: AnyExtension[] = [];

  // Determine Heading Levels
  let headingLevels: (1 | 2 | 3 | 4 | 5 | 6)[] = [1, 2, 3, 4, 5, 6];
  if (typeof features.headings === 'object' && features.headings.levels) {
    headingLevels = features.headings.levels;
  }

  // Base StarterKit with granular feature controls
  exts.push(
    StarterKit.configure({
      bold: features.bold !== false ? {} : false,
      italic: features.italic !== false ? {} : false,
      strike: features.strike !== false ? {} : false,
      code: features.code !== false ? {} : false,
      heading: features.headings !== false ? { levels: headingLevels } : false,
      paragraph: features.paragraph !== false ? {} : false,
      blockquote: features.blockquote !== false ? {} : false,
      codeBlock: features.codeBlock !== false ? {} : false,
      horizontalRule: features.horizontalRule !== false ? {} : false,
      bulletList: features.bulletList !== false ? {} : false,
      orderedList: features.orderedList !== false ? {} : false,
      undoRedo: features.history !== false ? {} : false,
    })
  );

  // Formatting & Typography Marks
  if (features.underline !== false) {
    exts.push(Underline);
  }
  if (features.subscript !== false) {
    exts.push(Subscript);
  }
  if (features.superscript !== false) {
    exts.push(Superscript);
  }

  // TextStyle is prerequisite for Color, FontFamily, FontSize
  if (
    features.textColor !== false ||
    features.fontFamily !== false ||
    features.fontSize !== false
  ) {
    exts.push(TextStyle);
  }

  if (features.textColor !== false) {
    exts.push(Color.configure({ types: ['textStyle'] }));
  }

  if (features.highlight !== false) {
    exts.push(Highlight.configure({ multicolor: true }));
  }

  if (features.fontFamily !== false) {
    exts.push(FontFamily);
  }

  if (features.fontSize !== false) {
    exts.push(FontSize);
  }

  if (features.textAlign !== false) {
    exts.push(
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
        defaultAlignment: 'left',
      })
    );
  }

  // Task Lists
  if (features.taskList !== false) {
    exts.push(
      TaskList,
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'rte-task-item',
        },
      })
    );
  }

  // Links
  if (features.links !== false) {
    const linkConfig = typeof features.links === 'object' ? features.links : {};
    exts.push(
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class: 'rte-link',
          rel: 'noopener noreferrer nofollow',
          target: '_blank',
          ...(linkConfig.HTMLAttributes || {}),
        },
        ...linkConfig,
      })
    );
  }

  // Images
  if (features.images !== false) {
    const imgConfig = typeof features.images === 'object' ? features.images : {};
    exts.push(
      CustomImage.configure({
        inline: false,
        allowBase64: imgConfig.allowBase64 ?? true,
        HTMLAttributes: {
          class: 'rte-image',
          ...(imgConfig.HTMLAttributes || {}),
        },
      })
    );
  }

  // Tables
  if (features.tables !== false) {
    const tableConfig = typeof features.tables === 'object' ? features.tables : {};
    exts.push(
      Table.configure({
        resizable: tableConfig.resizable ?? true,
        HTMLAttributes: {
          class: 'rte-table',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'rte-table-row',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'rte-table-header',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'rte-table-cell',
        },
      })
    );
  }

  // YouTube / Video
  if (features.youtube !== false) {
    const ytConfig = typeof features.youtube === 'object' ? features.youtube : {};
    exts.push(
      Youtube.configure({
        inline: false,
        nocookie: true,
        allowFullscreen: true,
        HTMLAttributes: {
          class: 'rte-youtube-embed',
        },
        ...ytConfig,
      })
    );
  }

  // Placeholder
  if (features.placeholder !== false) {
    const placeholderText =
      typeof features.placeholder === 'string' ? features.placeholder : placeholder;
    exts.push(
      Placeholder.configure({
        placeholder: placeholderText,
        emptyEditorClass: 'is-editor-empty',
      })
    );
  }

  // Character Count — always register so the limit can be updated live
  // without remounting the editor. autoTrim is off so enabling a limit
  // does not silently delete existing document content from the start.
  if (features.characterCount !== false) {
    const featureLimit =
      typeof features.characterCount === 'object' ? features.characterCount.limit : undefined;
    exts.push(
      CharacterCount.configure({
        limit: maxCharacters ?? featureLimit ?? null,
        autoTrim: false,
      })
    );
  }

  // Custom extensions
  if (customExtensions.length > 0) {
    exts.push(...customExtensions);
  }

  return exts;
}

export * from './fontSize';
export * from './images';
