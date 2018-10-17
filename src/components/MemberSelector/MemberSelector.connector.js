import { connect } from 'react-redux'

import fetchPeople from 'store/actions/fetchPeople'
import { matchesSelector, setAutocomplete, getAutocomplete } from '../MemberSelector/MemberSelector.store'

export function mapStateToProps (state, props) {
  const people = matchesSelector(state, props)
  const autocomplete = getAutocomplete(state, props)
  return {
    people,
    autocomplete
  }
}

export const mapDispatchToProps = {
  fetchPeople, setAutocomplete
}

export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})
