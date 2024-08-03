import { connect } from 'react-redux'
import {
  fetchStewardSuggestions,
  clearStewardSuggestions
} from './RolesSettingsTab.store'
import {
  addGroupRole,
  addRoleToMember,
  fetchMembersForGroupRole,
  fetchMembersForCommonRole,
  removeRoleFromMember,
  updateGroupRole
} from '../../../store/actions/roles'
import getPerson from 'store/selectors/getPerson'

export function mapStateToProps (state, props) {
  const suggestions = state.RoleSettings
    .map(personId => getPerson(state, { personId }))

  return {
    suggestions
  }
}

export function mapDispatchToProps (dispatch, props) {
  const { groupId } = props

  return {
    addGroupRole: params => dispatch(addGroupRole(params)),
    addRoleToMember: params => dispatch(addRoleToMember({ ...params, groupId })),
    clearStewardSuggestions: () => dispatch(clearStewardSuggestions()),
    fetchStewardSuggestions: autocomplete => dispatch(fetchStewardSuggestions(groupId, autocomplete)),
    fetchMembersForGroupRole: params => dispatch(fetchMembersForGroupRole({ ...params, id: groupId })),
    fetchMembersForCommonRole: params => dispatch(fetchMembersForCommonRole({ ...params, id: groupId })),
    removeRoleFromMember: params => dispatch(removeRoleFromMember({ ...params, groupId })),
    updateGroupRole: params => dispatch(updateGroupRole(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
