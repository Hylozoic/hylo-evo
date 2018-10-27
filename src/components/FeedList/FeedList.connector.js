import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { get, pick } from 'lodash/fp'
import { FETCH_POSTS } from 'store/constants'
import { presentPost } from 'store/selectors/getPost'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import { fetchPosts, storeFeedListProps } from './FeedList.store.js'
import { makeGetQueryResults, makeQueryResultsModelSelector } from 'store/reducers/queryResults'

export function mapStateToProps (state, props) {
  const currentCommunity = getCommunityForCurrentRoute(state, props)
  const communityId = currentCommunity && currentCommunity.id
  const posts = getPosts(state, props).map(p => presentPost(p, communityId))

  return {
    posts,
    hasMore: getHasMorePosts(state, props),
    pending: state.pending[FETCH_POSTS]
  }
}

export const mapDispatchToProps = function (dispatch, props) {
  return {
    fetchPosts: offset => dispatch(fetchPosts({
      offset,
      ...pick([
        'subject',
        'slug',
        'networkSlug',
        'sortBy',
        'filter',
        'topic'
      ], props)
    })),
    // We are putting a the feedListProps into appstate so components (ie Navigation,
    // TopicNav) can drop the queryResults and re-fetch posts
    storeFeedListPropsMaker: props => () => dispatch(storeFeedListProps(props))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { storeFeedListPropsMaker } = dispatchProps

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    storeFeedListProps: storeFeedListPropsMaker(ownProps)
  }
}

const getPostResults = makeGetQueryResults(FETCH_POSTS)

export const getPosts = makeQueryResultsModelSelector(
  getPostResults,
  'Post'
)

const getHasMorePosts = createSelector(getPostResults, get('hasMore'))

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
