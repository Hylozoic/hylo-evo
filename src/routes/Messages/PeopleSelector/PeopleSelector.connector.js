import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import getQuerystringParam from 'store/selectors/getQuerystringParam'

import {
  addParticipant,
  removeParticipant,
  fetchContacts,
  fetchRecentContacts,
  getHoloChatContacts,
  getHoloChatMatches,
  getParticipants,
  getRecentContacts,
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
  const { holochainActive } = props
  // only show recentContacts in Hylo mode
  const recentContacts = holochainActive ? [] : getRecentContacts(state)

  const participants = getParticipants(state, props)
  return {
    autocomplete: state.autocomplete,
    contacts: getHoloChatContacts(state, props),
    matches: getHoloChatMatches(state, props),
    participants,
    participantSearch: getParticipantSearch(props, participants),
    recentContacts
  }
}

export function mapDispatchToProps (dispatch, props) {
  const { holochainActive } = props

  return {
    fetchContacts: () => dispatch(fetchContacts(holochainActive)),
    fetchPeople: (autocomplete, query, first) => dispatch(fetchPeople(autocomplete, query, first, holochainActive)),
    ...bindActionCreators({
      addParticipant,
      removeParticipant,
      changeQuerystringParam,
      fetchRecentContacts,
      setAutocomplete
    }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
