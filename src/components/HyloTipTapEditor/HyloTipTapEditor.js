import React, { useRef, useImperativeHandle, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty, uniqBy } from 'lodash/fp'
// import { lowlight } from 'lowlight/lib/common'
import { useEditor, EditorContent, Extension } from '@tiptap/react'
import { PluginKey } from 'prosemirror-state'
import asyncDebounce from 'util/asyncDebounce'
import getMyGroups from 'store/selectors/getMyGroups'
import findMentions from 'store/actions/findMentions'
import findTopics from 'store/actions/findTopics'
import HyloTipTapEditorMenuBar from './HyloTipTapEditorMenuBar'
// import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Placeholder from '@tiptap/extension-placeholder'
import Iframe from './extensions/Iframe.ts'
import Link from '@tiptap/extension-link'
import Mention from '@tiptap/extension-mention'
import suggestion from './extensions/mentions/suggestion'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import './HyloTipTapEditor.scss'

export const EMPTY_EDITOR_CONTENT_HTML = '<p></p>'

export const HyloTipTapEditor = React.forwardRef(({
  className,
  placeholder,
  onChange,
  onEscape,
  onEnter,
  onAddMention,
  onAddTopic,
  // Should the default be empty or a paragraph?
  contentHTML,
  readOnly,
  hideMenu
}, ref) => {
  const dispatch = useDispatch()
  const myGroups = useSelector(getMyGroups)
  const myGroupIds = myGroups?.map(g => g.id)
  const editor = useEditor({
    extensions: [
      // Key events respond are last extension first, these will be last
      Extension.create({
        addKeyboardShortcuts () {
          return {
            Escape: () => {
              if (!onEscape) return false

              onEscape()

              return true
            },
            Enter: ({ editor }) => {
              if (!onEnter) return false

              onEnter(editor.getHTML())

              return false
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
          // NOTE: When mark is at the end of a block without a trailing space `getText()`
          // runs it into the next block's text. This fixes that, but will result in an
          // extra space in plain text output.
          renderText ({ node }) {
            return this.options.renderLabel({ node, options: this.options }) + ' '
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
            items: asyncDebounce(200, async ({ query }) => {
              const matchedPeople = await dispatch(findMentions({
                autocomplete: query, groupIds: myGroupIds
              }))

              return matchedPeople?.payload.getData().items
                .map(person => ({ id: person.id, label: person.name, avatarUrl: person.avatarUrl }))
            }).bind(this)
          }
        }),

      // Topics
      Mention
        .extend({
          name: 'topic',
          // * See note on `renderText` for mention above
          renderText ({ node }) {
            return this.options.renderLabel({ node, options: this.options }) + ' '
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
            items: asyncDebounce(200, async ({ query }) => {
              // Note: Will show "No Result" while loading results.
              //       Can be fixed if it is a bad UX.
              const matchedTopics = await dispatch(findTopics(query))
              const results = matchedTopics?.payload.getData().items
                .map(t => ({ id: t.topic.id, label: t.topic.name }))

              if (query?.trim().length > 2 && results) {
                results.unshift({ id: query, label: query })
              }

              // Re. `uniqBy`: Backend method should be de-duping these entries.
              return uniqBy('label', results)
            }).bind(this)
          }
        }),

      Link.configure({
        openOnClick: false
        // NOTE: This is needed due to `linkifyjs-hashtag` being included by
        //       `hylo-shared` and it causing TipTap's extension (which uses linkifyjs)
        //       to identify hashtags as links. Can be removed if the linkify situation
        //       changes.
        // validate: href => /^\w/.test(href)
      }),

      // Embed (Video)
      Iframe,

      Highlight
    ],
    onUpdate: ({ editor, transaction }) => {
      // Look into `doc.descendents` for possible better or more idiomatic way to get this last node
      const firstTransactionStepName = transaction?.steps[0]?.slice?.content?.content[0]?.type?.name

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
        ((editor.getHTML() === EMPTY_EDITOR_CONTENT_HTML) && isEmpty(contentHTML))
      ) return

      onChange(editor.getHTML())
    },

    content: contentHTML
  }, [placeholder, contentHTML])

  const editorRef = useRef(null)

  useImperativeHandle(ref, () => ({
    getHTML: () => {
      return editorRef.current.getHTML()
    },
    getText: () => {
      return editorRef.current.getText()
    },
    focus: () => {
      editorRef.current.commands.focus()
    },
    reset: () => {
      editorRef.current.commands.clearContent()
    },
    isEmpty: () => {
      return editorRef.current.isEmpty
    }
  }))

  useEffect(() => {
    if (!editor) return undefined

    editor.setEditable(!readOnly)
  }, [editor, readOnly])

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
//     get('steps[0x].slice.content.content[0].marks', transaction),
//     get('steps', transaction)
//     // transaction.doc.descendants(node => console.log('!!! test', node.marks))
//   )
// }
