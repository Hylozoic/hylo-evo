import { connect } from 'react-redux'
// import { createSelector } from 'reselect'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { get, includes } from 'lodash/fp'
import orm from 'store/models'
import { FETCH_POSTS } from 'store/constants'
import { fetchPosts } from './actions'

export const getPosts = slug => ormCreateSelector(orm, (session) => {
  var community
  try {
    community = session.Community.get({slug})
  } catch (e) {
    return []
  }

  return session.Post.all()
  .filter(post => includes(post.id, community.feedOrder))
  .orderBy(post => community.feedOrder.indexOf(post.id))
  .toModelArray()
  .map(post => ({
    ...post.ref,
    creator: post.creator,
    commenters: post.commenters.toModelArray()
  }))
})

export const getCommunity = slug => ormCreateSelector(orm, (session) => {
  var community
  try {
    community = session.Community.get({slug})
  } catch (e) {
    return {}
  }
  return community
})

function mapStateToProps (state, { match, slug }) {
  slug = get('params.slug', match) || slug
  const community = getCommunity(slug)(state.orm)
  return {
    posts: getPosts(slug)(state.orm),
    slug,
    community,
    postCount: get('postCount', community),
    pending: state.pending[FETCH_POSTS]
  }
}

export const mapDispatchToProps = { fetchPosts }

export default connect(mapStateToProps, mapDispatchToProps)
