import { createSelector } from 'reselect'

const UPDATE_EDITOR = 'UPDATE_EDITOR'

export function updateEditor (editorState) {
  return {
    type: UPDATE_EDITOR,
    payload: editorState
  }
}

export default function hyloEditorReducer (state = {}, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case UPDATE_EDITOR:
      return {...state, editorState: payload}
    default:
      return state
  }
}

export const getEditorState = createSelector(
  (state) => state.hyloEditor,
  (state, props) => state.editorState
)
