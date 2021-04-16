import { push } from 'connected-react-router'
import { get } from 'lodash'
import { connect } from 'react-redux'
import fetchGroupDetails from 'store/actions/fetchGroupDetails'
import { JOIN_REQUEST_STATUS } from 'store/models/JoinRequest'
import presentGroup from 'store/presenters/presentGroup'
import getCanModerate from 'store/selectors/getCanModerate'
import getMe from 'store/selectors/getMe'
import getMyJoinRequests from 'store/selectors/getMyJoinRequests'
import getMyMemberships from 'store/selectors/getMyMemberships'
import getGroupForDetails from 'store/selectors/getGroupForDetails'
import getRouteParam from 'store/selectors/getRouteParam'
import { FETCH_GROUP_DETAILS } from 'store/constants'
import { addSkill, removeSkill } from 'components/SkillsSection/SkillsSection.store'
import { removeGroupFromUrl } from 'util/navigation'
import {
  createJoinRequest,
  fetchJoinRequests,
  joinGroup
} from './GroupDetail.store'

export function mapStateToProps (state, props) {
  const routeParams = props.match.params
  const group = presentGroup(props.group || getGroupForDetails(state, props))
  const slug = get(group, 'slug')
  const isAboutCurrentGroup = getRouteParam('groupSlug', state, props) === getRouteParam('detailGroupSlug', state, props)
  const currentUser = getMe(state)
  const myMemberships = getMyMemberships(state, props)
  const isMember = group && currentUser ? myMemberships.find(m => m.group.id === group.id) : false
  const joinRequests = getMyJoinRequests(state, props).filter(jr => jr.status === JOIN_REQUEST_STATUS.Pending)
  const canModerate = getCanModerate(state, { group })

  return {
    canModerate,
    currentUser,
    group,
    isAboutCurrentGroup,
    isMember,
    joinRequests,
    myMemberships,
    pending: state.pending[FETCH_GROUP_DETAILS],
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
    fetchGroup: () => dispatch(fetchGroupDetails(slug)),
    fetchJoinRequests: () => dispatch(fetchJoinRequests()),
    onClose: getRouteParam('detailGroupSlug', {}, props) ? () => dispatch(push(closeLocation)) : false,
    joinGroup: (groupId) => dispatch(joinGroup(groupId)),
    createJoinRequest: (groupId, questionAnswers) => dispatch(createJoinRequest(groupId, questionAnswers.map(q => { return { questionId: q.questionId, answer: q.answer } })))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { currentUser } = stateProps
  const { joinGroup, createJoinRequest } = dispatchProps

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    joinGroup: currentUser ? joinGroup : () => {},
    createJoinRequest: currentUser ? createJoinRequest : () => {}
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
