import qs from 'querystring'
import { connect } from 'react-redux'
import { get } from 'lodash/fp'

import {
  addParticipant,
  removeParticipant,
  fetchContacts,
  fetchPeople,
  matchesSelector,
  participantsSelector,
  setAutocomplete
} from './PeopleSelector.store'
import changeQueryParam from 'store/actions/changeQueryParam'

export function getParticipantSearch (props, participantsFromStore) {
  const search = get('location.search', props)
  if (search) {
    const participants = qs.parse(search.slice(1)).participants
    return participants
      .split(',')
      .filter(p => !participantsFromStore.find(participant => p === participant.id))
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
  fetchContacts,
  fetchPeople,
  setAutocomplete
}

export default connect(mapStateToProps, mapDispatchToProps)
