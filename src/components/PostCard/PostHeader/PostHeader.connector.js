import { deletePost } from './PostHeader.store'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { removePostFromUrl, postUrl } from 'util/index'
import getMe from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state, props)
  }
}

export function mapDispatchToProps (dispatch, props) {
  const closeUrl = removePostFromUrl(window.location.pathname)
  const deletePostWithConfirm = id => {
    if (window.confirm('are you sure you want to delete this post?')) {
      dispatch(deletePost(id))
      .then(() => dispatch(push(closeUrl)))
    }
  }

  const editPost = (id, slug) => dispatch(push(postUrl(id, slug, {action: 'edit'})))

  return {
    deletePost: deletePostWithConfirm,
    editPost
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { currentUser } = stateProps
  const { id, creator, slug } = ownProps
  const { deletePost, editPost } = dispatchProps
  const canEdit = currentUser && creator && currentUser.id === creator.id
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    deletePost: canEdit ? () => deletePost(id) : null,
    editPost: canEdit ? () => editPost(id, slug) : null,
    canEdit
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
