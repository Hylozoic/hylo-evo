import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { postUrl } from 'util/navigation'
import blockUser from 'store/actions/blockUser'
import getRolesForGroup from 'store/selectors/getRolesForGroup'
import isPendingFor from 'store/selectors/isPendingFor'
import getPreviousLocation from 'store/selectors/getPreviousLocation'
import getMe from 'store/selectors/getMe'
import getRouteParam from 'store/selectors/getRouteParam'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import fetchPerson from 'store/actions/fetchPerson'
import {
  FETCH_RECENT_ACTIVITY,
  FETCH_MEMBER_POSTS,
  FETCH_MEMBER_COMMENTS,
  FETCH_MEMBER_VOTES, // TODO REACTIONS: switch this to reactions
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
    FETCH_MEMBER_VOTES // TODO REACTIONS: switch this to reactions
  ], state)
  const personLoading = isPendingFor(fetchPerson, state)
  const groupSlug = getRouteParam('groupSlug', state, props)
  let group

  if (groupSlug) {
    group = getGroupForCurrentRoute(state, props)
  }
  const roles = getRolesForGroup(state, { person, groupId: group?.id })

  return {
    routeParams,
    error,
    personLoading,
    contentLoading,
    group,
    person,
    roles,
    currentUser: getMe(state),
    previousLocation: getPreviousLocation(state)
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    fetchPerson: (id) => dispatch(fetchPerson(id)),
    blockUser: (id) => dispatch(blockUser(id)),
    push: (url) => dispatch(push(url)),
    showDetails: (id, routeParams) => dispatch(push(postUrl(id, routeParams)))
  }
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
