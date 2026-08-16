import { Extension } from '@tiptap/core';
import { Plugin, PluginKey, type EditorState, type Transaction } from '@tiptap/pm/state';

declare module '@tiptap/core' {
  interface Storage {
    filterEmoji: {
      enabled: boolean;
    };
  }
}

export function containsEmoji(value: string): boolean {
  return /\p{Extended_Pictographic}/u.test(value);
}

export function stripEmojis(value: string): string {
  return value
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/\uFE0F/g, '')
    .replace(/\u200D/g, '');
}

export function stripEmojiTransaction(state: EditorState): Transaction | null {
  const replacements: Array<{ from: number; to: number; text: string }> = [];

  state.doc.descendants((node, pos) => {
    if (!node.isText || !node.text) return;
    const next = stripEmojis(node.text);
    if (next !== node.text) {
      replacements.push({ from: pos, to: pos + node.nodeSize, text: next });
    }
  });

  if (replacements.length === 0) return null;

  let { tr } = state;
  for (let i = replacements.length - 1; i >= 0; i -= 1) {
    const { from, to, text } = replacements[i];
    tr = tr.insertText(text, from, to);
  }

  return tr.docChanged ? tr : null;
}

function insertCleanedText(
  view: { state: EditorState; dispatch: (tr: Transaction) => void },
  text: string,
  from?: number,
  to?: number
) {
  const cleaned = stripEmojis(text);
  if (!cleaned) return;
  const start = from ?? view.state.selection.from;
  const end = to ?? view.state.selection.to;
  view.dispatch(view.state.tr.insertText(cleaned, start, end));
}

export const FilterEmoji = Extension.create<{ enabled: boolean }>({
  name: 'filterEmoji',

  addOptions() {
    return { enabled: false };
  },

  addStorage() {
    return { enabled: this.options.enabled };
  },

  addProseMirrorPlugins() {
    const getEnabled = () => this.storage.enabled === true;

    return [
      new Plugin({
        key: new PluginKey('filterEmoji'),
        props: {
          handleTextInput: (view, from, to, text) => {
            if (!getEnabled() || !containsEmoji(text)) return false;
            insertCleanedText(view, text, from, to);
            return true;
          },
          handlePaste: () => false,
          handleDrop: (view, event) => {
            if (!getEnabled()) return false;
            const text = event.dataTransfer?.getData('text/plain') ?? '';
            if (!containsEmoji(text)) return false;
            event.preventDefault();
            insertCleanedText(view, text);
            return true;
          },
          transformPastedText: (text) => (getEnabled() ? stripEmojis(text) : text),
          transformPastedHTML: (html) => (getEnabled() ? stripEmojis(html) : html),
          handleDOMEvents: {
            beforeinput: (view, event) => {
              if (!getEnabled()) return false;
              const input = event as InputEvent;
              if (input.isComposing || input.inputType === 'insertCompositionText') {
                return false;
              }
              const data = input.data;
              if (!data || !containsEmoji(data)) return false;
              event.preventDefault();
              insertCleanedText(view, data);
              return true;
            },
            compositionend: (view, event) => {
              if (!getEnabled()) return false;
              const data = (event as CompositionEvent).data;
              if (data && containsEmoji(data)) {
                const transaction = stripEmojiTransaction(view.state);
                if (transaction) view.dispatch(transaction);
              }
              return false;
            },
          },
        },
        appendTransaction: (transactions, _oldState, newState) => {
          if (!getEnabled()) return null;
          if (!transactions.some((transaction) => transaction.docChanged)) return null;
          return stripEmojiTransaction(newState);
        },
      }),
    ];
  },
});
