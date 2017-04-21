import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { get, includes, isEmpty } from 'lodash/fp'
import orm from 'store/models'
import { FETCH_POSTS } from 'store/constants'
import { fetchPosts } from './Feed.store.js'
import { makeGetQueryResults } from 'store/reducers/queryResults'

export function mapStateToProps (state, props) {
  return {
    posts: getPosts(state, props),
    hasMore: getHasMorePosts(state, props),
    pending: state.pending[FETCH_POSTS]
  }
}

export const mapDispatchToProps = function (dispatch, props) {
  const { id, sortBy, filter, subject } = props
  const search = null // placeholder; no need for this yet
  return {
    fetchPosts: function (offset) {
      return dispatch(fetchPosts({subject, id, sortBy, offset, search, filter}))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)

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
