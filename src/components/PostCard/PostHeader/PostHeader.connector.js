import { deletePost } from './PostHeader.store'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { removePostFromUrl } from 'util/index'
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

  return {
    deletePost: deletePostWithConfirm
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { currentUser } = stateProps
  const { id, creator } = ownProps
  const { deletePost } = dispatchProps
  const canDelete = currentUser.id === creator.id
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    deletePost: canDelete ? () => deletePost(id) : null
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
