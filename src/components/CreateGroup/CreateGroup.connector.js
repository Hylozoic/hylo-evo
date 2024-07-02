import { connect } from 'react-redux'
import { goBack, push } from 'connected-react-router'
import { get } from 'lodash/fp'
import { RESP_ADMINISTRATION } from 'store/constants'
import { GROUP_ACCESSIBILITY } from 'store/models/Group'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import getMe from 'store/selectors/getMe'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import hasResponsibilityForGroup from 'store/selectors/hasResponsibilityForGroup'
import { groupUrl } from 'util/navigation'
import { createGroup, fetchGroupExists } from './CreateGroup.store'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state)
  const currentGroup = getGroupForCurrentRoute(state, props)

  // Current user can add as parents groups ones that they are a Coordinator of or that are Open access
  const parentGroupOptions = (currentUser && currentUser.memberships.toModelArray()
    .filter(m => m.group.accessibility === GROUP_ACCESSIBILITY.Open || hasResponsibilityForGroup(state, { groupId: m.group.id, responsibility: RESP_ADMINISTRATION }))
    .map((m) => m.group)
    .sort((a, b) => a.name.localeCompare(b.name)))

  return {
    groupSlugExists: get('slugExists', state.CreateGroup),
    initialGroupName: getQuerystringParam('name', state, props),
    initialGroupSlug: getQuerystringParam('slug', state, props),
    parentGroupOptions,
    // If currently in a group that user can add as a parent then add it as a parent by default
    parentGroups: currentGroup && parentGroupOptions.find(p => p.id === currentGroup.id) ? [currentGroup] : []
  }
}

export const mapDispatchToProps = (dispatch) => {
  return {
    goBack: () => dispatch(goBack()),
    createGroup: (data) => dispatch(createGroup(data)),
    fetchGroupExists: (slug) => dispatch(fetchGroupExists(slug)),
    goToGroup: (slug) => dispatch(push(groupUrl(slug)))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
