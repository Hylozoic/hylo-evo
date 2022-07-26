import React, { useRef, useImperativeHandle, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash/fp'
import { useEditor, EditorContent, Extension } from '@tiptap/react'
import asyncDebounce from 'util/asyncDebounce'
import getMyGroups from 'store/selectors/getMyGroups'
import { findMentions } from './extensions/mentions/MentionList.store'
import HyloTipTapEditorMenuBar from './HyloTipTapEditorMenuBar'
import Placeholder from '@tiptap/extension-placeholder'
import Iframe from './extensions/iframe.ts'
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
      Highlight,
      Placeholder.configure({
        placeholder
      }),
      // Rename to iframeExtension?,
      Iframe,
      Mention.configure({
        HTMLAttributes: {
          class: 'mention'
        },
        renderLabel: ({ options, node }) => {
          return node.attrs.label || node.attrs.id
        },
        suggestion: {
          render: suggestion.render,
          items: asyncDebounce(200, async (props) => {
            const matchedPeople = await dispatch(findMentions({
              autocomplete: props.query, groupIds: myGroupIds
            }))

            return matchedPeople?.payload.getData().items
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
      })
    ],
    onUpdate: ({ editor }) => {
      if (!onChange) return

      if (
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
