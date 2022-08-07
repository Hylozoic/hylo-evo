import urlRegexSafe from 'url-regex-safe'
import { inputRules, InputRule } from 'prosemirror-inputrules'
import { Extension } from '@tiptap/react'

// Input rule requires the final character be one of these trigger characters:
export const TRIGGER_CHARACTER_REGEX_STRING = '([\\s!,;])$'
export const TRIGGER_CHARACTER_REGEX = new RegExp(TRIGGER_CHARACTER_REGEX_STRING)
export const LINK_REGEX = new RegExp(
  `${urlRegexSafe({ returnString: true })}${TRIGGER_CHARACTER_REGEX_STRING}`
)
// ====== Curvenote Editor Store Action Utils
// https://github.com/curvenote/editor/blob/main/packages/editor/src/store/actions/utils.ts
// export const TEST_LINK_SPACE =
//   /((?:https?:\/\/)(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b(?:[-a-zA-Z0-9@:%_+.~#?&//=]*))([\s!,;])$/
// export const TEST_LINK_COMMON_SPACE =
//   /((?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.(?:com|ca|space|xyz|org|app|dev|io|net|gov|edu)\b(?:[-a-zA-Z0-9@:%_+.~#?&//=]*))([\s!,;])$/
export const TEST_LINK_COMMON =
  /^[-a-zA-Z0-9@:%._+~#=]{2,256}\.(?:com|ca|space|xyz|org|app|dev|io|net|gov|edu)\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/

// used by chromium: https://stackoverflow.com/a/46181/5465086
export function validateEmail (url) {
  return String(url)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

function normalizeUrl (url) {
  const target = url.toLowerCase()

  if (target.startsWith('mailto:')) return url
  if (/^(?:ftp|https?|file):\/\//.test(target)) return url
  // prepend http if no protocol and a common url
  if (TEST_LINK_COMMON.test(url)) return `http://${url}`

  return url
}

export function getAttrs (match) {
  let url = match[0]

  const punctuation = url.match(TRIGGER_CHARACTER_REGEX)

  if (punctuation) {
    url = url.replace(TRIGGER_CHARACTER_REGEX, '')
  }

  if (validateEmail(url)) {
    return { href: `mailto:${url}`, text: url }
  }

  return { href: normalizeUrl(url) }
}

export function getText (match) {
  const url = match[0]
  const punctuation = url.match(TRIGGER_CHARACTER_REGEX)

  if (punctuation) {
    return url.replace(TRIGGER_CHARACTER_REGEX, '')
  }

  return url
}

export function getTextAfter (match) {
  const url = match[0]
  const punctuation = url.match(TRIGGER_CHARACTER_REGEX)

  return punctuation ? punctuation[0] : ''
}


// ====== Curvenote Editor Input Utils
// https://github.com/curvenote/editor/blob/main/packages/editor/src/prosemirror/inputrules/utils.ts
// https://discuss.prosemirror.net/t/input-rules-for-wrapping-marks/537/11
export function proseMirrorMarkInputRule (regexp, markType, options) {
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

    const text = getText?.(match) || match[0]

    tr.insertText(text)
    tr.addMark(start, start + text.length, mark)
    tr.removeStoredMark(markType)

    if (textAfter) tr.insertText(textAfter)

    return tr
  })
}

// TODO: This should be also possible, but need to reconcile slight difference
// between a TipTap InputRule and ProseMirror's:
// Link.extend({
//   addInputRules() {
//     return [
//       markInputRule({
//         find: LINK_REGEX,
//         type: this.type
//       })
//     ]
//   }
// })
export const LinkInputRules = Extension.create({
  name: 'LinkInputRules',

  addProseMirrorPlugins () {
    return [
      inputRules({
        rules: [
          proseMirrorMarkInputRule(LINK_REGEX, this.editor.schema.marks.link, {
            getAttrs,
            getText,
            getTextAfter
          })
        ]
      })
    ]
  }
})

export default LinkInputRules
