import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { get, omit } from 'lodash/fp'
import { GROUP_ACCESSIBILITY } from 'store/models/Group'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import getMe from 'store/selectors/getMe'
import { baseUrl, groupUrl, postUrl } from 'util/navigation'
import { createGroup, fetchGroupExists } from './CreateGroup.store'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state)
  const currentGroup = getGroupForCurrentRoute(state, props)

  // Current user can add as parents groups that they are a moderator of or that are Open access
  const parentGroupOptions = (currentUser && currentUser.memberships.toModelArray()
    .filter(m => m.hasModeratorRole || m.group.accessibility === GROUP_ACCESSIBILITY.Open)
    .map((m) => m.group)
    .sort((a, b) => a.name.localeCompare(b.name)))

  return {
    groupSlugExists: get('slugExists', state.CreateGroup),
    parentGroupOptions,
    // If currently in a group that user can add as a parent then add it as a parent by default
    parentGroups: currentGroup && parentGroupOptions.find(p => p.id === currentGroup.id) ? [currentGroup] : []
  }
}

export const mapDispatchToProps = (dispatch, props) => {
  const routeParams = get('match.params', props)
  if (!routeParams) return {}

  const { postId } = routeParams
  const urlParams = omit(['postId', 'action'], routeParams)
  const closeUrl = postId
    ? postUrl(postId, urlParams)
    : baseUrl(urlParams)

  return {
    closeModal: () => dispatch(push(closeUrl)),
    createGroup: (data) => dispatch(createGroup(data)),
    fetchGroupExists: (slug) => dispatch(fetchGroupExists(slug)),
    goToGroup: (slug) => dispatch(push(groupUrl(slug)))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
