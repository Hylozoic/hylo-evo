import { connect } from 'react-redux'

import { addParticipant, removeParticipant, fetchPeople, matchesSelector, participantsSelector, setAutocomplete } from './PeopleSelector.store'

export function mapStateToProps (state) {
  return {
    autocomplete: state.autocomplete,
    matches: matchesSelector(state),
    participants: participantsSelector(state)
  }
}

export default connect(mapStateToProps, { addParticipant, removeParticipant, fetchPeople, setAutocomplete })
