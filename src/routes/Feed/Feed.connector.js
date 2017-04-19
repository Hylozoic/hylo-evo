import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { get, includes, isEmpty } from 'lodash/fp'
import orm from 'store/models'
import { FETCH_POSTS } from 'store/constants'
import { fetchPosts } from './Feed.store.js'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import getParam from 'store/selectors/getParam'
import { getMe } from 'store/selectors/getMe'
import { makeGetQueryResults } from 'store/reducers/queryResults'

const getPostResults = makeGetQueryResults(FETCH_POSTS)

export const getPosts = ormCreateSelector(
  orm,
  state => state.orm,
  getPostResults,
  (session, results) => {
    if (isEmpty(results) || isEmpty(results.ids)) return []
    return session.Post.all()
    .filter(x => includes(x.id, results.ids))
    .orderBy(x => results.ids.indexOf(x.id))
    .toModelArray()
    .map(post => ({
      ...post.ref,
      creator: post.creator,
      commenters: post.commenters.toModelArray(),
      communities: post.communities.toModelArray()
    }))
  }
)

const getHasMorePosts = createSelector(getPostResults, get('hasMore'))

export function mapStateToProps (state, props) {
  const community = getCommunityForCurrentRoute(state, props)
  const slug = getParam('slug', state, props)
  const extraProps = {...props, slug}
  return {
    posts: getPosts(state, extraProps),
    hasMore: getHasMorePosts(state, extraProps),
    slug,
    selectedPostId: getParam('postId', state, props),
    community,
    postCount: get('postCount', community),
    pending: state.pending[FETCH_POSTS],
    currentUser: getMe(state, props)
  }
}

export const mapDispatchToProps = function (dispatch, props) {
  const slug = getParam('slug', null, props)
  const sortBy = null // TODO
  const search = null // TODO
  return {
    fetchPosts: function (offset) {
      return dispatch(fetchPosts(slug, sortBy, offset, search))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
