import { Extension } from '@tiptap/core'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
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

const FontFamily = Extension.create({
  name: 'fontFamily',
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontFamily: {
            default: null,
            parseHTML: (element) => element.style.fontFamily || null,
            renderHTML: (attributes) => {
              if (!attributes.fontFamily) return {}
              return { style: `font-family: ${attributes.fontFamily}` }
            }
          }
        }
      }
    ]
  }
})

const FontSize = Extension.create({
  name: 'fontSize',
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {}
              return { style: `font-size: ${attributes.fontSize}` }
            }
          }
        }
      }
    ]
  }
})

const LineHeight = Extension.create({
  name: 'lineHeight',
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: (element) => element.style.lineHeight || null,
            renderHTML: (attributes) => {
              if (!attributes.lineHeight) return {}
              return { style: `line-height: ${attributes.lineHeight}` }
            }
          }
        }
      }
    ]
  }
})

const LetterSpacing = Extension.create({
  name: 'letterSpacing',
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          letterSpacing: {
            default: null,
            parseHTML: (element) => element.style.letterSpacing || null,
            renderHTML: (attributes) => {
              if (!attributes.letterSpacing) return {}
              return { style: `letter-spacing: ${attributes.letterSpacing}` }
            }
          }
        }
      }
    ]
  }
})

const TextClass = Extension.create({
  name: 'textClass',
  addGlobalAttributes() {
    return [
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
  }
})

export const tiptapExtensions = [
  StarterKit,
  Underline,
  Strike,
  Subscript,
  Superscript,
  TextStyle,
  Color,
  Highlight,
  FontFamily,
  FontSize,
  LineHeight,
  LetterSpacing,
  TextClass,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Link.configure({ openOnClick: false, autolink: true, protocols: ['http', 'https', 'mailto'] }),
  Image,
  Table.configure({ resizable: true }),
  TableRow,
  TableHeader,
  TableCell,
  HorizontalRule
]
