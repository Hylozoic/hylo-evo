import { createZomeCall } from './holochainClient'

export const zomeInterface = {
  comments: {
    all: base => createZomeCall('comments/all_for_base')({ base }) || [],

    get: address => createZomeCall('comments/get')({ address }),

    create: createZomeCall('comments/create')
  },

  communities: {
    all: createZomeCall('communities/all'),

    get: address => createZomeCall('communities/get')({ address }),

    getBySlug: slug => createZomeCall('communities/get_by_slug')({ slug }),

    create: createZomeCall('communities/create')
  },

  currentUser: {
    create: async user => {
      return {
        ...await createZomeCall('people/register_user')(user),
        isRegistered: true
      }
    },

    get: async () => {
      return {
        ...await createZomeCall('people/get_me')(),
        isRegistered: await createZomeCall('people/is_registered')()
      }
    }
  },

  messages: {
    all: address => createZomeCall('messages/get_thread_messages')({ thread_address: address }),

    get: address => createZomeCall('messages/get')({ message_addr: address }),

    create: createZomeCall('messages/create')
  },

  messageThreads: {
    all: async () => {
      const addresses = await createZomeCall('messages/get_threads')()

      return Promise.all(addresses.map(
        messageThreadAddress => zomeInterface.messageThreads.get(messageThreadAddress)
      ))
    },

    get: async address => {
      return {
        address,
        participants: await zomeInterface.messageThreads.__getParticipants(address)
      }
    },

    create: async participantAddresses => {
      const address = await createZomeCall('messages/create_thread')({ participant_ids: participantAddresses })

      return {
        address,
        participants: await zomeInterface.messageThreads.__getParticipants(address)
      }
    },

    __getParticipants: async address => {
      const participantAddresses = await createZomeCall('messages/get_participants')({ thread_address: address })

      return Promise.all(participantAddresses.map(
        async participantAddress => zomeInterface.people.get(participantAddress)
      ))
    }
  },

  people: {
    all: createZomeCall('people/all'),

    get: agentId => createZomeCall('people/get')({ agent_id: agentId })
  },

  posts: {
    all: base => createZomeCall('posts/all_for_base')({ base }),

    get: address => createZomeCall('posts/get')({ address }),

    create: createZomeCall('posts/create')
  }
}

export default zomeInterface
