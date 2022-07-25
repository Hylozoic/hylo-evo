import React, { useRef, useImperativeHandle, useEffect } from 'react'
import { isEmpty } from 'lodash'
import { useEditor, EditorContent, Extension } from '@tiptap/react'
import Placeholder from '@tiptap/extension-placeholder'
import Iframe from './extensions/iframe.ts'
import Mention from '@tiptap/extension-mention'
import suggestion from './extensions/mentions/suggestion'

import HyloTipTapEditorMenuBar from './HyloTipTapEditorMenuBar'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import './HyloTipTapEditor.scss'
import { useDispatch } from 'react-redux'
import { findMentions } from './extensions/mentions/MentionList.store'

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
        suggestion: {
          render: suggestion.render,
          items: async (props) => {
            // Debounce this
            const matchedPeople = await dispatch(findMentions(props.query))
            return matchedPeople?.payload.getData()?.items
          }
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
