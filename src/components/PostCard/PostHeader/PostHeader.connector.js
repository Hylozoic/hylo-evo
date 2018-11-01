import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { removePostFromUrl, editPostUrl } from 'util/navigation'
import getMe from 'store/selectors/getMe'
import {
  deletePost,
  removePost,
  pinPost,
  getCommunity
} from './PostHeader.store'

export function mapStateToProps (state, props) {
  const community = getCommunity(state, props)

  return {
    currentUser: getMe(state, props),
    community
  }
}

export function mapDispatchToProps (dispatch, props) {
  const { slug } = props
  const closeUrl = removePostFromUrl(window.location.pathname)
  const deletePostWithConfirm = postId => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      dispatch(deletePost(postId))
      .then(() => dispatch(push(closeUrl)))
    }
  }

  return {
    editPost: postId => props.editPost
      ? props.editPost(postId)
      : dispatch(push(editPostUrl(postId, props))),
    deletePost: postId => props.deletePost
      ? props.deletePost(postId)
      : deletePostWithConfirm(postId),
    removePost: postId => props.editPost
      ? props.removePost(postId)
      : dispatch(removePost(postId, slug)),
    pinPost: (postId, communityId) => props.pinPost
      ? props.pinPost(postId)
      : dispatch(pinPost(postId, communityId))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { currentUser, community } = stateProps
  const { id, creator } = ownProps
  const { deletePost, editPost, removePost, pinPost } = dispatchProps
  const isCreator = currentUser && creator && currentUser.id === creator.id
  const canEdit = isCreator
  const canModerate = currentUser && currentUser.canModerate(community)

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    deletePost: isCreator ? () => deletePost(id) : null,
    editPost: canEdit ? () => editPost(id) : null,
    canFlag: !isCreator,
    pinPost: canModerate && community ? () => pinPost(id, community.id) : null,
    removePost: !isCreator && canModerate ? () => removePost(id) : null,
    canEdit
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
