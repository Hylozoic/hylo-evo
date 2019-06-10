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
      const newCommunity = zomeInterface.communities.create(hcCommunityData)

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
    },

    async findOrCreateThread (_, { data: { participantIds } }) {
      const messageThread = await zomeInterface.messageThreads.create(participantIds)

      return toUiData('messageThread', messageThread)
    },

    async createMessage (_, { data: messageData }) {
      const hcMessageData = toZomeData('message', messageData)
      const newMessage = await zomeInterface.messages.create(hcMessageData)

      return toUiData('message', newMessage)
    }
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
    },

    async people () {
      const people = await zomeInterface.people.all()

      return toUiQuerySet(people.map(person => toUiData('person', person)))
    },

    async messageThread (_, { id }) {
      return toUiData('messageThread', await zomeInterface.messageThreads.get(id))
    }
  },

  Me: {
    async messageThreads () {
      const messageThreads = await zomeInterface.messageThreads.all()

      return toUiQuerySet(
        messageThreads.map(messageThread => {
          return toUiData('messageThread', messageThread)
        })
      )
    }
  },

  Community: {
    async posts ({ id }) {
      const posts = await zomeInterface.posts.all(id)

      return toUiQuerySet(posts.map(post => toUiData('post', post)))
    }
  },

  Message: {
    async creator ({ creator }) {
      return toUiData('person', await zomeInterface.people.get(creator))
    }
  },

  MessageThread: {
    async messages ({ id }) {
      const messages = await zomeInterface.messages.all(id)

      return toUiQuerySet(messages.map(message => toUiData('message', message)))
    },

    async participants ({ participants }) {
      return participants.map(participant => toUiData('person', participant))
    }
  },

  Post: {
    async communities ({ base }) {
      return [
        toUiData('community', await zomeInterface.communities.get(base))
      ]
    },

    async creator ({ creator }) {
      return toUiData('person', await zomeInterface.people.get(creator))
    },

    async comments ({ id }) {
      const hcComments = await zomeInterface.comments.all(id)

      return toUiQuerySet(hcComments.map(comment => toUiData('comment', comment)))
    },

    async commenters ({ id }) {
      const comments = await zomeInterface.comments.all(id)
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

    async commentersTotal ({ id }) {
      const comments = await zomeInterface.comments.all(id)
      const commenterAddresses = comments.map(comment => comment.creator)

      return new Set(commenterAddresses).size
    }
  },

  Comment: {
    async creator ({ creator }) {
      return toUiData('person', await zomeInterface.people.get(creator))
    }
  }
}

export default resolvers
