import { connect } from 'react-redux'

import fetchPeople from 'store/actions/fetchPeople'
import {
  addMember,
  removeMember,
  getMembers,
  setMembers,
  setAutocomplete,
  getAutocomplete,
  getMemberMatches
} from '../MemberSelector/MemberSelector.store'

export function mapStateToProps (state, props) {
  return {
    members: getMembers(state, props),
    autocomplete: getAutocomplete(state, props),
    memberMatches: getMemberMatches(state, props)
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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps, { forwardRef: true })
