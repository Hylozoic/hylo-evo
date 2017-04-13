import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { get, includes } from 'lodash/fp'
import orm from 'store/models'
import { FETCH_POSTS } from 'store/constants'
import { fetchPosts } from './Feed.store.js'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import getParam from 'store/selectors/getParam'

export const getCommunityPosts = createSelector(
  state => orm.session(state.orm),
  getCommunityForCurrentRoute,
  (session, community) => {
    if (!community) return []

    return session.Post.all()
    .filter(post => includes(post.id, community.feedOrder))
    .orderBy(post => community.feedOrder.indexOf(post.id))
    .toModelArray()
    .map(post => ({
      ...post.ref,
      creator: post.creator,
      commenters: post.commenters.toModelArray(),
      communities: post.communities.toModelArray()
    }))
  }
)

export function mapStateToProps (state, props) {
  const community = getCommunityForCurrentRoute(state, props)
  return {
    posts: getCommunityPosts(state, props),
    slug: getParam('slug', state, props),
    community,
    postCount: get('postCount', community),
    pending: state.pending[FETCH_POSTS]
  }
}

export const mapDispatchToProps = { fetchPosts }

export default connect(mapStateToProps, mapDispatchToProps)
