import { createSelector } from 'reselect'

const getEditorState = createSelector(
  (state) => state.hyloEditor,
  (state, props) => props.editorState
)

export default getEditorState
