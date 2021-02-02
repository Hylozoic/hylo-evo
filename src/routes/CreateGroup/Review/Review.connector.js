import { get } from 'lodash/fp'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import getMe from 'store/selectors/getMe'
import updateUserSettings from 'store/actions/updateUserSettings'
import { addGroupName, addGroupDomain, fetchGroupExists } from '../CreateGroup.store'
import { createGroup, getParents } from './Review.store'

export function mapStateToProps (state, props) {
  const groupParentIds = get('parentIds', state.CreateGroup)
  const parentGroups = getParents(state, { parentIds: groupParentIds })

  return {
    currentUser: getMe(state),
    groupDomain: get('domain', state.CreateGroup),
    groupName: get('name', state.CreateGroup),
    groupPrivacy: get('privacy', state.CreateGroup),
    groupParentIds,
    groupDomainExists: get('domainExists', state.CreateGroup),
    groupParentNames: parentGroups.map(g => get('name', g))
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    goToGroup: (groupDomain) => dispatch(push(`/g/${groupDomain}`)),
    updateUserSettings: (changes) => dispatch(updateUserSettings(changes)),
    clearNameFromCreateGroup: () => dispatch(addGroupName(null)),
    clearDomainFromCreateGroup: () => dispatch(addGroupDomain(null)),
    createGroup: (name, slug, parentIds) => dispatch(createGroup(name, slug, parentIds)),
    goToPrivacyStep: () => dispatch(push('/create-group/privacy')),
    goHome: () => dispatch(push('/')),
    fetchGroupExists: (slug) => dispatch(fetchGroupExists(slug))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
