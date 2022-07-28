import React from 'react'
import { PluginKey } from 'prosemirror-state'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Mention from '@tiptap/extension-mention'
// import { lowlight } from 'lowlight'
// import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'

export default function HyloTipTapRender ({ className, contentHTML }) {
  const editor = useEditor({
    content: contentHTML,
    editable: false,
    extensions: [
      StarterKit.configure({
        // codeBlock: false,
        heading: {
          levels: [1, 2, 3]
        }
      }),

      // CodeBlockLowlight.configure({ lowlight })

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
        })
    ]
  }, [contentHTML])

  if (!editor) return null

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
