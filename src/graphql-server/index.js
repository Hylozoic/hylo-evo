import { makeExecutableSchema } from 'graphql-tools'
import { get } from 'lodash/fp'
import { createZomeCall } from 'client/holochainClient'
import typeDefs from './schema.graphql'

export const resolvers = {
  Query: {
    async me (_, args, context, info) {
      const graphqlFetcher = createZomeCall('graphql/graphql', { resultParser: JSON.parse })
      const meQueryString = `query HolochainCurrentAgentQuery {
        me {
          id
          name
          avatarUrl
          isRegistered
        }
      }`
      const queryResult = await graphqlFetcher({ query: meQueryString, variables: {} })
      const me = get('me', queryResult)

      return {
        ...me
      }
    },

    async communities (_, args, context, info) {
      const communityAddressesFetcher = createZomeCall('community/get_communitys')
      const communityAddresses = await communityAddressesFetcher()
      const communityFetcher = createZomeCall('community/get_community')
      const communities = await Promise.all(
        communityAddresses.map(async address => ({
          id: address,
          ...await communityFetcher({ address })
        }))
      )

      return communities
    },

    async community (root, { slug }, context, info) {
      const communityAddressFetcher = createZomeCall('community/get_community_address_by_slug')
      const communityAddress = await communityAddressFetcher({ slug })
      const communityResultFetcher = createZomeCall('community/get_community')
      const community = await communityResultFetcher({ address: communityAddress })

      return {
        id: communityAddress,
        ...community
      }
    },

    async post (_, { id }, context, info) {
      const postFetcher = createZomeCall('posts/get_post')
      const post = await postFetcher({ address: id })

      return {
        id,
        ...post
      }
    }
  },

  Community: {
    async posts (community) {
      const postsAddressesFetcher = createZomeCall('posts/get_posts')
      const postAddresses = await postsAddressesFetcher({ base: community.id })
      const postFetcher = createZomeCall('posts/get_post')
      const posts = await Promise.all(postAddresses.map(async address => ({
        id: address,
        ...await postFetcher({ address })
      })))

      return {
        total: posts.length,
        items: posts,
        hasMore: false
      }
    }
  },

  Post: {
    async creator (post) {
      const graphqlFetcher = createZomeCall('graphql/graphql', { resultParser: JSON.parse })
      const personQueryString = `query CreatorQuery($id: ID) {
        person (id: $id) {
          id
          name
          avatarUrl
        }
      }`
      const queryResult = await graphqlFetcher({ query: personQueryString, variables: { id: post.creator } })
      const creator = get('person', queryResult)

      return creator
    },

    async comments (post) {
      const commentsAddressesFetcher = createZomeCall('comments/get_comments')
      const commentAddresses = await commentsAddressesFetcher({ base: post.id })
      const commentFetcher = createZomeCall('comments/get_comment')
      const comments = await Promise.all(commentAddresses.map(async address => ({
        id: address,
        ...await commentFetcher({ address }),
        attachments: []
      })))

      return {
        total: comments.length,
        items: comments
      }
    },

    async commentersTotal (post) {
      const commentsAddressesFetcher = createZomeCall('comments/get_comments')
      const commentAddresses = await commentsAddressesFetcher({ base: post.id })
      const commentFetcher = createZomeCall('comments/get_comment')
      const commentCreatorIds = await Promise.all(
        commentAddresses.map(address => commentFetcher({ address }).creator)
      )

      return new Set(commentCreatorIds).size
    }
  },

  Comment: {
    async creator (comment) {
      const graphqlFetcher = createZomeCall('graphql/graphql', { resultParser: JSON.parse })
      const personQueryString = `query CreatorQuery($id: ID) {
        person (id: $id) {
          id
          name
          avatarUrl
        }
      }`
      const queryResult = await graphqlFetcher({ query: personQueryString, variables: { id: comment.creator } })
      const creator = get('person', queryResult)

      return creator
    }
  }
}

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

export default schema
