import React, { useRef, useEffect } from 'react'
import { PluginKey } from 'prosemirror-state'
import { lowlight } from 'lowlight'
import { useEditor, EditorContent } from '@tiptap/react'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import StarterKit from '@tiptap/starter-kit'
import Mention from '@tiptap/extension-mention'

export const EMPTY_EDITOR_CONTENT_HTML = '<p></p>'

export default function HyloTipTapRender ({ className, contentHTML, readOnly = true }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: {
          levels: [1, 2, 3]
        }
      }),

      // Mentions (https://github.com/ueberdosis/tiptap/issues/2219#issuecomment-984662243)
      Mention
        .extend({
          name: 'mention'
        })
        .configure({
          HTMLAttributes: {
            class: 'mention'
          },
          renderLabel: ({ node }) => {
            return node.attrs.label
          },
          suggestion: {
            char: '@',
            pluginKey: new PluginKey('mention')
          }
        }),

      // Topics
      Mention
        .extend({
          name: 'topic'
        })
        .configure({
          HTMLAttributes: {
            class: 'topic'
          },
          renderLabel: ({ options, node }) => {
            return `${options.suggestion.char}${node.attrs.label}`
          },
          suggestion: {
            char: '#',
            pluginKey: new PluginKey('topic')
          }
        }),

      CodeBlockLowlight.configure({ lowlight })
    ],
    content: contentHTML
  }, [contentHTML])

  const editorRef = useRef(null)

  useEffect(() => {
    if (!editor) return undefined

    editor.setEditable(!readOnly)
  }, [editor, readOnly])

  if (!editor) return null

  editorRef.current = editor

  return (
    <EditorContent className={className} editor={editor} />
  )
}

// import React, { useMemo } from 'react'
// import { lowlight } from 'lowlight/lib/common'
// import { generateJSON } from '@tiptap/core'
// import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
// import Link from '@tiptap/extension-link'
// import StarterKit from '@tiptap/starter-kit'
// import Highlight from '@tiptap/extension-highlight'
// // Option 1: Browser + server-side

// export function generateProsemirrorJSONFromHTML ({ contentHTML, className }) => {
//   const output = useMemo(() => {
//     return generateJSON(contentHTML , [
//       StarterKit.configure({
//         codeBlock: false
//       }),
//       Link,
//       CodeBlockLowlight.configure({
//         lowlight
//       }),
//       Highlight
//     ])
//   }, [contentHTML])

//   return (
//     <div className={className} dangerouslySetInnerHTML={{ __html: output }} />
//   )
// }

// {/* <pre>
// <code>{JSON.stringify(output, null, 2)}</code>
// </pre> */}
