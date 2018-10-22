import { connect } from 'react-redux'

import fetchPeople from 'store/actions/fetchPeople'
import {
  matchesSelector,
  setAutocomplete,
  getAutocomplete,
  addMember,
  removeMember,
  getMembers,
  setMembers
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
  fetchPeople, setAutocomplete, addMember, removeMember, setMembers
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  // note, this is members being passed in as a prop, not the one that gets set in state from the store
  const { initialMembers = [] } = ownProps
  const setMembers = () => dispatchProps.setMembers(initialMembers)
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    setMembers
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps, {withRef: true})
