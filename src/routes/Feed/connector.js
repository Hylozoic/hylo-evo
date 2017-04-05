import { connect } from 'react-redux'
// import { createSelector } from 'reselect'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { get, includes } from 'lodash/fp'
import orm from 'store/models'
import { fetchFeedItems } from './actions'

export const getFeedItems = slug => ormCreateSelector(orm, (session) => {
  var community
  try {
    community = session.Community.get({slug})
  } catch (e) {
    return []
  }

  return session.FeedItem.all()
  .filter(feedItem => includes(feedItem.id, community.feedItemsOrder))
  .orderBy(feedItem => community.feedItemsOrder.indexOf(feedItem.id))
  .toModelArray()
  .map(feedItem => ({
    ...feedItem.ref,
    post: {
      ...feedItem.post.ref,
      commenters: feedItem.post.commenters.toModelArray()
    }
  }))
})

function mapStateToProps (state, { match, community }) {
  const slug = get('params.slug', match) || get('slug', community)
  return {
    feedItems: getFeedItems(slug)(state.orm),
    slug
  }
}

export const mapDispatchToProps = { fetchFeedItems }

export default connect(mapStateToProps, mapDispatchToProps)
