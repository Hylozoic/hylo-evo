import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { push } from 'connected-react-router'
import { get } from 'lodash/fp'
import HolochainCommunityQuery from 'graphql/queries/HolochainCommunityQuery.graphql'
import getRouteParam from 'store/selectors/getRouteParam'
import getPostTypeContext from 'store/selectors/getPostTypeContext'
import getMe from 'store/selectors/getMe'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import changeQuerystringParam from 'store/actions/changeQuerystringParam'
import { newPostUrl } from 'util/navigation'

export function mapStateToProps (state, props) {
  const routeParams = get('match.params', props)
  const querystringParams = getQuerystringParam(['s', 't'], null, props)
  const currentUser = getMe(state)
  const postTypeContext = getPostTypeContext(state, props)

  // TODO: TBD - consolidate this getQuerystringParam('t', ...) into getPostTypeContext
  const postTypeFilter = postTypeContext || getQuerystringParam('t', state, props)
  const sortBy = getQuerystringParam('s', state, props)

  return {
    currentUser,
    routeParams,
    querystringParams,
    postTypeFilter,
    sortBy,
    selectedPostId: getRouteParam('postId', state, props),
    // * Not used for Holochain
    // Toggles permissions and initial display of FeedList
    currentUserHasMemberships: true,
    // Set to false/null?--- actually this should be the pending for Holochain agent registration
    membershipsPending: null,
    communityTopic: null,
    postsTotal: null,
    followersTotal: null,
    topicName: null,
    topic: null,
    network: null,
    networkSlug: null,
    fetchTopic: () => {},
    fetchNetwork: () => {}
  }
}

export function mapDispatchToProps (dispatch, props) {
  const routeParams = get('match.params', props)
  const querystringParams = getQuerystringParam(['s', 't'], null, props)

  return {
    changeTab: tab => dispatch(changeQuerystringParam(props, 't', tab, 'all')),
    changeSort: sort => dispatch(changeQuerystringParam(props, 's', sort, 'all')),
    goToCreateCommunity: () => dispatch(push('/create-community/name')),
    newPost: () => dispatch(push(newPostUrl(routeParams, querystringParams)))
  }
}

export const community = graphql(HolochainCommunityQuery, {
  props: ({ data: { community, loading } }) => ({
    community,
    postCount: get('postCount', community),
    pending: loading
  }),
  options: props => ({
    variables: {
      slug: getRouteParam('slug', {}, props)
    },
    fetchPolicy: 'cache-only'
  })
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  community
)
