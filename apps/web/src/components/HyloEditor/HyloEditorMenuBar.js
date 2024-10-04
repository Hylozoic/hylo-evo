import React from 'react'
import cx from 'classnames'
import {
  RiBold, RiItalic, RiCodeBoxLine, RiStrikethrough,
  // RiH1, RiH2, RiH3,
  RiListUnordered, RiListOrdered,
  RiIndentIncrease, RiCodeView,
  RiArrowGoBackLine, RiArrowGoForwardLine, RiFormatClear
} from 'react-icons/ri'
// import { VscPreview } from 'react-icons/vsc'
import classes from './HyloEditor.module.scss'

// export function addIframe (editor) {
//   const url = window.prompt('URL of video or content to embed')

//   if (url) {
//     editor.chain().focus().setIframe({ src: url }).run()
//   }
// }

export default function HyloEditorMenuBar ({ editor }) {
  if (!editor) return null

  return (
    <div className={classes.topMenuBar}>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cx({ isActive: editor.isActive('bold') })}
      >
        <RiBold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cx({ isActive: editor.isActive('italic') })}
      >
        <RiItalic />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={cx({ isActive: editor.isActive('strike') })}
      >
        <RiStrikethrough />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={cx({ isActive: editor.isActive('code') })}
      >
        <RiCodeView />
      </button>

      <div className={classes.divider} />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cx({ isActive: editor.isActive('bulletList') })}
      >
        <RiListUnordered />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cx({ isActive: editor.isActive('orderedList') })}
      >
        <RiListOrdered />
      </button>

      {/* <div className={classes.divider} /> */}

      {/* <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        // className={cx({ isActive: editor.isActive('paragraph') })}
      >
        <VscPreview />
      </button> */}

      {/* <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={cx({ isActive: editor.isActive('paragraph') })}
      >
        <RiParagraph />
      </button> */}
      {/* <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={cx({ isActive: editor.isActive('heading', { level: 1 }) })}
      >
        <RiH1 />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cx({ isActive: editor.isActive('heading', { level: 2 }) })}
      >
        <RiH2 />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={cx({ isActive: editor.isActive('heading', { level: 3 }) })}
      >
        <RiH3 />
      </button> */}
      {/* <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={cx({ isActive: editor.isActive('heading', { level: 4 }) })}
      >
        <RiH4 />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={cx({ isActive: editor.isActive('heading', { level: 5 }) })}
      >
        <RiH5 />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={cx({ isActive: editor.isActive('heading', { level: 6 }) })}
      >
        <RiH6 />
      </button> */}

      <div className={classes.divider} />

      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={cx({ isActive: editor.isActive('blockquote') })}
      >
        <RiIndentIncrease />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={cx({ isActive: editor.isActive('codeBlock') })}
      >
        <RiCodeBoxLine />
      </button>
      {/* <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <RiSeparator />
      </button> */}
      {/* <button onClick={() => editor.chain().focus().setHardBreak().run()}>
        <RiTextWrap />
      </button> */}

      {/* <button
        onClick={() => addIframe(editor)}
      >
        <RiFilmLine />
      </button> */}

      <div className={classes.divider} />

      <button onClick={() => editor.chain().focus().undo().run()}>
        <RiArrowGoBackLine />
      </button>

      <button onClick={() => editor.chain().focus().redo().run()}>
        <RiArrowGoForwardLine />
      </button>

      <button onClick={() => {
        editor.chain().focus().clearNodes().run()
        editor.chain().focus().unsetAllMarks().run()
      }}>
        <RiFormatClear />
      </button>
    </div>
  )
}
