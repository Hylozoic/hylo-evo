import { connect } from 'react-redux'
import {
  fetchModeratorSuggestions, clearModeratorSuggestions
} from './ModeratorsSettingsTab.store'
import getPerson from 'store/selectors/getPerson'
import { fakePerson } from 'components/PostCard/samplePost'

const moderators = fakePerson(7)

export function mapStateToProps (state, props) {
  const moderatorSuggestions = state.ModeratorsSettings.map(personId =>
    getPerson(state, {personId}))

  return {
    moderators,
    moderatorSuggestions
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    removeModerator: id => console.log('removing moderator', id),
    fetchModeratorSuggestionsMaker: slug => autocomplete => dispatch(fetchModeratorSuggestions(slug, autocomplete)),
    clearModeratorSuggestions: () => dispatch(clearModeratorSuggestions())
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { slug } = ownProps
  const {
    fetchModeratorSuggestionsMaker
   } = dispatchProps
  var fetchModeratorSuggestions

  if (slug) {
    fetchModeratorSuggestions = fetchModeratorSuggestionsMaker(slug)
  } else {
    fetchModeratorSuggestions = () => {}
  }

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchModeratorSuggestions
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
