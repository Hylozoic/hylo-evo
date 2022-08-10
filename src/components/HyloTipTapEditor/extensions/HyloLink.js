import { InputRule, getMarksBetween, callOrReturn } from '@tiptap/react'
import Link from '@tiptap/extension-link'
import linkMatcher from 'util/linkMatcher'

// Looks for a least 5 non-whitespace characters that are not in the trigger character
// set of ` !,;`, and appear at the end of the current string terminated by
// one of the trigger set characters. Triggers don't currently include a period.
//
// This is used to keep the amount of linkify matching lower and to extra the trigger
// character
export const LINK_AT_END_REGEX = /([^\s!,;]{5,})([ !,;]{1})$/

export function triggerLinkInputRule (config) {
  return new InputRule({
    find: config.find,
    handler: ({ state, range, match, ...rest }) => {
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
  return triggerLinkInputRule({
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

      this.storage.onAddLink(currentLink.url)

      return {
        ...mark.options.HTMLAttributes,
        href: currentLink.url
      }
    }
  })
}

// Given a cursor position within or at the beginning 'link' marked text
// return the full selection range of the mark
export function linkAround (state, pos) {
  const $pos = state.doc.resolve(pos)

  const { parent, parentOffset } = $pos
  const start = parent.childAfter(parentOffset)

  if (!start.node) return null

  const link = start.node.marks.find((mark) => mark.type === state.schema.marks.link)

  if (!link) return null

  let startIndex = $pos.index()
  let startPos = $pos.start() + start.offset
  let endIndex = startIndex + 1
  let endPos = startPos + start.node.nodeSize

  while (startIndex > 0 && link.isInSet(parent.child(startIndex - 1).marks)) {
    startIndex -= 1
    startPos -= parent.child(startIndex).nodeSize
  }

  while (endIndex < parent.childCount && link.isInSet(parent.child(endIndex).marks)) {
    endPos += parent.child(endIndex).nodeSize
    endIndex += 1
  }

  return { from: startPos, to: endPos }
}

export default function HyloLink ({ onAddLink }) {
  return Link
    .extend({
      addInputRules () {
        return [
          createLinkMarkInputRule.bind(this)(this)
        ]
      },
      addStorage: {
        onAddLink
      },
      addKeyboardShortcuts () {
        return {
          Backspace: ({ editor }) => {
            const { state } = editor.view
            const { tr } = state

            // Check if there is a Link right before $cursor, because backspace is about to go there
            if (tr.selection.$anchor.pos === tr.selection.$head.pos) {
              const beforeSelection = linkAround(state, tr.selection.$anchor.pos - 1)

              if (beforeSelection) tr.removeMark(beforeSelection.from, beforeSelection.to, this.type)
            } else {
              const anchorLinkRange = linkAround(state, tr.selection.$anchor.pos)
              const headLinkRange = linkAround(state, tr.selection.$head.pos)

              if (anchorLinkRange) tr.removeMark(anchorLinkRange.from, anchorLinkRange.to, this.type)
              if (headLinkRange) tr.removeMark(headLinkRange.from, headLinkRange.to, this.type)
            }

            if (tr.steps.length > 0) editor.view.dispatch(tr)

            return false
          }
        }
      }
      // Another option for handling LinkPreview setting would be to make a mouseover pop-up:
      // import { Plugin, PluginKey } from 'prosemirror-state'
      // addProseMirrorPlugins () {
      //   return [
      //     new Plugin({
      //       key: new PluginKey('eventHandler'),
      //       props: {
      //         handleDOMEvents: {
      //           mouseover: (props, event) => {
      //             console.log('!!! props during hover event', props, event.target)
      //           }
      //         }
      //       }
      //     })
      //   ]
      // }
    })
    .configure({
      openOnClick: false,
      autolink: false
    })
}
