import { Node } from '@tiptap/core'

// Legacy
// <a data-entity-type="mention" data-user-id="22955" href="/groups/test-community2/members/22955" class="mention">Loren Johnson</a>
// <a data-entity-type="#mention" href="/groups/test-community2/topics/test" data-search="#test" class="hashtag">#test</a>
// <a href="/groups/test-community2/topics/offer" data-search="#offer" class="hashtag">#offer</a>

// Current
// <span data-type="mention" class="mention" data-id="13998" data-label="Edward Test">Edward Test</span>
// <span data-type="topic" class="topic" data-id="13452" data-label="Testcheck">#Testcheck</span>

export const Legacy = Node.create({
  name: 'legacy',
  group: 'inline',
  inline: true,
  selectable: false,
  atom: true,

  parseHTML () {
    return [
      {
        tag: 'a',
        'data-entity-type': 'mention',
        node: 'mention'
      },
      {
        tag: 'a',
        'data-entity-type': 'hashtag',
        node: 'topic'
      },
      {
        tag: 'a',
        class: 'hashtag',
        node: 'topic'
      }
    ]
  },

  addAttributes () {
    return {
      'data-type': {
        parseHTML: element => {
          const dataEntityType = element.getAttribute('data-entity-type')

          if (dataEntityType === '#mention') return 'topic'

          return dataEntityType
        }
      },
      'data-id': {
        parseHTML: element => element.getAttribute('data-user-id') || element.getAttribute('data-search')
      },
      'data-label': {
        parseHTML: element => {
          if (element.getAttribute('data-entity-type') === '#mention') {
            return element.innerText.slice(1)
          }

          return element.innerText
        }
      }
    }
  },

  renderHTML ({ HTMLAttributes }) {
    return [
      'span',
      HTMLAttributes,
      HTMLAttributes['data-label']
    ]
  }
})

export default Legacy
