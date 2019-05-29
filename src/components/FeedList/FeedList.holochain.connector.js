import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { get, orderBy, pick } from 'lodash/fp'
import HolochainCommunityQuery from 'graphql/queries/HolochainCommunityQuery.graphql'

export function mapStateToProps (state, props) {
  const fetchPostsParam = {
    filter: props.postTypeFilter,
    ...pick([
      'slug',
      'networkSlug'
    ], props.routeParams),
    ...pick([
      'subject',
      'sortBy',
      'topic'
    ], props)
  }

  return {
    hasMore: false,
    fetchPostsParam,
    storeFetchPostsParam: () => {},
    fetchPosts: () => {}
  }
}

export const posts = graphql(HolochainCommunityQuery, {
  props: ({ data: { community, loading } }) => {
    const posts = get('posts.items', community)
    return {
      posts: orderBy('createdAt', 'desc', posts),
      pending: loading
    }
  },
  options: props => ({
    variables: {
      slug: get('fetchPostsParam.slug', props)
    },
    fetchPolicy: 'cache-only'
  })
})

export default compose(
  connect(mapStateToProps),
  posts
)
