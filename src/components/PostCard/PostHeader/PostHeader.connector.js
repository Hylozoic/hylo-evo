import { deletePost } from './PostHeader.store'
import { connect } from 'react-redux'

export function mapDispatchToProps (dispatch, props) {
  const deletePostWithConfirm = id =>
    window.confirm('are you sure you want to delete this post?') &&
    dispatch(deletePost(id))

  return {
    deletePost: deletePostWithConfirm
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { id } = ownProps
  const { deletePost } = dispatchProps
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    deletePost: () => deletePost(id)
  }
}

export default connect(null, mapDispatchToProps, mergeProps)
