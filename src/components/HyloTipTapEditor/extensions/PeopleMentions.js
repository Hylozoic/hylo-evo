import Mention from '@tiptap/extension-mention'
import { PluginKey } from 'prosemirror-state'
import asyncDebounce from 'util/asyncDebounce'
import suggestions from './suggestions'
import findMentions from 'store/actions/findMentions'

export const PeopleMentions = ({ dispatch, groupIds, maxSuggestions, onSelection }) =>
  // Mentions (https://github.com/ueberdosis/tiptap/issues/2219#issuecomment-984662243)
  Mention
    .extend({
      name: 'mention',
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

          if (firstTransactionStepName && firstTransactionStepName === 'mention') {
            const attrs = transaction?.steps[0]?.slice?.content?.content[0]?.attrs

            this.storage.onSelection(attrs)
          }
        }
      }
    })
    .configure({
      HTMLAttributes: {
        class: 'mention'
      },
      renderLabel: ({ node }) => {
        return node.attrs.label
      },
      suggestion: {
        char: '@',
        pluginKey: new PluginKey('mentionSuggestion'),
        render: suggestions.render,
        items: asyncDebounce(200, async ({ query, editor }) => {
          editor.extensionStorage.topic.loading = true

          // TODO: Integrate `getPeopleBySearchTerm` selector to reduce queries and speed results
          const matchedPeople = await dispatch(findMentions({
            autocomplete: query,
            groupIds: editor.extensionStorage.mention.groupIds,
            maxItems: maxSuggestions
          }))

          editor.extensionStorage.topic.loading = false

          return matchedPeople?.payload.getData().items
            .map(person => ({ id: person.id, label: person.name, avatarUrl: person.avatarUrl }))
        })
      }
    })

export default PeopleMentions
