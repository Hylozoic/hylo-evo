import { connect } from 'react-redux'
import {
  fetchModeratorSuggestions,
  clearModeratorSuggestions,
  getModerators,
  addModerator,
  removeModerator
} from './ModeratorsSettingsTab.store'
import {
  addGroupRole,
  addRoleToMember,
  fetchMembersForGroupRole,
  removeRoleFromMember,
  updateGroupRole
} from '../../../store/actions/roles'
import getPerson from 'store/selectors/getPerson'
import { includes } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const moderators = getModerators(state, props)
  const moderatorIds = moderators.map(m => m.id)
  const moderatorSuggestions = state.ModeratorsSettings
    .filter(personId => !includes(personId, moderatorIds))
    .map(personId => getPerson(state, { personId }))

  const rawSuggestions = state.ModeratorsSettings
    .map(personId => getPerson(state, { personId }))

  return {
    moderators,
    moderatorSuggestions,
    rawSuggestions
  }
}

export function mapDispatchToProps (dispatch, props) {
  const { groupId } = props

  return {
    addModerator: id => dispatch(addModerator(id, groupId)),
    addGroupRole: params => dispatch(addGroupRole(params)),
    addRoleToMember: params => dispatch(addRoleToMember({ ...params, groupId })),
    clearModeratorSuggestions: () => dispatch(clearModeratorSuggestions()),
    fetchModeratorSuggestions: autocomplete => dispatch(fetchModeratorSuggestions(groupId, autocomplete)),
    fetchMembersForGroupRole: params => dispatch(fetchMembersForGroupRole({ ...params, id: groupId })),
    removeModerator: (id, isRemoveFromGroup) => dispatch(removeModerator(id, groupId, isRemoveFromGroup)),
    removeRoleFromMember: params => dispatch(removeRoleFromMember({ ...params, groupId })),
    updateGroupRole: params => dispatch(updateGroupRole(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
