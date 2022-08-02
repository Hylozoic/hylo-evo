import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Highlight from '@tiptap/extension-highlight'
import TopicMentions from './extensions/TopicMentions'
import PeopleMentions from './extensions/PeopleMentions'
import Iframe from './extensions/Iframe'

export default function HyloTipTapRender ({ className, contentHTML }) {
  const editor = useEditor({
    content: contentHTML,
    editable: false,
    extensions: [
      StarterKit,
      PeopleMentions(),
      TopicMentions(),
      // These may not be needed for render
      Link,
      Iframe, // Embed (Video)
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
//     <div className={className} dangerouslySetInnerHTML={{ __html: output }} />
//   )
// }
