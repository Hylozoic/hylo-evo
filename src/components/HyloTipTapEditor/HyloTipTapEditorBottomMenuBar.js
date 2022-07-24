import React from 'react'
// import styles from './HyloTipTapEditor.scss'

export default function HyloTipTapEditorBottomMenuBar ({ editor }) {
  if (!editor) return null

  return (
    <>
      <button onClick={() => editor.chain().focus().undo().run()}>
        undo
      </button>
      <button onClick={() => editor.chain().focus().redo().run()}>
        redo
      </button>
      <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        clear formatting in selection
      </button>
      <button onClick={() => editor.chain().focus().clearNodes().run()}>
        clear all formatting
      </button>
    </>
  )
}
