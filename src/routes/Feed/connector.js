import { connect } from 'react-redux'
// import { createSelector } from 'reselect'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { get } from 'lodash/fp'
import orm from 'store/models'
import { fetchFeedItems } from './actions'

export const getFeedItems = slug => ormCreateSelector(orm, (session) => {
  return session.FeedItem.all()
  .toModelArray()
  .map(feedItem => ({
    ...feedItem.ref,
    post: {
      ...feedItem.post.ref,
      commenters: feedItem.post.commenters.toModelArray()
    }
  }))
  .reverse()
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
