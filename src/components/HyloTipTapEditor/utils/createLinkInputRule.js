import { InputRule, getMarksBetween, callOrReturn } from '@tiptap/react'
import linkMatcher from 'util/linkMatcher'

// Below: Is the sketch how to do this without Linkify,
// which makes the implemenation of the TipTap InputRule
// much more clear, but doesn't produce as good of links.
//
// import urlRegexSafe from 'url-regex-safe'
// export const TRIGGER_CHARACTER_REGEX_STRING = '[\\s!,;]$'
// export const TRIGGER_CHARACTER_REGEX_STRING = '\\S+([ !,;])$'
// export const TRIGGER_CHARACTER_REGEX = new RegExp(TRIGGER_CHARACTER_REGEX_STRING)
// export const LINK_REGEX = new RegExp(
//   `(${urlRegexSafe({ returnString: true })})(${TRIGGER_CHARACTER_REGEX_STRING})`
// )

const LINK_AT_END_REGEX = /([\w|.|@|:|?|//]+)([ !,;])$/

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

export function createLinkInputRule (mark) {
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
