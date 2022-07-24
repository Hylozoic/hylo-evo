import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
// import styles from './HyloTipTapEditor.scss'

import StarterKit from '@tiptap/starter-kit'

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
      StarterKit
    ],
    content: '<p>Hello World!</p>'
  })

  return (
    <EditorContent editor={editor} />
  )
})

export default HyloTipTapEditor
