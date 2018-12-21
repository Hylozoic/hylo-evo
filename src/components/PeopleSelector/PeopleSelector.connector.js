import { connect } from 'react-redux'

import getQuerystringParam from 'store/selectors/getQuerystringParam'

import {
  addParticipant,
  removeParticipant,
  fetchContacts,
  fetchRecentContacts,
  contactsSelector,
  findOrCreateThread,
  matchesSelector,
  participantsSelector,
  recentContactsSelector,
  setAutocomplete
} from './PeopleSelector.store'

import fetchPeople from 'store/actions/fetchPeople'
import changeQuerystringParam from 'store/actions/changeQuerystringParam'

export function getParticipantSearch (props, participantsFromStore) {
  const participants = getQuerystringParam('participants', null, props)
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
    contacts: contactsSelector(state),
    matches: matchesSelector(state),
    participants,
    participantSearch: getParticipantSearch(props, participants),
    recentContacts: recentContactsSelector(state)
  }
}

export const mapDispatchToProps = {
  addParticipant,
  removeParticipant,
  changeQuerystringParam,
  fetchContacts,
  fetchRecentContacts,
  fetchPeople,
  setAutocomplete,
  findOrCreateThread
}

export default connect(mapStateToProps, mapDispatchToProps)
