import { inputRules, InputRule } from 'prosemirror-inputrules'
import { Extension } from '@tiptap/react'

// ====== Curvenote Editor Store Action Utils
// https://github.com/curvenote/editor/blob/main/packages/editor/src/store/actions/utils.ts
export const TEST_LINK_SPACE =
  /((?:https?:\/\/)(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b(?:[-a-zA-Z0-9@:%_+.~#?&//=]*))([\s!,;])$/
export const TEST_LINK_COMMON_SPACE =
  /((?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.(?:com|ca|space|xyz|org|app|dev|io|net|gov|edu)\b(?:[-a-zA-Z0-9@:%_+.~#?&//=]*))([\s!,;])$/
export const TEST_LINK_COMMON =
  /^[-a-zA-Z0-9@:%._+~#=]{2,256}\.(?:com|ca|space|xyz|org|app|dev|io|net|gov|edu)\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/

const VALID_PROTOCOLS = new Set(['http:', 'https:', 'ftp:'])
export function validateUrl (url) {
  if (url.includes(' ')) return false
  try {
    const valid = new URL(url)
    if (VALID_PROTOCOLS.has(valid.protocol)) return true
    return false
  } catch (e) {
    return false
  }
}

// used by chromium: https://stackoverflow.com/a/46181/5465086
export function validateEmail (url) {
  return String(url)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

export function normalizeUrl (url) {
  const target = url.toLowerCase()
  if (target.startsWith('mailto:')) return url
  if (/^(?:ftp|https?|file):\/\//.test(target)) return url
  // prepend http if no protocol and a common url
  if (TEST_LINK_COMMON.test(url)) return `http://${url}`
  return url
}

// ====== Curvenote Editor Input Utils
// https://github.com/curvenote/editor/blob/main/packages/editor/src/prosemirror/inputrules/utils.ts
// https://discuss.prosemirror.net/t/input-rules-for-wrapping-marks/537/11
export function markInputRule (regexp, markType, options) {
  return new InputRule(regexp, (state, match, start, end) => {
    const { getAttrs, getText, getTextAfter } = options || {}
    const attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs
    const textAfter = getTextAfter instanceof Function ? getTextAfter(match) : getTextAfter
    const { tr } = state
    if (state.doc.rangeHasMark(start, end, markType)) {
      return null
    }
    const mark = markType.create(attrs)
    tr.delete(start, end)
    const text = getText?.(match) || match[1]
    tr.insertText(text)
    tr.addMark(start, start + text.length, mark)
    tr.removeStoredMark(markType)
    if (textAfter) tr.insertText(textAfter)
    return tr
  })
}

const ENDING_PUNCTUATION = /([.;,!])$/
function normalize (match) {
  let url = match[1]
  const punctuation = url.match(ENDING_PUNCTUATION)
  if (punctuation) {
    url = url.replace(ENDING_PUNCTUATION, '')
  }
  if (validateEmail(url)) {
    return { href: `mailto:${url}`, text: url }
  }
  return { href: normalizeUrl(url) }
}
function getLinkText (match) {
  const url = match[1]
  const punctuation = url.match(ENDING_PUNCTUATION)
  if (punctuation) {
    return url.replace(ENDING_PUNCTUATION, '')
  }
  return url
}
function getTextAfter (match) {
  const url = match[1]
  const punctuation = url.match(ENDING_PUNCTUATION)
  return punctuation ? `${punctuation[1]}${match[2]}` : match[2]
}

// Ideally would do this but it seems TipTap InputRules are slightly different than
// ProseMirror's
// Link.extend({
//   addInputRules() {
//     return linkInputRules(this.type)
//   }
// })

export const LinkInputRules = Extension.create({
  name: 'linkInputRules',

  addProseMirrorPlugins () {
    return [
      inputRules({
        rules: [
          markInputRule(TEST_LINK_SPACE, this.editor.schema.marks.link, {
            getAttrs: normalize,
            getText: getLinkText,
            getTextAfter
          }),
          markInputRule(TEST_LINK_COMMON_SPACE, this.editor.schema.marks.link, {
            getAttrs: normalize,
            getText: getLinkText,
            getTextAfter
          })
        ]
      })
    ]
  }
})

export default LinkInputRules
