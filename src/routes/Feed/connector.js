import { connect } from 'react-redux'
// import { createSelector } from 'reselect'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { fetchFeedItems } from './actions'

export const getFeedItems = ormCreateSelector(orm, (session) => {
  return session.FeedItem.all().toModelArray()
})

function mapStateToProps (state) {
  return {
    feedItems: getFeedItems(state.orm)
  }
}

export const mapDispatchToProps = { fetchFeedItems }

export default connect(mapStateToProps, mapDispatchToProps)
