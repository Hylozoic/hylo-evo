import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { get, pick } from 'lodash/fp'

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

const HolochainCommunityQuery = gql`
  query ($slug: String) {
    community(slug: $slug) {
      id
      slug
      posts {
        hasMore
        items {
          id
          title
          details
          type
          creator {
            id
            name
            avatarUrl
          }
          createdAt
          updatedAt
        }
      }
    }
  }
`

export const posts = graphql(HolochainCommunityQuery, {
  props: ({ data: { community, loading } }) => {
    const posts = get('community.posts.items', community)
    return {
      posts,
      pending: loading
    }
  },
  options: props => ({
    variables: {
      slug: get('fetchPostsParam.slug', props)
    },
    pollInterval: 60000
  })
})

export default compose(
  connect(mapStateToProps),
  posts
)
