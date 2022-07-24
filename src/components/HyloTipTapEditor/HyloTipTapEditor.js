import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import Iframe from './iframe.ts'
import HyloTipTapEditorMenuBar from './HyloTipTapEditorMenuBar'
// import styles from './HyloTipTapEditor.scss'

import StarterKit from '@tiptap/starter-kit'
import HyloTipTapEditorBottomMenuBar from './HyloTipTapEditorBottomMenuBar'

export const HyloTipTapEditor = React.forwardRef(({
  className,
  placeholder,
  onChange,
  onEscape,
  contentHTML,
  readOnly,
  parentComponent,
  submitOnReturnHandler,
  focusOnRender
}, ref) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Iframe
    ],
    content: contentHTML
  })

  console.log(editor && editor.getHTML())

  return (
    <>
      <HyloTipTapEditorMenuBar editor={editor} />
      <EditorContent editor={editor} />
      <HyloTipTapEditorBottomMenuBar editor={editor} />
    </>
  )
})

export default HyloTipTapEditor
