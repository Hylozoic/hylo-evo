import React from 'react'
import {
  RiArrowGoBackLine, RiArrowGoForwardLine, RiFormatClear
} from 'react-icons/ri'
import classes from './HyloEditor.module.scss'

export default function HyloEditorBottomMenuBar ({ editor }) {
  if (!editor) return null

  return (
    <div className={classes.bottomMenuBar}>
      <button onClick={() => editor.chain().focus().undo().run()}>
        <RiArrowGoBackLine />
      </button>
      <button onClick={() => editor.chain().focus().redo().run()}>
        <RiArrowGoForwardLine />
      </button>
      {/* <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        clear formatting in selection
      </button> */}
      <button onClick={() => editor.chain().focus().clearNodes().run()}>
        <RiFormatClear />
      </button>
    </div>
  )
}
