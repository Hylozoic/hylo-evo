import { connect } from 'react-redux'

import {
  addParticipant,
  removeParticipant,
  fetchPeople,
  matchesSelector,
  participantsSelector,
  setAutocomplete
} from './PeopleSelector.store'
import changeQueryParam from 'store/actions/changeQueryParam'

export function mapStateToProps (state, props) {
  return {
    autocomplete: state.autocomplete,
    matches: matchesSelector(state),
    participants: participantsSelector(state, props)
  }
}

export const mapDispatchToProps = {
  addParticipant,
  removeParticipant,
  changeQueryParam,
  fetchPeople,
  setAutocomplete
}

export default connect(mapStateToProps, mapDispatchToProps)
