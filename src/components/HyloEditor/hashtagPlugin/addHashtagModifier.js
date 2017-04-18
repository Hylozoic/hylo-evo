import { Modifier, EditorState } from 'draft-js'

import getSearchText from './utils/getSearchText'

export default (editorState, hashtag) => {
  const contentStateWithEntity = editorState.getCurrentContent().createEntity(
    'HASHTAG',
    'IMMUTABLE',
    { hashtag }
  )
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey()

  const currentSelectionState = editorState.getSelection()
  const { begin, end } = getSearchText(editorState, currentSelectionState)

  // get selection of the hashtag search text
  const hashtagTextSelection = currentSelectionState.merge({
    anchorOffset: begin,
    focusOffset: end
  })
  let hashtagReplacedContent = Modifier.replaceText(
    editorState.getCurrentContent(),
    hashtagTextSelection,
    `#${hashtag.get('name')}`,
    null,
    entityKey
  )

  // If the hashtag is inserted at the end, a space is appended right after for
  // a smooth writing experience.
  const blockKey = hashtagTextSelection.getAnchorKey()
  const blockSize = editorState.getCurrentContent().getBlockForKey(blockKey).getLength()
  if (blockSize === end) {
    hashtagReplacedContent = Modifier.insertText(
      hashtagReplacedContent,
      hashtagReplacedContent.getSelectionAfter(),
      ' '
    )
  }

  const newEditorState = EditorState.push(
    editorState,
    hashtagReplacedContent,
    'insert-HASHTAG'
  )
  return EditorState.forceSelection(newEditorState, hashtagReplacedContent.getSelectionAfter())
}
