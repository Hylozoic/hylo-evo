import Mention from '@tiptap/extension-mention'
import { PluginKey } from 'prosemirror-state'
import { uniqBy } from 'lodash/fp'
import asyncDebounce from 'util/asyncDebounce'
import suggestions from './suggestions'
import findTopics from 'store/actions/findTopics'

export const TopicMentions = ({ dispatch, groupIds }) =>
  Mention
    .extend({
      name: 'topic',
      addStorage () {
        return {
          loading: false,
          groupIds
        }
      }
    })
    .configure({
      HTMLAttributes: {
        class: 'topic'
      },
      renderLabel: ({ options, node }) => {
        return `${options.suggestion.char}${node.attrs.label}`
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
          const matchedTopics = await dispatch(findTopics(query))

          editor.extensionStorage.topic.loading = false

          const results = matchedTopics?.payload.getData().items
            .map(t => ({ id: t.topic.id, label: t.topic.name }))

          if (query?.trim().length > 2 && results) {
            results.unshift({ id: query, label: query })
          }

          editor.extensionStorage.topic.loading = false

          // Re. `uniqBy`: It would be better if the backend didn't send duplicate entries
          return uniqBy('label', results)
        })
      }
    })

export default TopicMentions
