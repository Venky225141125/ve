import Image from '@tiptap/extension-image';
import { mergeAttributes } from '@tiptap/core';

export interface CustomImageOptions {
  inline: boolean;
  allowBase64: boolean;
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customImage: {
      setImage: (options: {
        src: string;
        alt?: string;
        title?: string;
        width?: string | number;
        alignment?: 'left' | 'center' | 'right' | 'inline';
        caption?: string;
      }) => ReturnType;
      updateImage: (options: {
        alt?: string;
        title?: string;
        width?: string | number;
        alignment?: 'left' | 'center' | 'right' | 'inline';
        caption?: string;
      }) => ReturnType;
    };
  }
}

function alignmentStyle(align: string): string {
  if (align === 'left') return 'margin-right: auto; margin-left: 0; display: block;';
  if (align === 'right') return 'margin-left: auto; margin-right: 0; display: block;';
  if (align === 'inline') return 'display: inline-block; vertical-align: middle; margin: 0 4px;';
  return 'margin-left: auto; margin-right: auto; display: block;';
}

export const CustomImage = Image.extend<CustomImageOptions>({
  name: 'image',

  addAttributes() {
    return {
      ...this.parent?.(),
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: '100%',
        parseHTML: (element) => element.getAttribute('width') || element.style.maxWidth || '100%',
        renderHTML: (attributes) => {
          if (!attributes.width) return {};
          return { width: String(attributes.width) };
        },
      },
      alignment: {
        default: 'center',
        parseHTML: (element) => element.getAttribute('data-alignment') || 'center',
        renderHTML: (attributes) => ({
          'data-alignment': attributes.alignment || 'center',
        }),
      },
      caption: {
        default: null,
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const alignment = (HTMLAttributes['data-alignment'] as string) || 'center';
    const width = HTMLAttributes.width as string | number | undefined;
    const styles: string[] = [];

    if (HTMLAttributes.style) {
      styles.push(String(HTMLAttributes.style));
    }
    if (width) {
      styles.push(`max-width: ${typeof width === 'number' ? `${width}px` : width}`);
    }
    styles.push(alignmentStyle(alignment));

    return [
      'img',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-alignment': alignment,
        style: styles.filter(Boolean).join('; '),
      }),
    ];
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
      updateImage:
        (options) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, options);
        },
    };
  },
});
