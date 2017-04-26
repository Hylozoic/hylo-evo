import { connect } from 'react-redux'

import { deleteMatch, fetchPeople, setAutocomplete } from './PeopleSelector.store'

export function mapStateToProps (_, { matches }) {
  return {
    matches
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    deleteMatch: (id) => dispatch(deleteMatch(id)),
    fetchPeople: (autocomplete, query, first) =>
      dispatch(fetchPeople(autocomplete, query, first)),
    setAutocomplete: (autocomplete) => dispatch(setAutocomplete(autocomplete)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
