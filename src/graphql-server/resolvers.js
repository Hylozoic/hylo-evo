import zomeInterface from './zomeInterface'
import {
  toUiData,
  toUiQuerySet,
  dataMappedCall
} from './dataMapping'

export const resolvers = {
  Mutation: {
    async registerUser (_, userData) {
      return dataMappedCall('person', userData, zomeInterface.currentUser.create)
    },

    async createCommunity (_, { data: communityData }) {
      return dataMappedCall('community', communityData, zomeInterface.communities.create)
    },

    async createPost (_, { data: postData }) {
      return dataMappedCall('post', postData, zomeInterface.posts.create)
    },

    async createComment (_, { data: commentData }) {
      return dataMappedCall('comment', commentData, zomeInterface.comments.create)
    },

    async findOrCreateThread (_, { data: { participantIds } }) {
      return dataMappedCall('messageThread', participantIds, zomeInterface.messageThreads.create)
    },

    async createMessage (_, { data: messageData }) {
      return dataMappedCall('message', messageData, zomeInterface.messages.create)
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

      return toUiQuerySet(people.map(person =>
        toUiData('person', person)
      ))
    },

    async messageThread (_, { id }) {
      return toUiData('messageThread', await zomeInterface.messageThreads.get(id))
    }
  },

  Comment: {
    async creator ({ creator }) {
      return toUiData('person', await zomeInterface.people.get(creator))
    }
  },

  Community: {
    async posts ({ id }) {
      const posts = await zomeInterface.posts.all(id)

      return toUiQuerySet(posts.map(post =>
        toUiData('post', post)
      ))
    }
  },

  Me: {
    async messageThreads () {
      const messageThreads = await zomeInterface.messageThreads.all()

      return toUiQuerySet(messageThreads.map(messageThread =>
        toUiData('messageThread', messageThread)
      ))
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

      return toUiQuerySet(messages.map(message =>
        toUiData('message', message)
      ))
    },

    async participants ({ participants }) {
      return participants.map(participant => toUiData('person', participant))
    }
  },

  Post: {
    async communities ({ communityId }) {
      return [
        toUiData('community', await zomeInterface.communities.get(communityId))
      ]
    },

    async creator ({ creator }) {
      return toUiData('person', await zomeInterface.people.get(creator))
    },

    async comments ({ id }) {
      const zomeComments = await zomeInterface.comments.all(id)

      return toUiQuerySet(zomeComments.map(comment =>
        toUiData('comment', comment)
      ))
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
  }
}

export default resolvers
