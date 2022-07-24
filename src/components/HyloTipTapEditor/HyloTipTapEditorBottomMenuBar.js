import React from 'react'
import {
  RiArrowGoBackLine, RiArrowGoForwardLine, RiFormatClear
} from 'react-icons/ri'
import './HyloTipTapEditor.scss'

export default function HyloTipTapEditorBottomMenuBar ({ editor }) {
  if (!editor) return null

  return (
    <div styleName='bottomMenuBar'>
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
