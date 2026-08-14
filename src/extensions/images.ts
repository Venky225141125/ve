import Image from '@tiptap/extension-image';
import { mergeAttributes } from '@tiptap/core';

export interface CustomImageOptions {
  inline: boolean;
  allowBase64: boolean;
  HTMLAttributes: Record<string, any>;
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
        renderHTML: (attributes) => {
          if (!attributes.width) return {};
          return {
            width: attributes.width,
            style: `max-width: ${typeof attributes.width === 'number' ? `${attributes.width}px` : attributes.width};`,
          };
        },
      },
      alignment: {
        default: 'center',
        renderHTML: (attributes) => {
          const align = attributes.alignment || 'center';
          let alignStyle = 'margin-left: auto; margin-right: auto; display: block;';
          if (align === 'left') {
            alignStyle = 'margin-right: auto; margin-left: 0; display: block;';
          } else if (align === 'right') {
            alignStyle = 'margin-left: auto; margin-right: 0; display: block;';
          } else if (align === 'inline') {
            alignStyle = 'display: inline-block; vertical-align: middle; margin: 0 4px;';
          }
          return {
            'data-alignment': align,
            style: alignStyle,
          };
        },
      },
      caption: {
        default: null,
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
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
