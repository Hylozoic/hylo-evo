import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { graphql, compose } from 'react-apollo'
import getQuerystringParam from 'store/selectors/getQuerystringParam'

import {
  addParticipant,
  removeParticipant,
  HolochainPeopleQuery,
  fetchRecentContacts,
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
    matches: getHoloChatMatches(state, props),
    participants,
    participantSearch: getParticipantSearch(props, participants),
    recentContacts
  }
}

export function mapDispatchToProps (dispatch, props) {
  const { holochainActive } = props

  return {
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

const fetchHolochainContacts = graphql(HolochainPeopleQuery, {
  options: {
    pollInterval: 10000
  },
  props: ({ data: { people, loading }, currentUser }) => {
    return {
      contacts: people && people.items,
      // contacts: currentUser && people && people.items.filter(p => p.id !== currentUser.id),
      onError: (s) => console.log('!!!!! errors on fetch in fetchContactApollo:', s)
    }
  }
})

export default compose(
  fetchHolochainContacts,
  connect(mapStateToProps, mapDispatchToProps)
)
