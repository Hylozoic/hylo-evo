import { createZomeCall } from 'client/holochainClient'

export const zomeInterface = {
  communities: {
    all: async () => {
      const addresses = await createZomeCall('community/get_communitys')()

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
        community: {
          slug: post.communitySlug,
          address: base
        }
      }
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

  people: {
    get: async agentId => {
      return {
        agent_id: agentId,
        ...await createZomeCall('identity/get_identity')({ agent_id: agentId })
      }
    }
  },

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
  }
}

export default zomeInterface
