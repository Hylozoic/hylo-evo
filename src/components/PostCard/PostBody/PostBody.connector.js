import { connect } from 'react-redux'
import getMe from 'store/selectors/getMe'
import {
  fulfillPost,
  unfulfillPost
} from './PostBody.store'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state, props)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    fulfillPost: postId => props.fulfillPost
      ? props.fulfillPost(postId)
      : dispatch(fulfillPost(postId)),
    unfulfillPost: postId => props.unfulfillPost
      ? props.unfulfillPost(postId)
      : dispatch(unfulfillPost(postId))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { currentUser } = stateProps
  const { id, creator } = ownProps
  const { fulfillPost, unfulfillPost } = dispatchProps
  const isCreator = currentUser && creator && currentUser.id === creator.id
  const canEdit = isCreator

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fulfillPost: isCreator ? () => fulfillPost(id) : undefined,
    unfulfillPost: isCreator ? () => unfulfillPost(id) : undefined,
    canEdit
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
