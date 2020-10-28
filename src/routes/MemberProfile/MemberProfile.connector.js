import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import blockUser from 'store/actions/blockUser'
import isPendingFor from 'store/selectors/isPendingFor'
import getPreviousLocation from 'store/selectors/getPreviousLocation'
import getMe from 'store/selectors/getMe'
import fetchPerson from 'store/actions/fetchPerson'
import {
  FETCH_RECENT_ACTIVITY,
  FETCH_MEMBER_POSTS,
  FETCH_MEMBER_COMMENTS,
  FETCH_MEMBER_VOTES,
  getPresentedPerson
} from './MemberProfile.store'

const MESSAGES = {
  invalid: "That doesn't seem to be a valid person ID."
}

export function mapStateToProps (state, props) {
  const error = Number.isSafeInteger(Number(props.match.params.personId)) ? null : MESSAGES.invalid
  const routeParams = props.match.params
  const person = getPresentedPerson(state, { ...routeParams, ...props })
  const contentLoading = isPendingFor([
    FETCH_RECENT_ACTIVITY,
    FETCH_MEMBER_POSTS,
    FETCH_MEMBER_COMMENTS,
    FETCH_MEMBER_VOTES
  ], state)
  const personLoading = isPendingFor(fetchPerson, state)

  return {
    routeParams,
    error,
    personLoading,
    contentLoading,
    person,
    currentUser: getMe(state),
    previousLocation: getPreviousLocation(state)
  }
}

export const mapDispatchToProps = {
  fetchPerson,
  blockUser,
  push
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    goToPreviousLocation: () => dispatchProps.push(stateProps.previousLocation)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
