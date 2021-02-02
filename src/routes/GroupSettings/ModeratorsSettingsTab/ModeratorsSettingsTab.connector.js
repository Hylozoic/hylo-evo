import { connect } from 'react-redux'
import {
  fetchModeratorSuggestions,
  clearModeratorSuggestions,
  getModerators,
  addModerator,
  removeModerator
} from './ModeratorsSettingsTab.store'
import getPerson from 'store/selectors/getPerson'
import { includes } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const moderators = getModerators(state, props)
  const moderatorIds = moderators.map(m => m.id)
  const moderatorSuggestions = state.ModeratorsSettings
    .filter(personId => !includes(personId, moderatorIds))
    .map(personId => getPerson(state, { personId }))

  return {
    moderators,
    moderatorSuggestions
  }
}

export function mapDispatchToProps (dispatch, props) {
  const { groupId } = props

  return {
    addModerator: id => dispatch(addModerator(id, groupId)),
    removeModerator: (id, isRemoveFromGroup) => dispatch(removeModerator(id, groupId, isRemoveFromGroup)),
    fetchModeratorSuggestions: autocomplete => dispatch(fetchModeratorSuggestions(groupId, autocomplete)),
    clearModeratorSuggestions: () => dispatch(clearModeratorSuggestions())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
