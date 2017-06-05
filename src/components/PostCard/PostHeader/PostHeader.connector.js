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
  const { postId } = ownProps
  const { deletePost } = dispatchProps
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    deletePost: () => deletePost(postId)
  }
}

export default connect(null, mapDispatchToProps, mergeProps)
