import { connect } from 'react-redux'

import { addParticipant, removeParticipant, fetchPeople, matchesSelector, participantsSelector, setAutocomplete } from './PeopleSelector.store'
// TODO: pull this out of MemberProfile?
import { fetchPerson } from 'routes/MemberProfile/MemberProfile.store'

export function mapStateToProps (state, props) {
  return {
    autocomplete: state.autocomplete,
    matches: matchesSelector(state),
    participants: participantsSelector(state, props)
  }
}

export default connect(mapStateToProps, { addParticipant, removeParticipant, fetchPeople, fetchPerson, setAutocomplete })
