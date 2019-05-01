import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { graphql, compose } from 'react-apollo'
import {
  HolochainPeopleQuery,
  fetchRecentContacts,
  getHoloChatMatches,
  getRecentContacts,
  setAutocomplete
} from './PeopleSelector.store'
import fetchPeople from 'store/actions/fetchPeople'

export function mapStateToProps (state, props) {
  const { holochainActive } = props
  // only show recentContacts in Hylo mode
  const recentContacts = holochainActive ? [] : getRecentContacts(state)

  return {
    autocomplete: state.autocomplete,
    matches: getHoloChatMatches(state, props),
    recentContacts
  }
}

export function mapDispatchToProps (dispatch, props) {
  const { holochainActive } = props

  return {
    fetchPeople: (autocomplete, query, first) => dispatch(fetchPeople(autocomplete, query, first, holochainActive)),
    ...bindActionCreators({
      fetchRecentContacts,
      setAutocomplete
    }, dispatch)
  }
}

const fetchHolochainContacts = graphql(HolochainPeopleQuery, {
  options: {
    context: { holochain: true },
    pollInterval: 10000
  },
  props: ({ data: { people, loading }, currentUser }) => {
    return {
      // TODO: Fix this
      // contacts: currentUser && people && people.items.filter(p => p.id !== currentUser.id),
      contacts: people && people.items
    }
  }
})

export default compose(
  fetchHolochainContacts,
  connect(mapStateToProps, mapDispatchToProps)
)
