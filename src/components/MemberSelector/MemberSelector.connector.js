import { connect } from 'react-redux'

import fetchPeople from 'store/actions/fetchPeople'
import {
  matchesSelector,
  setAutocomplete,
  getAutocomplete,
  addMember,
  removeMember,
  getMembers
 } from '../MemberSelector/MemberSelector.store'

export function mapStateToProps (state, props) {
  const people = matchesSelector(state, props)
  const autocomplete = getAutocomplete(state, props)
  const members = getMembers(state, props)
  return {
    people,
    autocomplete,
    members
  }
}

export const mapDispatchToProps = {
  fetchPeople, setAutocomplete, addMember, removeMember
}

export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})
