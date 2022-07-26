import React, { useRef, useImperativeHandle, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty, uniqBy } from 'lodash/fp'
import { useEditor, EditorContent, Extension } from '@tiptap/react'
import { PluginKey } from 'prosemirror-state'
import asyncDebounce from 'util/asyncDebounce'
import getMyGroups from 'store/selectors/getMyGroups'
import findMentions from 'store/actions/findMentions'
import findTopics from 'store/actions/findTopics'
import HyloTipTapEditorMenuBar from './HyloTipTapEditorMenuBar'
import Placeholder from '@tiptap/extension-placeholder'
import Iframe from './extensions/Iframe.ts'
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
      StarterKit,
      Placeholder.configure({
        placeholder
      }),
      // Mentions (https://github.com/ueberdosis/tiptap/issues/2219#issuecomment-984662243)
      Mention
        .extend({
          name: 'mention'
        })
        .configure({
          HTMLAttributes: {
            class: 'mention'
          },
          renderLabel: ({ options, node }) => {
            return node.attrs.label || node.attrs.id
          },
          suggestion: {
            char: '@',
            pluginKey: new PluginKey('mention'),
            render: suggestion.render,
            items: asyncDebounce(200, async ({ query }) => {
              const matchedPeople = await dispatch(findMentions({
                autocomplete: query, groupIds: myGroupIds
              }))

              return matchedPeople?.payload.getData().items
            }).bind(this)
          }
        }),
      // Topics
      Mention
        .extend({
          name: 'topic'
        })
        .configure({
          HTMLAttributes: {
            class: 'topic'
          },
          renderLabel: ({ options, node }) => {
            return `${options.suggestion.char}${node.attrs.label || node.attrs.id}`
          },
          suggestion: {
            char: '#',
            pluginKey: new PluginKey('topic'),
            render: suggestion.render,
            items: asyncDebounce(200, async ({ query }) => {
              const matchedTopics = await dispatch(findTopics(query))
              // TODO: uniqBy-- Backend method should be de-duping these entries
              const results = uniqBy('id', matchedTopics?.payload.getData().items.map(t => t.topic))

              // Add current topic search to suggestions if 2 characters
              // or more and isn't currenlty in result set
              // Note: Will show "No Result" while loading results,
              // which can be easily fixed if it is a bad UX
              if (query?.trim().length > 2 && !results?.find(r => r.name === query)) {
                results.unshift({ id: -1, label: query, name: query })
              }

              return results
            }).bind(this)
          }
        }),
      // Extract to it's own keyboard shortcuts / Escape Extension
      Extension.create({
        addKeyboardShortcuts () {
          return {
            // Check if in Mentions or Topics tippy popup
            Escape: () => {
              if (!onEscape) return false

              onEscape()

              return true
            },
            Enter: ({ editor }) => {
              if (!onEnter) return false

              onEnter(editor.getHTML())

              return true
            }
          }
        }
      }),
      // Embed (Video)
      Iframe,
      Highlight
    ],
    onUpdate: ({ editor, transaction }) => {
      const firstTransactionStepName = transaction?.steps[0]?.slice?.content?.content[0]?.type?.name

      switch (firstTransactionStepName) {
        case 'topic': {
          if (onAddTopic) {
            const attrs = transaction?.steps[0]?.slice?.content?.content[0]?.attrs

            onAddTopic(attrs)
          }
          break
        }
        case 'mention': {
          if (onAddMention) {
            const attrs = transaction?.steps[0]?.slice?.content?.content[0]?.attrs

            onAddMention(attrs)
          }
          break
        }
      }

      if (
        !onChange ||
        (contentHTML === editor.getHTML()) ||
        ((editor.getHTML() === EMPTY_EDITOR_CONTENT_HTML) && isEmpty(contentHTML))
      ) return

      onChange(editor.getHTML())
    },
    // parseOptions: { preserveWhitespace: true },
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
