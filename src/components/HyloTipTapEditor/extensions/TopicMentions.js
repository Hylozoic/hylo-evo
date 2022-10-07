import Mention from '@tiptap/extension-mention'
import { PluginKey } from 'prosemirror-state'
import { uniqBy } from 'lodash/fp'
import asyncDebounce from 'util/asyncDebounce'
import suggestions from './suggestions'
import findTopics from 'store/actions/findTopics'

export const TopicMentions = ({ dispatch, groupIds, maxSuggestions, onSelection }) =>
  Mention
    .extend({
      name: 'topic',
      addStorage () {
        return {
          loading: false,
          groupIds,
          onSelection
        }
      },
      onUpdate ({ transaction }) {
        if (this.storage.onSelection) {
          // Look into `doc.descendents` for possible better or more idiomatic way to get this last node
          const firstTransactionStepName = transaction?.steps[0]?.slice?.content?.content[0]?.type?.name

          if (firstTransactionStepName && firstTransactionStepName === 'topic') {
            const attrs = transaction?.steps[0]?.slice?.content?.content[0]?.attrs
            this.storage.onSelection({ name: attrs.id, id: attrs.id })
          }
        }
      }
    })
    .configure({
      HTMLAttributes: {
        class: 'topic'
      },
      renderLabel: ({ node }) => {
        return node.attrs.label
      },
      suggestion: {
        char: '#',
        pluginKey: new PluginKey('topicSuggestion'),
        render: suggestions.render,
        items: asyncDebounce(200, async ({ query, editor }) => {
          // Note: Will show "No Result" while loading results.
          //       Can be fixed if it is a bad UX.
          editor.extensionStorage.topic.loading = true

          // TODO: Integrate `getTopicsBySearchTerm` selector to reduce queries and speed results
          const matchedTopics = await dispatch(findTopics({
            autocomplete: query,
            maxItems: maxSuggestions
          }))

          editor.extensionStorage.topic.loading = false

          const results = matchedTopics?.payload.getData().items
            .map(t => ({ id: t.topic.name, label: `#${t.topic.name}` }))

          if (query?.trim().length > 2 && results) {
            results.unshift({ id: query, label: `#${query}` })
          }

          editor.extensionStorage.topic.loading = false

          // Re. `uniqBy`: It would be better if the backend didn't send duplicate entries
          return uniqBy('label', results)
        })
      }
    })

export default TopicMentions
