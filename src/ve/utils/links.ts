/**
 * Safely apply a link mark without interpolating user input into HTML.
 */
export function applyEditorLink(
  editor: { chain: () => any; state: { selection: { empty: boolean } } } | null,
  options: { href: string; target?: string; text?: string }
): boolean {
  if (!editor) return false;

  const { href, target = '_blank', text } = options;

  if (!href) {
    return editor.chain().focus().extendMarkRange('link').unsetLink().run();
  }

  if (text && editor.state.selection.empty) {
    return editor
      .chain()
      .focus()
      .insertContent([
        {
          type: 'text',
          text,
          marks: [{ type: 'link', attrs: { href, target, rel: 'noopener noreferrer nofollow' } }],
        },
      ])
      .run();
  }

  return editor.chain().focus().extendMarkRange('link').setLink({ href, target }).run();
}

export function normalizeHref(raw: string): string {
  const href = raw.trim();
  if (!href) return '';
  if (/^(https?:\/\/|mailto:|tel:|#|\/)/i.test(href)) return href;
  return `https://${href}`;
}
