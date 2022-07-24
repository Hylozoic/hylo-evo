import React from 'react'
import {
  RiBold, RiItalic, RiCodeBoxLine, RiStrikethrough, RiParagraph,
  RiH1, RiH2, RiH3, RiH4, RiH5, RiH6, RiListUnordered, RiListOrdered,
  RiIndentIncrease, RiSeparator, RiTextWrap, RiFilmLine, RiCodeView
} from 'react-icons/ri'
import './HyloTipTapEditor.scss'

export function addIframe (editor) {
  const url = window.prompt('URL of video or content to embed')

  if (url) {
    editor.chain().focus().setIframe({ src: url }).run()
  }
}

export default function HyloTipTapEditorMenuBar ({ editor }) {
  if (!editor) return null

  return (
    <div styleName='topMenuBar'>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        <RiBold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        <RiItalic />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'is-active' : ''}
      >
        <RiStrikethrough />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? 'is-active' : ''}
      >
        <RiCodeView />
      </button>

      <div styleName='divider' />

      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive('paragraph') ? 'is-active' : ''}
      >
        <RiParagraph />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      >
        <RiH1 />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
      >
        <RiH2 />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
      >
        <RiH3 />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
      >
        <RiH4 />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
      >
        <RiH5 />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
      >
        <RiH6 />
      </button>

      <div styleName='divider' />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        <RiListUnordered />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
      >
        <RiListOrdered />
      </button>

      <div styleName='divider' />

      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'is-active' : ''}
      >
        <RiCodeBoxLine />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'is-active' : ''}
      >
        <RiIndentIncrease />
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <RiSeparator />
      </button>
      <button onClick={() => editor.chain().focus().setHardBreak().run()}>
        <RiTextWrap />
      </button>
      <button
        onClick={() => addIframe(editor)}
        className='embedButton'
      >
        <RiFilmLine />
      </button>
    </div>
  )
}
