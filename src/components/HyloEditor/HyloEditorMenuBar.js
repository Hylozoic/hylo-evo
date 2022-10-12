import React from 'react'
import {
  RiBold, RiItalic, RiCodeBoxLine, RiStrikethrough,
  // RiH1, RiH2, RiH3,
  RiListUnordered, RiListOrdered,
  RiIndentIncrease, RiCodeView,
  RiArrowGoBackLine, RiArrowGoForwardLine, RiFormatClear
} from 'react-icons/ri'
// import { VscPreview } from 'react-icons/vsc'
import './HyloEditor.scss'

// export function addIframe (editor) {
//   const url = window.prompt('URL of video or content to embed')

//   if (url) {
//     editor.chain().focus().setIframe({ src: url }).run()
//   }
// }

export default function HyloEditorMenuBar ({ editor }) {
  if (!editor) return null

  return (
    <div styleName='topMenuBar'>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        styleName={editor.isActive('bold') ? 'is-active' : ''}
      >
        <RiBold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        styleName={editor.isActive('italic') ? 'is-active' : ''}
      >
        <RiItalic />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        styleName={editor.isActive('strike') ? 'is-active' : ''}
      >
        <RiStrikethrough />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        styleName={editor.isActive('code') ? 'is-active' : ''}
      >
        <RiCodeView />
      </button>

      <div styleName='divider' />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        styleName={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        <RiListUnordered />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        styleName={editor.isActive('orderedList') ? 'is-active' : ''}
      >
        <RiListOrdered />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        styleName={editor.isActive('blockquote') ? 'is-active' : ''}
      >
        <RiIndentIncrease />
      </button>

      {/* <div styleName='divider' /> */}

      {/* <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        // styleName={editor.isActive('paragraph') ? 'is-active' : ''}
      >
        <VscPreview />
      </button> */}

      {/* <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        styleName={editor.isActive('paragraph') ? 'is-active' : ''}
      >
        <RiParagraph />
      </button> */}
      {/* <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        styleName={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      >
        <RiH1 />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        styleName={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
      >
        <RiH2 />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        styleName={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
      >
        <RiH3 />
      </button> */}
      {/* <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        styleName={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
      >
        <RiH4 />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        styleName={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
      >
        <RiH5 />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        styleName={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
      >
        <RiH6 />
      </button> */}

      <div styleName='divider' />

      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        styleName={editor.isActive('codeBlock') ? 'is-active' : ''}
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

      <div styleName='divider' />

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
