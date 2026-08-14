import type { Editor, JSONContent } from '@tiptap/core';
import DOMPurify from 'dompurify';
import type { RichTextValue } from '../types/editor';

/**
 * Sanitizes an HTML string using DOMPurify with safe defaults.
 * Essential for preventing XSS attacks when rendering user-generated editor HTML outside the editor.
 */
export function sanitizeHTML(html: string): string {
  if (!html || typeof html !== 'string') return '';
  if (typeof window === 'undefined') {
    return html;
  }
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'strong', 'em', 'u', 's', 'sub', 'sup',
      'blockquote', 'pre', 'code', 'ul', 'ol', 'li', 'input', 'label', 'hr', 'br',
      'a', 'img', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'div',
      'iframe'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'target', 'rel', 'class', 'style',
      'type', 'checked', 'disabled', 'width', 'height', 'frameborder',
      'allow', 'allowfullscreen', 'colspan', 'rowspan', 'colwidth', 'data-type', 'dir'
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    ADD_ATTR: ['target', 'rel'],
  });
}

/**
 * Extracts a structured RichTextValue object from a Tiptap Editor instance.
 */
export function extractRichTextValue(editor: Editor | null): RichTextValue {
  if (!editor) {
    return {
      html: '',
      json: { type: 'doc', content: [] },
      text: ''
    };
  }

  const html = editor.getHTML();
  const json = editor.getJSON();
  const text = editor.getText();

  return {
    html: html === '<p></p>' ? '' : html,
    json,
    text
  };
}

/**
 * Calculates word count from plain text.
 */
export function countWords(text: string): number {
  if (!text || text.trim().length === 0) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Calculates estimated reading time in minutes (based on 200 wpm).
 */
export function calculateReadingTime(text: string): { minutes: number; text: string } {
  const words = countWords(text);
  const minutes = Math.ceil(words / 200);
  return {
    minutes: Math.max(1, minutes),
    text: minutes <= 1 ? '< 1 min read' : `${minutes} min read`
  };
}
