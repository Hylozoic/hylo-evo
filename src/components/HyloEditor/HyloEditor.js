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
import HyloEditorMenuBar from './HyloEditorMenuBar'
import 'tippy.js/dist/tippy.css'
import './HyloEditor.scss'

export const HyloEditor = React.forwardRef(function HyloEditor ({
  className,
  containerClassName = 'hyloEditor',
  contentHTML,
  // See: https://github.com/Hylozoic/hylo-evo/issues/1318
  groupIds,
  maxSuggestions = 7,
  onAddLink,
  onAddMention,
  onAddTopic,
  onBeforeCreate = () => {},
  onChange,
  onEnter,
  onEscape,
  placeholder,
  readOnly,
  showMenu = false
}, ref) {
  const dispatch = useDispatch()
  const editorRef = useRef(null)
  const [selectedLink, setSelectedLink] = useState()
  const editor = useEditor({
    content: contentHTML,

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
    ],

    onBeforeCreate,

    onUpdate: ({ editor }) => {
      if (
        !onChange ||
        // TODO: This condition won't run on last update in mobile. Test on Web with removal.
        // (contentHTML === editor.getHTML()) ||
        (editor.isEmpty && isEmpty(contentHTML))
      ) return

      onChange(editor.getHTML())
    }
  }, [placeholder, contentHTML])

  useImperativeHandle(ref, () => ({
    blur: () => {
      editorRef.current.commands.blur()
    },
    clearContent: () => {
      editorRef.current.commands.clearContent()
    },
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
    <div className={containerClassName} style={{ flex: 1 }}>
      {showMenu && (
        <HyloEditorMenuBar editor={editor} />
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
    </div>
  )
})

export default HyloEditor
