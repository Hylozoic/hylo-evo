import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import getQuerystringParam from 'store/selectors/getQuerystringParam'

import {
  addParticipant,
  removeParticipant,
  fetchContacts,
  fetchRecentContacts,
  holoChatContactsSelector,
  findOrCreateThread,
  holoChatMatchesSelector,
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
  const { holoMode } = props
  // only show recentContacts in Hylo mode
  const recentContacts = holoMode ? [] : recentContactsSelector(state)

  const participants = participantsSelector(state, props)
  return {
    autocomplete: state.autocomplete,
    contacts: holoChatContactsSelector(state, props),
    matches: holoChatMatchesSelector(state, props),
    participants,
    participantSearch: getParticipantSearch(props, participants),
    recentContacts
  }
}

export function mapDispatchToProps (dispatch, props) {
  const { holoMode } = props

  return {
    findOrCreateThread: (participantIds, createdAt) => dispatch(findOrCreateThread(participantIds, createdAt, holoMode)),
    fetchContacts: () => dispatch(fetchContacts(holoMode)),
    fetchPeople: (autocomplete, query, first) => dispatch(fetchPeople(autocomplete, query, first, holoMode)),
    ...bindActionCreators({
      addParticipant,
      removeParticipant,
      changeQuerystringParam,
      fetchContacts,
      fetchRecentContacts,
      setAutocomplete
    }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
