import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { postUrl } from 'util/index'

export const mapDispatchToProps = (dispatch, props) => {
  return {
    newPost: () => dispatch(push(postUrl('new')))
  }
}

export default connect(null, mapDispatchToProps)
