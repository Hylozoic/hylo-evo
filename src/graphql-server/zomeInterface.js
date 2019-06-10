import { createZomeCall } from './holochainClient'

export const zomeInterface = {
  comments: {
    all: async base => {
      const addresses = await createZomeCall('comments/get_comments')({ base }) || []

      return Promise.all(
        addresses.map(address => zomeInterface.comments.get(address))
      )
    },

    get: async address => {
      return {
        address,
        ...await createZomeCall('comments/get_comment')({ address })
      }
    },

    create: async comment => {
      const address = await createZomeCall('comments/create_comment')({ comment })
      const newComment = await zomeInterface.comments.get(address)

      return {
        address,
        post: newComment.base,
        creator: newComment.creator
      }
    }
  },

  communities: {
    all: async () => {
      const addresses = await createZomeCall('community/get_communities')()

      return Promise.all(
        addresses.map(address => zomeInterface.communities.get(address))
      )
    },

    get: async address => {
      return {
        address,
        ...await createZomeCall('community/get_community')({ address })
      }
    },

    getBySlug: async slug => {
      const address = await createZomeCall('community/get_community_address_by_slug')({ slug })

      return {
        address,
        ...await createZomeCall('community/get_community')({ address })
      }
    },

    create: async community => {
      const address = await createZomeCall('community/create_community')(community)

      return zomeInterface.communities.get(address)
    }
  },

  currentUser: {
    create: async user => {
      const agentId = await createZomeCall('identity/register_user')(user)

      return {
        ...await zomeInterface.people.get(agentId),
        isRegistered: true
      }
    },

    get: async () => {
      const agentId = await createZomeCall('identity/get_me')()

      return {
        ...await zomeInterface.people.get(agentId),
        isRegistered: await createZomeCall('identity/is_registered')()
      }
    }
  },

  messages: {
    all: async (address) => {
      const addresses = await createZomeCall('chat/get_thread_messages')({ thread_addr: address })
      return Promise.all(
        addresses.map(async address => zomeInterface.messages.get(address))
      )
    },

    get: async (address) => {
      return {
        address,
        ...await createZomeCall('chat/get_message')({ message_addr: address })
      }
    },

    create: async (message) => {
      const address = await createZomeCall('chat/post_message_to_thread')(message)
      const creator = await createZomeCall('identity/get_me')()

      return {
        address,
        creator,
        ...message
      }
    }
  },

  messageThreads: {
    all: async () => {
      const addresses = await createZomeCall('chat/get_my_threads')()

      return Promise.all(addresses.map(async messageThreadAddress =>
        zomeInterface.messageThreads.get(messageThreadAddress)
      ))
    },

    get: async (address) => {
      return {
        address,
        participants: await zomeInterface.messageThreads.__getMessageThreadParticipants(address)
      }
    },

    create: async (participantAddresses) => {
      const address = await createZomeCall('chat/get_or_create_thread')({ participant_ids: participantAddresses })

      return {
        address,
        participants: await zomeInterface.messageThreads.__getMessageThreadParticipants(address)
      }
    },

    // TODO: move this to it's own domain or MAYBE put it as a graphql field resolver instead
    __getMessageThreadParticipants: async (address) => {
      const participantAddresses = await createZomeCall('chat/get_thread_participants')({ thread_addr: address })

      return Promise.all(participantAddresses.map(
        async participantAddress => zomeInterface.people.get(participantAddress)
      ))
    }
  },

  people: {
    all: async () => {
      const addresses = await createZomeCall('identity/get_people')()

      return Promise.all(
        addresses.map(address => zomeInterface.people.get(address))
      )
    },

    get: async agentId => {
      return {
        agent_id: agentId,
        ...await createZomeCall('identity/get_identity')({ agent_id: agentId })
      }
    }
  },

  posts: {
    all: async base => {
      const addresses = await createZomeCall('posts/get_posts')({ base })

      return Promise.all(
        addresses.map(address => zomeInterface.posts.get(address))
      )
    },

    get: async address => {
      const post = await createZomeCall('posts/get_post')({ address })

      return {
        address,
        creator: await zomeInterface.people.get(post.creator),
        ...post
      }
    },

    create: async post => {
      const base = await createZomeCall('community/get_community_address_by_slug')({
        slug: post.communitySlug
      })
      const address = await createZomeCall('posts/create_post')({
        base,
        ...post
      })

      return {
        base,
        address,
        ...post,
        // TODO: fix this
        community: {
          slug: post.communitySlug,
          address: base
        }
      }
    }

  }
}

export default zomeInterface
