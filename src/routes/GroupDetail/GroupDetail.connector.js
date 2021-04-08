import { get } from 'lodash'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { removeGroupFromUrl } from 'util/navigation'
import fetchGroupBySlug from 'store/actions/fetchGroupBySlug'
import presentGroup from 'store/presenters/presentGroup'
import getRouteParam from 'store/selectors/getRouteParam'
import getMe from 'store/selectors/getMe'
import getMyMemberships from 'store/selectors/getMyMemberships'
import getGroupForDetails from 'store/selectors/getGroupForDetails'
import { FETCH_GROUP, FETCH_JOIN_REQUESTS } from 'store/constants'
import { addSkill, removeSkill } from 'components/SkillsSection/SkillsSection.store'
import {
  createJoinRequest,
  fetchJoinRequests,
  joinGroup
} from './GroupDetail.store'

export function mapStateToProps (state, props) {
  const routeParams = props.match.params
  const group = presentGroup(props.group || getGroupForDetails(state, props))
  const slug = get('slug', group)
  const currentUser = getMe(state)
  const { GroupDetail } = state
  const isMember = group && currentUser ? getMyMemberships(state, props).find(m => m.group.id === group.id) : false

  return {
    currentUser,
    group,
    isMember,
    joinRequests: GroupDetail,
    pending: state.pending[FETCH_GROUP] || state.pending[FETCH_JOIN_REQUESTS],
    routeParams,
    slug
  }
}

export function mapDispatchToProps (dispatch, props) {
  const { location } = props

  const slug = getRouteParam('detailGroupSlug', {}, props) || getRouteParam('groupSlug', {}, props)

  const closeLocation = {
    ...props.location,
    pathname: removeGroupFromUrl(location.pathname)
  }

  return {
    addSkill: (name) => dispatch(addSkill(name)),
    removeSkill: (skillId) => dispatch(removeSkill(skillId)),
    fetchGroup: () => dispatch(fetchGroupBySlug(slug)),
    fetchJoinRequests: (groupId) => () => dispatch(fetchJoinRequests(groupId)),
    onClose: getRouteParam('detailGroupSlug', {}, props) ? () => dispatch(push(closeLocation)) : false,
    joinGroup: (groupId, userId) => () => dispatch(joinGroup(groupId, userId)),
    createJoinRequest: (groupId) => (questionAnswers) => dispatch(createJoinRequest(groupId, questionAnswers.map(q => { return { questionId: q.questionId, answer: q.answer } })))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { currentUser, group } = stateProps
  const { fetchJoinRequests, joinGroup, createJoinRequest } = dispatchProps

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    fetchJoinRequests: currentUser && group ? fetchJoinRequests(group.id) : () => {},
    joinGroup: currentUser && group ? joinGroup(group.id) : () => {},
    createJoinRequest: currentUser && group ? createJoinRequest(group.id) : () => {}
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
