import React, { useRef, useImperativeHandle, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { isEmpty } from 'lodash/fp'
import { useEditor, EditorContent, Extension, BubbleMenu } from '@tiptap/react'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import { VscPreview } from 'react-icons/vsc'
import Link from '@tiptap/extension-link'
import PeopleMentions from './extensions/PeopleMentions'
import TopicMentions from './extensions/TopicMentions'
import HyloTipTapEditorMenuBar from './HyloTipTapEditorMenuBar'
import 'tippy.js/dist/tippy.css'
import './HyloTipTapEditor.scss'

export const HyloTipTapEditor = React.forwardRef(function HyloTipTapEditor ({
  className,
  placeholder,
  onBeforeCreate = () => {},
  onChange,
  onEnter,
  onEscape,
  onAddMention,
  onAddTopic,
  onAddLink,
  contentHTML,
  readOnly,
  hideMenu,
  maxSuggestions = 7,
  // If provided, Mention and Topic suggestions will use this to filter
  groupIds
}, ref) {
  const dispatch = useDispatch()
  const editorRef = useRef(null)
  const [selectedLink, setSelectedLink] = useState()
  const editor = useEditor({
    content: contentHTML,

    onBeforeCreate,

    onUpdate: ({ editor }) => {
      if (
        !onChange ||
        (contentHTML === editor.getHTML()) ||
        (editor.isEmpty && isEmpty(contentHTML))
      ) return

      onChange(editor.getHTML())
    },

    extensions: [
      // Key events respond are last extension first, these will be last
      Extension.create({
        name: 'KeyboardShortcuts',
        // Keep around for debugging for now:
        // onTransaction: ({ editor, transaction }) => {
        //   console.log('!!!!! looking how to get all link marks', transaction)
        //   transactions.doc.node.forEach(child => {
        //     const [fontSizeMark] = child.marks.filter((m: Mark) => m.type === markType)
        //    })
        // },
        addKeyboardShortcuts () {
          return {
            Enter: ({ editor }) => {
              if (!onEnter) return false
              return onEnter(editor.getHTML())
            },
            Escape: () => {
              if (!onEscape) return false
              return onEscape()
            }
          }
        }
      }),

      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),

      Placeholder.configure({ placeholder }),

      Link.extend({
        // This expands concatenated links back to full href for editing
        parseHTML () {
          return [
            {
              tag: 'a',
              // Special handling for links who's innerHTML has been concatenated by the backend
              contentElement: element => {
                if (element.innerHTML.match(/…$/)) {
                  const href = element.getAttribute('href')

                  try {
                    const url = new URL(href)

                    element.innerHTML = `${url.hostname}${url.pathname !== '/' ? url.pathname : ''}`
                    return element
                  } catch (e) {
                    element.innerHTML = href
                    return element
                  }
                }

                return element
              }
            }
          ]
        },
        addOptions () {
          return {
            ...this.parent?.(),
            openOnClick: false,
            autolink: true,
            HTMLAttributes: {
              target: null
            },
            validate: href => {
              onAddLink && onAddLink(href)
              return true
            }
          }
        }
      }),

      PeopleMentions({ onSelection: onAddMention, maxSuggestions, groupIds, dispatch }),

      TopicMentions({ onSelection: onAddTopic, maxSuggestions, groupIds, dispatch }),

      Highlight
    ]
  }, [placeholder, contentHTML])

  useImperativeHandle(ref, () => ({
    focus: () => {
      editorRef.current.commands.focus()
    },
    getHTML: () => {
      return editorRef.current.getHTML()
    },
    getText: () => {
      return editorRef.current.getText()
    },
    isEmpty: () => {
      return editorRef.current.isEmpty
    },
    clearContent: () => {
      editorRef.current.commands.clearContent()
    },
    setContent: content => {
      editorRef.current.commands.setContent(content)
    }
  }))

  useEffect(() => {
    if (!editor) return

    if (groupIds) editor.extensionStorage.mention.groupIds = groupIds

    editor.setEditable(!readOnly)
  }, [editor, groupIds, readOnly])

  const shouldShowBubbleMenu = ({ editor }) => {
    if (onAddLink && editor.isActive('link')) {
      setSelectedLink(editor.getAttributes('link'))

      return true
    }
  }

  if (!editor) return null

  editorRef.current = editor

  return (
    <>
      {!hideMenu && (
        <HyloTipTapEditorMenuBar editor={editor} />
      )}
      <EditorContent className={className} editor={editor} />
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{
            duration: 100,
            arrow: true,
            hideOnClick: true,
            placement: 'bottom',
            offset: [0, 6]
          }}
          shouldShow={shouldShowBubbleMenu}
        >
          <span
            onClick={() => {
              onAddLink(selectedLink?.href, true)
            }}
            styleName='addLinkPreviewButton'
          >
            <VscPreview /> Add Preview
          </span>
        </BubbleMenu>
      )}
    </>
  )
})

export default HyloTipTapEditor
