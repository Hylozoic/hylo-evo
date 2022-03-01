import { connect } from 'react-redux'
import { JOIN_REQUEST_STATUS } from 'store/models/JoinRequest'
import getCanModerate from 'store/selectors/getCanModerate'
import { getChildGroups } from 'store/selectors/getGroupRelationships'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import getMyJoinRequests from 'store/selectors/getMyJoinRequests'
import getMyMemberships from 'store/selectors/getMyMemberships'
import getRouteParam from 'store/selectors/getRouteParam'
import presentGroup from 'store/presenters/presentGroup'
import presentPost from 'store/presenters/presentPost'
import { fetchPosts, getPosts } from 'components/FeedList/FeedList.store'

export function mapStateToProps (state, props) {
  const groupSlug = getRouteParam('groupSlug', state, props)
  const fetchPostsParam = { slug: groupSlug, context: 'groups', sortBy: 'created' }
  const group = presentGroup(getGroupForCurrentRoute(state, props))
  const isAboutOpen = getRouteParam('detailGroupSlug', state, props)
  const isModerator = getCanModerate(state, { group })
  const posts = getPosts(state, fetchPostsParam).map(p => presentPost(p, group.id))
  const routeParams = props.match.params
  const widgets = ((group && group.widgets) || []).filter(w => w.name !== 'map' && w.context === 'landing')
  const memberships = getMyMemberships(state, props)
  const joinRequests = getMyJoinRequests(state, props).filter(jr => jr.status === JOIN_REQUEST_STATUS.Pending)
  const childGroups = getChildGroups(state, { groupSlug }).map(g => {
    g.memberStatus = memberships.find(m => m.group.id === g.id) ? 'member' : joinRequests.find(jr => jr.group.id === g.id) ? 'requested' : 'not'
    return g
  })

  return {
    childGroups,
    fetchPostsParam,
    group,
    isAboutOpen,
    isModerator,
    posts,
    routeParams,
    widgets
  }
}

export function mapDispatchToProps (dispatch, props) {

  return {
    fetchPosts: (params) => () => dispatch(fetchPosts({ ...params }))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { fetchPostsParam } = stateProps

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    fetchPosts: dispatchProps.fetchPosts(fetchPostsParam)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
