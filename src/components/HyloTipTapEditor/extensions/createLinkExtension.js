import Link from '@tiptap/extension-link'
import { InputRule, getMarksBetween, callOrReturn, nodeInputRule } from '@tiptap/react'
import linkMatcher from 'util/linkMatcher'

// Looks for a least 5 non-whitespace characters that are not in the trigger character
// set of ` !,;`, and appear at the end of the current string terminated by
// one of the trigger set characters. Triggers don't currently include a period.
//
// This is used to keep the amount of linkify matching lower and to extra the trigger
// character
const LINK_AT_END_REGEX = /([^\s!,;]{5,})([ !,;]{1})$/

export function triggerMarkInputRule (config) {
  return new InputRule({
    find: config.find,
    handler: ({ state, range, match }) => {
      const attributes = callOrReturn(config.getAttributes, undefined, match)

      if (attributes === false || attributes === null) {
        return null
      }

      // e.g. `match` is ["test.com ", "test.com"]
      const fullMatch = match[0]
      const captureGroup = match[1]
      const { tr } = state

      if (captureGroup) {
        const textAfter = LINK_AT_END_REGEX.exec(match[0])[2]
        const startSpaces = fullMatch.search(/\S/)
        const textStart = range.from + fullMatch.indexOf(captureGroup)
        const textEnd = textStart + captureGroup.length
        const excludedMarks = getMarksBetween(range.from, range.to, state.doc)
          .filter(item => {
            const excluded = item.mark.type.excluded

            return excluded.find(type => type === config.type && type !== item.mark.type)
          })
          .filter(item => item.to > textStart)

        if (excludedMarks.length) {
          return null
        }

        if (textEnd < range.to) {
          tr.delete(textEnd, range.to)
        }

        if (textStart > range.from) {
          tr.delete(range.from + startSpaces, textStart)
        }

        const markEnd = range.from + startSpaces + captureGroup.length

        tr.addMark(range.from + startSpaces, markEnd, config.type.create(attributes || {}))
        tr.removeStoredMark(config.type)

        if (textAfter) tr.insertText(textAfter)
      }
    }
  })
}

export function createLinkMarkInputRule (mark) {
  return triggerMarkInputRule({
    type: mark.type,

    find: text => {
      const linkAtEnd = LINK_AT_END_REGEX.exec(text)

      if (
        linkAtEnd &&
        linkMatcher.pretest(linkAtEnd[0]) &&
        linkMatcher.test(linkAtEnd[0])
      ) {
        return { text: linkAtEnd[0], replaceWith: linkAtEnd[1] }
      }
    },

    getAttributes: match => {
      const matchedLinks = linkMatcher.match(match[1])
      const currentLink = matchedLinks[matchedLinks.length - 1]

      return {
        ...mark.options.HTMLAttributes,
        href: currentLink.url
      }
    }
  })
}

export default function createLinkExtenion () {
  return Link
    .extend({
      addInputRules () {
        return [
          createLinkMarkInputRule(this)
        ]
      }
    })
    .configure({
      openOnClick: false,
      autolink: false
    })
}
