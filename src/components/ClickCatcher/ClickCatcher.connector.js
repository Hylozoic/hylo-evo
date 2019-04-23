import { connect } from 'react-redux'
import { push } from 'connected-react-router'

export function mapDispatchToProps (dispatch) {
  return {
    navigate: (path) => dispatch(push(path))
  }
}

export default connect(null, mapDispatchToProps)
