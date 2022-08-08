import { nodeInputRule, mergeAttributes, Node } from '@tiptap/react'
import linkMatcher from 'util/linkMatcher'

// Looks for a least 5 non-whitespace characters that are not in the trigger character
// set of ` !,;`, and appear at the end of the current string terminated by
// one of the trigger set characters. Triggers don't currently include a period.
//
// This is used to keep the amount of linkify matching lower and to extra the trigger
// character
const LINK_AT_END_REGEX = /([^\s!,;]{5,})([ !,;]{1})$/

const LinkNode = Node.create({
  name: 'linkNode',

  group: 'inline',

  inline: true,

  selectable: false,

  atom: true,

  addOptions () {
    return {
      openOnClick: true,
      linkOnPaste: true,
      protocols: [],
      HTMLAttributes: {
        target: '_blank',
        rel: 'noopener noreferrer nofollow',
        class: null
      }
    }
  },

  addAttributes () {
    return {
      href: {
        default: null,
        parseHTML: element => element.getAttribute('href'),
        renderHTML: attributes => {
          if (!attributes.href) return {}
          return { href: attributes.href }
        }
      },
      target: {
        default: this.options.HTMLAttributes.target
      },
      class: {
        default: this.options.HTMLAttributes.class
      },
      label: {
        default: null,
        parseHTML: element => element.innerText,
        renderHTML: null
      }
    }
  },

  parseHTML () {
    return [
      {
        tag: 'a[href]:not([href *= "javascript:" i])'
      }
    ]
  },

  renderHTML ({ HTMLAttributes, ...rest }) {
    const { href } = HTMLAttributes

    return [
      'a',
      mergeAttributes(this.options.HTMLAttributes, { href }),
      HTMLAttributes.label
    ]
  },

  renderText (props) {
    return props.label
  },

  addInputRules () {
    return [
      // createLinkNodeInputRule(this)
      nodeInputRule({
        type: this.type,

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
            ...this.options.HTMLAttributes,
            label: match[1],
            href: currentLink.url
          }
        }
      })
    ]
  },

  allow: ({ state, range }) => {
    const $from = state.doc.resolve(range.from)
    const type = state.schema.nodes[this.name]
    const allow = !!$from.parent.type.contentMatch.matchType(type)

    return allow
  }
})

export default LinkNode
