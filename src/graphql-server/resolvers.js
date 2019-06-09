import zomeInterface from './zomeInterface'
import {
  toZomeData,
  toUiData,
  toUiQuerySet
} from './dataMapping'

export const resolvers = {
  Mutation: {
    async registerUser (_, userData) {
      const hcUserData = toZomeData('person', userData)
      const registeredUser = await zomeInterface.currentUser.create(hcUserData)

      return toUiData('person', registeredUser)
    },

    async createCommunity (_, { data: communityData }) {
      const hcCommunityData = toZomeData('community', communityData)
      const newCommunity = zomeInterface.createCommunity(hcCommunityData)

      return toUiData('community', newCommunity)
    },

    async createPost (_, { data: postData }) {
      const hcPostData = toZomeData('post', postData)
      const newPost = await zomeInterface.posts.create(hcPostData)

      return toUiData('post', newPost)
    },

    async createComment (_, { data: commentData }) {
      const hcCommentData = toZomeData('comment', commentData)
      const newComment = await zomeInterface.comments.create(hcCommentData)

      return toUiData('comment', newComment)
    }

    // createMessage(data: MessageInput): Message
    // findOrCreateThread(data: MessageThreadInput): MessageThread
  },

  Query: {
    async me () {
      return toUiData('person', await zomeInterface.currentUser.get())
    },

    async communities () {
      const communities = await zomeInterface.communities.all()

      return communities.map(community => toUiData('community', community))
    },

    async community (_, { slug }) {
      return toUiData('community', await zomeInterface.communities.getBySlug(slug))
    },

    async post (_, { id }) {
      return toUiData('post', await zomeInterface.posts.get(id))
    }
  },

  Community: {
    async posts (community) {
      const posts = await zomeInterface.posts.all(community.id)

      return toUiQuerySet(posts.map(post => toUiData('post', post)))
    }
  },

  Post: {
    async communities (post) {
      return [
        toUiData('community', await zomeInterface.communities.get(post.base))
      ]
    },

    async creator (post) {
      return toUiData('person', await zomeInterface.people.get(post.creator))
    },

    async comments (post) {
      const hcComments = await zomeInterface.comments.all(post.id)

      return toUiQuerySet(hcComments.map(comment => toUiData('comment', comment)))
    },

    async commenters (post) {
      const comments = await zomeInterface.comments.all(post.id)
      const commenterAddresses = []
      const commenters = await Promise.all(comments.map(({ creator }) => {
        if (commenterAddresses.includes(creator)) return null
        commenterAddresses.push(creator)
        return zomeInterface.people.get(creator)
      }))

      return commenters
        .filter(commenter => !!commenter)
        .map(commenter => toUiData('person', commenter))
    },

    async commentersTotal (post) {
      const comments = await zomeInterface.comments.all(post.id)
      const commenterAddresses = comments.map(comment => comment.creator)

      return new Set(commenterAddresses).size
    }
  },

  Comment: {
    async creator (comment) {
      return toUiData('person', await zomeInterface.people.get(comment.creator))
    }
  }
}
