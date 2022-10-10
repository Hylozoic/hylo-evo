import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import TopicMentions from './extensions/TopicMentions'
import PeopleMentions from './extensions/PeopleMentions'
import Legacy from './extensions/Legacy'
import Link from '@tiptap/extension-link'

export default function HyloTipTapRender ({ className, contentHTML }) {
  const editor = useEditor({
    content: contentHTML,
    editable: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),

      Link,

      PeopleMentions({ maxSuggestions: 0, groupIds: [], dispatch: () => {} }),

      TopicMentions({ maxSuggestions: 0, groupIds: [], dispatch: () => {} }),

      Legacy,

      Highlight
    ]
  }, [contentHTML])

  if (!editor) return null

  return (
    <EditorContent className={className} editor={editor} />
  )
}

// == Working Notes ==
//
// How to generate ProseMirror JSON from HTML:
// export function generateProsemirrorJSONFromHTML ({ contentHTML, className }) => {
//   const output = useMemo(() => {
//     return generateJSON(contentHTML , [
//       // ... as above
//     ])
//   }, [contentHTML])
//
//   return (
//     <HyloHTML className={className} html={output} />
//   )
// }
