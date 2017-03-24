import { connect } from 'react-redux'
import { updateEditor, getEditorState } from './reducer'

export function mapStateToProps (state, props) {
  return {
    // editorState: getEditorState(state, props)
  }
}

export const mapDispatchToProps = {
  // updateEditor
}

export default connect(mapStateToProps, mapDispatchToProps)
