import { Modifier, EditorState } from 'draft-js'

import getSearchText from './utils/getSearchText'

export default (editorState, topic) => {
  console.log(topic)
  const contentStateWithEntity = editorState.getCurrentContent().createEntity(
    'topic',
    'IMMUTABLE',
    { topic }
  )
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey()

  const currentSelectionState = editorState.getSelection()
  const { begin, end } = getSearchText(editorState, currentSelectionState)

  // get selection of the topic search text
  const topicTextSelection = currentSelectionState.merge({
    anchorOffset: begin,
    focusOffset: end
  })
  let topicReplacedContent = Modifier.replaceText(
    editorState.getCurrentContent(),
    topicTextSelection,
    `#${topic.get('name')}`,
    null,
    entityKey
  )

  // If the topic is inserted at the end, a space is appended right after for
  // a smooth writing experience.
  const blockKey = topicTextSelection.getAnchorKey()
  const blockSize = editorState.getCurrentContent().getBlockForKey(blockKey).getLength()
  if (blockSize === end) {
    topicReplacedContent = Modifier.insertText(
      topicReplacedContent,
      topicReplacedContent.getSelectionAfter(),
      ' '
    )
  }

  const newEditorState = EditorState.push(
    editorState,
    topicReplacedContent,
    'insert-topic'
  )
  return EditorState.forceSelection(newEditorState, topicReplacedContent.getSelectionAfter())
}
