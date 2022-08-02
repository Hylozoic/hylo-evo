import React, { useRef, useImperativeHandle, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { isEmpty } from 'lodash/fp'
import { useEditor, EditorContent, Extension } from '@tiptap/react'
import HyloTipTapEditorMenuBar from './HyloTipTapEditorMenuBar'
import Placeholder from '@tiptap/extension-placeholder'
import Iframe from './extensions/Iframe'
import Link from '@tiptap/extension-link'
import StarterKit from '@tiptap/starter-kit'
import PeopleMentions from './extensions/PeopleMentions'
import TopicMentions from './extensions/TopicMentions'
import Highlight from '@tiptap/extension-highlight'
import './HyloTipTapEditor.scss'

export const HyloTipTapEditor = React.forwardRef(function HyloTipTapEditor ({
  className,
  placeholder,
  onBeforeCreate = () => {},
  onChange,
  onEnter,
  onAddMention,
  onAddTopic,
  contentHTML,
  readOnly,
  hideMenu,
  // People Mention suggestions will use this to filter if provided
  groupIds
}, ref) {
  const dispatch = useDispatch()
  const editorRef = useRef(null)
  const editor = useEditor({
    content: contentHTML,

    onBeforeCreate,

    onUpdate: ({ editor, transaction }) => {
      // Look into `doc.descendents` for possible better or more idiomatic way to get this last node
      const firstTransactionStepName = transaction?.steps[0]?.slice?.content?.content[0]?.type?.name

      if (firstTransactionStepName) {
        const attrs = transaction?.steps[0]?.slice?.content?.content[0]?.attrs

        // Maybe move these to onUpdate for each respective plugin?
        switch (firstTransactionStepName) {
          case 'topic': {
            if (onAddTopic) onAddTopic({ id: attrs.id, name: attrs.label })
            break
          }
          case 'mention': {
            if (onAddMention) onAddMention(attrs)
            break
          }
        }
      }

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
        addKeyboardShortcuts () {
          return {
            Enter: ({ editor }) => {
              if (!onEnter) return false
              return onEnter(editor.getHTML())
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

      PeopleMentions({ groupIds, dispatch }),

      TopicMentions({ groupIds, dispatch }),

      Link.configure({ openOnClick: false }),

      Iframe, // Embed (Video)

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

  if (!editor) return null

  editorRef.current = editor

  return (
    <>
      {!hideMenu && (
        <HyloTipTapEditorMenuBar editor={editor} />
      )}
      <EditorContent className={className} editor={editor} />
    </>
  )
})

export default HyloTipTapEditor

// == WORKING NOTES ==

// Accessing tiptap/prosemirror transaction content state
// onUpdate ({ editor, transaction }) {
//   console.log(
//     '!!! in onUpdate for Mention Topic plug - transaction',
//     // transaction
//     get('steps[0].slice.content.content[0].marks', transaction),
//     get('steps', transaction)
//     // transaction.doc.descendants(node => console.log('!!! test', node.marks))
//   )
// }

// The below was needed in `Linkify.configure` due to `linkifyjs-hashtag` being
// included by `hylo-shared` and it causing TipTap's extension (which uses linkifyjs)
// to identify hashtags as links. Can be removed if the linkify situation changes.
// Linkify Hashtag extension has now been removed.
// validate: href => /^\w/.test(href)

// Sample of creating and adding a ProseMirror plugin within TipTap Editor config:
// import { linkifyPlugin } from './plugins/linkifyPlugin.ts'
// Extension.create({
//   addProseMirrorPlugins () {
//     return [
//       linkifyPlugin,
//       new Plugin({
//         key: new PluginKey('escapeHandler'),
//         props: {
//           handleKeyDown (view, event) {
//             if (event.key === 'Escape') {
//               onEscape()

//               return true
//             }
//           },
//           handleDOMEvents: {
//             keyup (view, event) {
//               // event.preventDefault()
//               return true
//             }
//           }
//         }
//       })
//     ]
//   }
// })
