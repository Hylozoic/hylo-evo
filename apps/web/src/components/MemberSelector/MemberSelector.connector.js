import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { debounce } from 'lodash/fp'
import fetchPeople from 'store/actions/fetchPeople'
import {
  addMember,
  removeMember,
  getMembers,
  setMembers,
  setAutocomplete,
  getAutocomplete,
  getMemberMatches
} from './MemberSelector.store'

export function mapStateToProps (state, props) {
  return {
    members: getMembers(state, props),
    autocomplete: getAutocomplete(state, props),
    memberMatches: getMemberMatches(state, props)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    ...bindActionCreators({
      setAutocomplete,
      addMember,
      removeMember,
      setMembers
    }, dispatch),
    fetchPeople: debounce(300, (args) => dispatch(fetchPeople(args)))
  }
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
