import React, { useRef, useImperativeHandle, useEffect } from 'react'
import { useEditor, EditorContent, Extension } from '@tiptap/react'
import Placeholder from '@tiptap/extension-placeholder'
import Iframe from './iframe.ts'
import HyloTipTapEditorMenuBar from './HyloTipTapEditorMenuBar'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import './HyloTipTapEditor.scss'

export const HyloTipTapEditor = React.forwardRef(({
  className,
  placeholder,
  onChange,
  onEscape,
  // Should the default be empty or a paragraph?
  contentHTML,
  readOnly,
  submitOnReturnHandler,
  focusOnRender,
  parentComponent
}, ref) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Placeholder.configure({
        placeholder
      }),
      // Rename to iframeExtension?,
      Iframe,
      // // Extract to it's own keyboard shortcuts / Escape Extension
      Extension.create({
        addKeyboardShortcuts () {
          return {
            Escape: () => {
              onEscape()
              // TODO: Maybe should return true here to keep active for other extensions (i.e. Mentions)
              return false
            }
          }
        }
      })
    ],
    onUpdate: ({ editor }) => {
      // Write this to match actual changes... Default content seems to `<p></p>` currently
      onChange(editor.getHTML(), contentHTML !== editor.getHTML())
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
      <HyloTipTapEditorMenuBar editor={editor} />
      <EditorContent className={className} editor={editor} />
    </>
  )
})

export default HyloTipTapEditor
