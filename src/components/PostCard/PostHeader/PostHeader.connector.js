import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { RESP_MANAGE_CONTENT } from 'store/constants'
import { removePostFromUrl, editPostUrl, duplicatePostUrl, postUrl, groupUrl } from 'util/navigation'
import getMe from 'store/selectors/getMe'
import deletePost from 'store/actions/deletePost'
import removePost from 'store/actions/removePost'
import {
  unfulfillPost,
  fulfillPost,
  pinPost,
  getGroup,
  updateProposalOutcome
} from './PostHeader.store'
import getResponsibilitiesForGroup from 'store/selectors/getResponsibilitiesForGroup'
import getRolesForGroup from 'store/selectors/getRolesForGroup'

export function mapStateToProps (state, props) {
  const group = getGroup(state, props)
  const url = postUrl(props.id, props.routeParams)
  const context = props.routeParams.context
  const currentUser = getMe(state, props)
  const responsibilities = getResponsibilitiesForGroup(state, { groupId: group?.id }).map(r => r.title)
  const moderationActionsGroupUrl = group && groupUrl(group.slug, 'proposals') + '?d=moderation'

  return {
    context,
    currentUser,
    group,
    moderationActionsGroupUrl,
    postUrl: url,
    responsibilities,
    connectorGetRolesForGroup: (creatorId) => getRolesForGroup(state, { groupId: group?.id, person: creatorId })
  }
}

export function mapDispatchToProps (dispatch, props) {
  const { groupSlug } = props.routeParams
  const closeUrl = removePostFromUrl(window.location.pathname)
  const deletePostWithConfirm = (postId, groupId, text) => {
    if (window.confirm((text))) {
      dispatch(deletePost(postId, groupId))
      dispatch(push(closeUrl))
    }
  }

  return {
    editPost: postId => props.editPost
      ? props.editPost(postId)
      : dispatch(push(editPostUrl(postId, props.routeParams))),
    duplicatePost: postId => props.duplicatePost
      ? props.duplicatePost(postId)
      : dispatch(push(duplicatePostUrl(postId, props.routeParams))),
    deletePost: (postId, groupId, text) => props.deletePost
      ? props.deletePost(postId)
      : deletePostWithConfirm(postId, groupId, text),
    fulfillPost: postId => props.fulfillPost
      ? props.fulfillPost(postId)
      : dispatch(fulfillPost(postId)),
    unfulfillPost: postId => props.unfulfillPost
      ? props.unfulfillPost(postId)
      : dispatch(unfulfillPost(postId)),
    removePost: postId => props.removePost
      ? props.removePost(postId)
      : dispatch(removePost(postId, groupSlug)),
    pinPost: (postId, groupId) => props.pinPost
      ? props.pinPost(postId)
      : dispatch(pinPost(postId, groupId)),
    updateProposalOutcome: (postId, proposalOutcome) => dispatch(updateProposalOutcome(postId, proposalOutcome))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { currentUser, group, responsibilities, connectorGetRolesForGroup } = stateProps
  const { id, creator } = ownProps
  const { deletePost, editPost, duplicatePost, fulfillPost, unfulfillPost, removePost, pinPost, updateProposalOutcome } = dispatchProps
  const isCreator = currentUser && creator && currentUser.id === creator.id
  const canEdit = isCreator
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    deletePost: isCreator ? (text) => deletePost(id, group ? group.id : null, text) : undefined,
    editPost: canEdit ? () => editPost(id) : undefined,
    duplicatePost: () => duplicatePost(id),
    fulfillPost: isCreator ? () => fulfillPost(id) : undefined,
    unfulfillPost: isCreator ? () => unfulfillPost(id) : undefined,
    canFlag: !isCreator,
    pinPost: (responsibilities.includes(RESP_MANAGE_CONTENT)) && group ? () => pinPost(id, group.id) : undefined,
    removePost: !isCreator && (responsibilities.includes(RESP_MANAGE_CONTENT)) ? () => removePost(id) : undefined,
    roles: creator && connectorGetRolesForGroup(creator.id),
    updateProposalOutcome: isCreator ? (proposalOutcome) => updateProposalOutcome(id, proposalOutcome) : undefined,
    canEdit
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
