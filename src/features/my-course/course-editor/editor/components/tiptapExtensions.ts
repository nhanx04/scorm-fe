import { Extension, Node, mergeAttributes } from '@tiptap/core'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Strike from '@tiptap/extension-strike'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import { Table } from '@tiptap/extension-table'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableRow } from '@tiptap/extension-table-row'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'

export function extractYoutubeId(url: string) {
  const trimmed = url.trim()
  const watch = trimmed.match(/[?&]v=([A-Za-z0-9_-]{6,})/)
  if (watch?.[1]) return watch[1]
  const short = trimmed.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/)
  if (short?.[1]) return short[1]
  const embed = trimmed.match(/youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/)
  return embed?.[1] ?? null
}

export function toYoutubeEmbedUrl(url: string) {
  const id = extractYoutubeId(url)
  return id ? `https://www.youtube.com/embed/${id}` : null
}

const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: 400,
        parseHTML: (element) => element.getAttribute('width') || 400,
        renderHTML: (attributes) => ({ width: attributes.width })
      }
    }
  },
  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(HTMLAttributes, { style: 'max-width:100%;height:auto;border-radius:12px;' })]
  }
})

const YouTubeEmbed = Node.create({
  name: 'youtubeEmbed',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,
  addAttributes() {
    return {
      src: { default: null },
      width: { default: 560 },
      height: { default: 315 }
    }
  },
  parseHTML() {
    return [{ tag: 'iframe[src*="youtube.com/embed/"]' }]
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'iframe',
      mergeAttributes(HTMLAttributes, {
        frameborder: '0',
        allowfullscreen: 'true',
        allow: 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture',
        style: 'max-width:100%;border-radius:12px;'
      })
    ]
  }
})

const FontFamily = Extension.create({
  name: 'fontFamily',
  addGlobalAttributes: () => [
    {
      types: ['textStyle'],
      attributes: {
        fontFamily: {
          default: null,
          parseHTML: (element) => element.style.fontFamily || null,
          renderHTML: (attributes) => (!attributes.fontFamily ? {} : { style: `font-family: ${attributes.fontFamily}` })
        }
      }
    }
  ]
})
const FontSize = Extension.create({
  name: 'fontSize',
  addGlobalAttributes: () => [
    {
      types: ['textStyle'],
      attributes: {
        fontSize: {
          default: null,
          parseHTML: (element) => element.style.fontSize || null,
          renderHTML: (attributes) => (!attributes.fontSize ? {} : { style: `font-size: ${attributes.fontSize}` })
        }
      }
    }
  ]
})
const LineHeight = Extension.create({
  name: 'lineHeight',
  addGlobalAttributes: () => [
    {
      types: ['textStyle'],
      attributes: {
        lineHeight: {
          default: null,
          parseHTML: (element) => element.style.lineHeight || null,
          renderHTML: (attributes) => (!attributes.lineHeight ? {} : { style: `line-height: ${attributes.lineHeight}` })
        }
      }
    }
  ]
})
const LetterSpacing = Extension.create({
  name: 'letterSpacing',
  addGlobalAttributes: () => [
    {
      types: ['textStyle'],
      attributes: {
        letterSpacing: {
          default: null,
          parseHTML: (element) => element.style.letterSpacing || null,
          renderHTML: (attributes) =>
            !attributes.letterSpacing ? {} : { style: `letter-spacing: ${attributes.letterSpacing}` }
        }
      }
    }
  ]
})
const TextClass = Extension.create({
  name: 'textClass',
  addGlobalAttributes: () => [
    {
      types: ['textStyle'],
      attributes: {
        class: {
          default: null,
          parseHTML: (element) => element.getAttribute('class'),
          renderHTML: (attributes) => (attributes.class ? { class: attributes.class } : {})
        }
      }
    }
  ]
})

export const tiptapExtensions = (placeholder = 'Type here...') => [
  StarterKit,
  Underline,
  Strike,
  Subscript,
  Superscript,
  TextStyle,
  Color,
  Highlight,
  Placeholder.configure({ placeholder }),
  FontFamily,
  FontSize,
  LineHeight,
  LetterSpacing,
  TextClass,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Link.configure({ openOnClick: false, autolink: true, protocols: ['http', 'https', 'mailto'] }),
  ResizableImage,
  YouTubeEmbed,
  Table.configure({ resizable: true }),
  TableRow,
  TableHeader,
  TableCell,
  HorizontalRule
]
