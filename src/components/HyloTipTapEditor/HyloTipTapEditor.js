import React, { useRef, useImperativeHandle, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { isEmpty, uniqBy } from 'lodash/fp'
// import { lowlight } from 'lowlight/lib/common'
import { useEditor, EditorContent, Extension } from '@tiptap/react'
import { PluginKey } from 'prosemirror-state'
import asyncDebounce from 'util/asyncDebounce'
import findMentions from 'store/actions/findMentions'
import findTopics from 'store/actions/findTopics'
import HyloTipTapEditorMenuBar from './HyloTipTapEditorMenuBar'
// import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Placeholder from '@tiptap/extension-placeholder'
import Iframe from './extensions/Iframe'
import Link from '@tiptap/extension-link'
import Mention from '@tiptap/extension-mention'
import suggestion from './extensions/mentions/suggestion'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import './HyloTipTapEditor.scss'

export const HyloTipTapEditor = React.forwardRef(({
  className,
  placeholder,
  onChange,
  onBeforeCreate = () => {},
  onEnter,
  onAddMention,
  onAddTopic,
  contentHTML,
  readOnly,
  hideMenu,
  // Mention suggestions will use this to filter if provided
  groupIds
}, ref) => {
  const dispatch = useDispatch()
  const editorRef = useRef(null)
  const editor = useEditor({
    content: contentHTML,

    onBeforeCreate,

    onUpdate: ({ editor, transaction }) => {
      // Look into `doc.descendents` for possible better or more idiomatic way to get this last node
      const firstTransactionStepName = transaction?.steps[0]?.slice?.content?.content[0]?.type?.name
      console.log('!!! editor.schema', editor.getText())

      if (firstTransactionStepName) {
        const attrs = transaction?.steps[0]?.slice?.content?.content[0]?.attrs

        // Maybe move these to onUpdate for each respective plugin?
        switch (firstTransactionStepName) {
          case 'topic': {
            if (onAddTopic) onAddTopic({ id: attrs.id, name: attrs.label })
            break
          }
          case 'mention': {
            if (onAddMention) onAddMention(attrs)
            break
          }
        }
      }

      if (
        !onChange ||
        (contentHTML === editor.getHTML()) ||
        (editor.isEmpty && isEmpty(contentHTML))
      ) return

      onChange(editor.getHTML())
    },

    extensions: [
      // Key events respond are last extension first, these will be last
      Extension.create({
        addKeyboardShortcuts () {
          return {
            Enter: ({ editor }) => {
              if (!onEnter) return false
              return onEnter(editor.getHTML())
            }
          }
        }
      }),

      // CodeBlockLowlight.configure({ lowlight }),

      StarterKit.configure({
        // codeBlock: false,
        heading: {
          levels: [1, 2, 3]
        }
      }),

      Placeholder.configure({ placeholder }),

      // Mentions (https://github.com/ueberdosis/tiptap/issues/2219#issuecomment-984662243)
      Mention
        .extend({
          name: 'mention',
          addStorage () {
            return {
              loading: false,
              groupIds
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
            render: suggestion.render,
            items: asyncDebounce(200, async ({ query, editor }) => {
              editor.extensionStorage.topic.loading = true

              const matchedPeople = await dispatch(findMentions({
                autocomplete: query,
                groupIds: editor.extensionStorage.mention.groupIds
              }))

              editor.extensionStorage.topic.loading = false
              return matchedPeople?.payload.getData().items
                .map(person => ({ id: person.id, label: person.name, avatarUrl: person.avatarUrl }))
            })
          }
        }),

      // Topics
      Mention
        .extend({
          name: 'topic',
          addStorage () {
            return {
              loading: false
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
            render: suggestion.render,
            items: asyncDebounce(200, async ({ query, editor }) => {
              // Note: Will show "No Result" while loading results.
              //       Can be fixed if it is a bad UX.
              editor.extensionStorage.topic.loading = true
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
        }),

      Link.configure({
        openOnClick: false
        // NOTE: This was needed due to `linkifyjs-hashtag` being included by
        //       `hylo-shared` and it causing TipTap's extension (which uses linkifyjs)
        //       to identify hashtags as links. Can be removed if the linkify situation
        //       changes. Linkify Hashtag extension has now been removed.
        // validate: href => /^\w/.test(href)
      }),

      // Embed (Video)
      Iframe,

      Highlight
    ]
  }, [placeholder, contentHTML])

  useImperativeHandle(ref, () => ({
    focus: () => {
      editorRef.current.commands.focus()
    },
    getHTML: () => {
      return editorRef.current.getHTML()
    },
    getText: () => {
      return editorRef.current.getText()
    },
    isEmpty: () => {
      return editorRef.current.isEmpty
    },
    reset: () => {
      editorRef.current.commands.clearContent()
    },
    setContent: content => {
      editorRef.current.commands.setContent(content)
    }
  }))

  useEffect(() => {
    if (!editor) return
    if (groupIds) editor.extensionStorage.mention.groupIds = groupIds
    editor.setEditable(!readOnly)
  }, [editor, groupIds, readOnly])

  if (!editor) return null

  editorRef.current = editor

  return (
    <>
      {!hideMenu && (
        <HyloTipTapEditorMenuBar editor={editor} />
      )}
      <EditorContent className={className} editor={editor} />
    </>
  )
})

export default HyloTipTapEditor

// WORKING NOTES: Accessing tiptap/prosemirror transaction content state
// onUpdate ({ editor, transaction }) {
//   console.log(
//     '!!! in onUpdate for Mention Topic plug - transaction',
//     // transaction
//     get('steps[0].slice.content.content[0].marks', transaction),
//     get('steps', transaction)
//     // transaction.doc.descendants(node => console.log('!!! test', node.marks))
//   )
// }
