import { makeExecutableSchema } from 'graphql-tools'
import { get } from 'lodash/fp'
import { currentDateString } from 'util/holochain'
import { createZomeCall } from 'client/holochainClient'
import typeDefs from './schema.graphql'

function hcToHyloPostData (hcPost) {
  return {
    ...hcPost,
    type: hcPost.post_type,
    createdAt: hcPost.timestamp
  }
}

function hcToHyloCommentData (hcComment) {
  return {
    ...hcComment,
    createdAt: hcComment.timestamp
  }
}

async function personFetcher (address) {
  const graphqlFetcher = createZomeCall('graphql/graphql', { resultParser: JSON.parse })
  const personQueryString = `query CreatorQuery($id: ID) {
    person (id: $id) {
      id
      name
      avatarUrl
    }
  }`
  const queryResult = await graphqlFetcher({ query: personQueryString, variables: { id: address } })

  return get('person', queryResult)
}

export const resolvers = {
  Mutation: {
    async createPost (_, { data }) {
      const defaultPostData = {
        announcement: false,
        timestamp: currentDateString()
      }
      const communityAddressFetcher = createZomeCall('community/get_community_address_by_slug')
      const communityAddress = await communityAddressFetcher({ slug: data.communitySlug })
      const postData = {
        ...defaultPostData,
        base: communityAddress,
        title: data.title,
        details: data.details,
        post_type: data.type,
        timestamp: data.createdAt
      }
      const createPost = createZomeCall('posts/create_post')
      const newPostAddress = await createPost(postData)
      const postFetcher = createZomeCall('posts/get_post')
      const post = await postFetcher({ address: newPostAddress })

      return {
        id: newPostAddress,
        ...post
      }
    }

    // createComment(data: CommentInput): Comment
    // createCommunity(data: CommunityInput): Community
    // createMessage(data: MessageInput): Message
    // findOrCreateThread(data: MessageThreadInput): MessageThread
    // registerUser(name: String, avatarUrl: String): Person
  },
  Query: {
    async me () {
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

    async communities (_, args, context) {
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

    async community (_, { slug }) {
      const communityAddressFetcher = createZomeCall('community/get_community_address_by_slug')
      const communityAddress = await communityAddressFetcher({ slug })
      const communityFetcher = createZomeCall('community/get_community')
      const community = await communityFetcher({ address: communityAddress })

      return {
        id: communityAddress,
        ...community
      }
    },

    async post (_, { id }) {
      const postFetcher = createZomeCall('posts/get_post')
      const post = await postFetcher({ address: id })

      return {
        id,
        ...hcToHyloPostData(post)
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
        ...hcToHyloPostData(await postFetcher({ address }))
      })))

      return {
        total: posts.length,
        items: posts,
        hasMore: false
      }
    }
  },

  Post: {
    async communities (post, args, context) {
      const communityFetcher = createZomeCall('community/get_community')
      const community = await communityFetcher({ address: post.base })

      return [
        {
          id: post.base,
          ...community
        }
      ]
    },

    async creator (post) {
      const creator = await personFetcher(post.creator)

      return creator
    },

    async comments (post) {
      const commentsAddressesFetcher = createZomeCall('comments/get_comments')
      const commentAddresses = await commentsAddressesFetcher({ base: post.id })
      const commentFetcher = createZomeCall('comments/get_comment')
      const comments = await Promise.all(commentAddresses.map(async address => ({
        id: address,
        ...hcToHyloCommentData(await commentFetcher({ address })),
        attachments: []
      })))

      return {
        total: comments.length,
        items: comments
      }
    },

    async commenters (post) {
      const commentsAddressesFetcher = createZomeCall('comments/get_comments')
      const commentAddresses = await commentsAddressesFetcher({ base: post.id })
      const commentFetcher = createZomeCall('comments/get_comment')
      const commenterAddresses = []
      const commenters = await Promise.all(
        commentAddresses.map(async address => {
          const comment = await commentFetcher({ address })
          const commenterAddress = comment.creator

          if (commenterAddresses.includes(commenterAddress)) return null

          commenterAddresses.push(commenterAddress)
          const commenter = await personFetcher(commenterAddress)

          return {
            id: commenterAddress,
            ...commenter
          }
        })
      )

      return commenters.filter(commenter => !!commenter)
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
      const creator = await personFetcher(comment.creator)

      return creator
    }
  }
}

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

export default schema
