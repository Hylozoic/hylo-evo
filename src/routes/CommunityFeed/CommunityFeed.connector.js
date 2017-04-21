import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { get, includes, isEmpty } from 'lodash/fp'
import orm from 'store/models'
import { FETCH_POSTS } from 'store/constants'
import { fetchPosts } from './CommunityFeed.store.js'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import getParam from 'store/selectors/getParam'
import { getMe } from 'store/selectors/getMe'
import { makeGetQueryResults } from 'store/reducers/queryResults'
import changeQueryParam from 'store/actions/changeQueryParam'
import getQueryParam from 'store/selectors/getQueryParam'
import { push } from 'react-router-redux'
import { postUrl } from 'util/index'
import { makeUrl } from 'util/navigation'

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
  const filter = getQueryParam('t', state, props)
  const sortBy = getQueryParam('s', state, props)
  const extraProps = {...props, slug, filter, sortBy}

  return {
    posts: getPosts(state, extraProps),
    hasMore: getHasMorePosts(state, extraProps),
    slug,
    filter,
    sortBy,
    selectedPostId: getParam('postId', state, props),
    community,
    postCount: get('postCount', community),
    pending: state.pending[FETCH_POSTS],
    currentUser: getMe(state, props)
  }
}

export const mapDispatchToProps = function (dispatch, props) {
  const slug = getParam('slug', null, props)
  const params = getQueryParam(['s', 't'], null, props)
  const { s: sortBy, t: filter } = params
  const search = null
  return {
    fetchPosts: function (offset) {
      return dispatch(fetchPosts({slug, sortBy, offset, search, filter}))
    },
    changeTab: function (tab) {
      return dispatch(changeQueryParam(props, 't', tab, 'all'))
    },
    changeSort: function (sort) {
      return dispatch(changeQueryParam(props, 's', sort, 'all'))
    },
    showPostDetails: function (postId) {
      // we need to preserve url parameters when opening the details for a post,
      // or the center column will revert to its default sort & filter settings
      return dispatch(push(makeUrl(postUrl(postId, slug), params)))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
