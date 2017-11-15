import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { get } from 'lodash/fp'
import { FETCH_POSTS } from 'store/constants'
import { presentPost } from 'store/selectors/getPost'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import { fetchPosts, storeFeedListProps } from './FeedList.store.js'
import { makeGetQueryResults, makeQueryResultsModelSelector } from 'store/reducers/queryResults'

export function mapStateToProps (state, props) {
  const currentCommunity = getCommunityForCurrentRoute(state, props)
  const communityId = currentCommunity && currentCommunity.id

  return {
    posts: getPosts(communityId)(state, props),
    hasMore: getHasMorePosts(state, props),
    pending: state.pending[FETCH_POSTS]
  }
}

export const mapDispatchToProps = function (dispatch, props) {
  const { slug, networkSlug, sortBy, filter, subject, topic } = props
  const search = null // placeholder; no need for this yet
  return {
    fetchPosts: offset => dispatch(fetchPosts({
      subject,
      slug,
      networkSlug,
      sortBy,
      offset,
      search,
      filter,
      topic
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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)

const getPostResults = makeGetQueryResults(FETCH_POSTS)

export const getPosts = communityId => makeQueryResultsModelSelector(
  getPostResults,
  'Post',
  post => presentPost(post, communityId)
)

const getHasMorePosts = createSelector(getPostResults, get('hasMore'))
