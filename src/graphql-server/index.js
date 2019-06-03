import { makeExecutableSchema } from 'graphql-tools'
import { get } from 'lodash/fp'
import { createZomeCall } from 'client/holochainClient'
import typeDefs from './oldSchema.graphql'

export const resolvers = {
  Query: {
    async me (_, args, context, info) {
      const graphqlFetcher = createZomeCall('graphql/graphql')
      const meQueryString = `query HolochainCurrentUserQuery {
        me {
          id
          name
          avatarUrl
          isRegistered
          __typename
        }
      }`
      const queryResultsRaw = await graphqlFetcher({ query: meQueryString, variables: {} })
      const queryResults = JSON.parse(queryResultsRaw)
      const me = get('me', queryResults)

      return {
        ...me,
        __typename: 'Me'
      }
    },

    async communities (_, args, context, info) {
      const communityAddressesFetcher = createZomeCall('community/get_communitys')
      const communityAddresses = await communityAddressesFetcher()
      const communityFetcher = createZomeCall('community/get_community')
      const communities = communityAddresses.map(async address => ({
        id: address,
        ...await communityFetcher({ address }),
        __typename: 'Community'
      }))

      return {
        items: communities,
        __typename: 'CommunitiesQuerySet'
      }
    },

    async community (_, args, context, info) {
      const communityAddressFetcher = createZomeCall('community/get_community_address_by_slug')
      const communityAddress = await communityAddressFetcher({ slug: args.slug })
      const communityResultFetcher = createZomeCall('community/get_community')
      const community = await communityResultFetcher({ address: communityAddress })

      return {
        id: communityAddress,
        ...community,
        __typename: 'Community'
      }
    }
  },

  Community: {
    async posts (community, args, context, info) {
      const postsAddressesFetcher = createZomeCall('posts/get_posts')
      const postAddresses = await postsAddressesFetcher({ base: community.id })
      const postFetcher = createZomeCall('posts/get_post')
      const posts = postAddresses.map(async address => ({
        id: address,
        ...await postFetcher({ address }),
        __typename: 'Post'
      }))

      return posts
    }
  },

  Post: {
    async comments (post, args, context, info) {
      const commentsAddressesFetcher = createZomeCall('comments/get_comments')
      const commentAddresses = await commentsAddressesFetcher({ base: post.id })
      const commentFetcher = createZomeCall('comments/get_comment')
      const comments = commentAddresses.map(async address => ({
        id: address,
        ...await commentFetcher({ address }),
        __typename: 'Comment'
      }))

      return comments
    }
  }
}

// * For apollo-link-schema usage
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

export default schema
