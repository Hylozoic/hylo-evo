import { connect } from 'react-redux'

import getQueryParam from 'store/selectors/getQueryParam'

import {
  addParticipant,
  removeParticipant,
  fetchPeople,
  matchesSelector,
  participantsSelector,
  setAutocomplete
} from './PeopleSelector.store'
import changeQueryParam from 'store/actions/changeQueryParam'

export function getParticipantSearch (props, participantsFromStore) {
  const participants = getQueryParam('participants', null, props)
  if (participants) {
    return participants
      .split(',')
      .filter(p => !participantsFromStore.find(participant => p === participant))
  }
  return null
}

export function mapStateToProps (state, props) {
  const participants = participantsSelector(state, props)
  return {
    autocomplete: state.autocomplete,
    matches: matchesSelector(state),
    participants,
    participantSearch: getParticipantSearch(props, participants)
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
