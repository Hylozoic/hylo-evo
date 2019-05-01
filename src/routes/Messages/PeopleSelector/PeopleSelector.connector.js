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
import changeQuerystringParam from 'store/actions/changeQuerystringParam'

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
      changeQuerystringParam,
      fetchRecentContacts,
      setAutocomplete
    }, dispatch)
  }
}

const fetchHolochainContacts = graphql(HolochainPeopleQuery, {
  skip: props => !props.holochainActive,
  options: {
    pollInterval: 10000,
    context: {
      holochain: true
    }
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
