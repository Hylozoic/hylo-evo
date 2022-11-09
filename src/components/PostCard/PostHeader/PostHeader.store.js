import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'

export const MODULE_NAME = 'PostHeader'

// Constants
export const PIN_POST = `${MODULE_NAME}/PIN_POST`
export const PIN_POST_PENDING = `${PIN_POST}_PENDING`
export const FULFILL_POST = `${MODULE_NAME}/FULFILL_POST`
export const FULFILL_POST_PENDING = `${MODULE_NAME}/FULFILL_POST_PENDING`
export const UNFULFILL_POST = `${MODULE_NAME}/UNFULFILL_POST`
export const UNFULFILL_POST_PENDING = `${MODULE_NAME}/UNFULFILL_POST_PENDING`

export function pinPost (postId, groupId) {
  return {
    type: PIN_POST,
    graphql: {
      query: `mutation ($postId: ID, $groupId: ID) {
        pinPost(postId: $postId, groupId: $groupId) {
          success
        }
      }`,
      variables: {
        postId,
        groupId
      }
    },
    meta: {
      optimistic: true,
      postId,
      groupId
    }
  }
}

export function fulfillPost (postId) {
  return {
    type: FULFILL_POST,
    graphql: {
      query: `mutation ($postId: ID) {
        fulfillPost (postId: $postId) {
          success
        }
      }`,
      variables: {
        postId
      }
    },
    meta: {
      optimistic: true,
      postId
    }
  }
}

export function unfulfillPost (postId) {
  return {
    type: UNFULFILL_POST,
    graphql: {
      query: `mutation ($postId: ID) {
        unfulfillPost (postId: $postId) {
          success
        }
      }`,
      variables: {
        postId
      }
    },
    meta: {
      optimistic: true,
      postId
    }
  }
}

export const getGroup = ormCreateSelector(
  orm,
  (_, { routeParams }) => routeParams,
  (session, { groupSlug }) => session.Group.safeGet({ slug: groupSlug })
)

// XXX: this is ugly, would be better to load these posts through redux-orm "queries" so they update automatically
const removePostFromGroup = (post, group) => {
  if (post && group) {
    if (post.announcement) {
      group.update({ announcements: group.announcements.filter(p => p.id !== post.id).toModelArray() })
    }
    if (post.type === 'request' || post.type === 'offer') {
      group.update({ openOffersAndRequests: group.openOffersAndRequests.filter(p => p.id !== post.id).toModelArray() })
    } else if (post.type === 'event') {
      group.update({ upcomingEvents: group.upcomingEvents.filter(p => p.id !== post.id).toModelArray() })
    } else if (post.type === 'project') {
      group.update({ activeProjects: group.activeProjects.filter(p => p.id !== post.id).toModelArray() })
    }
  }
}

export function ormSessionReducer ({ Group, Post }, { type, meta }) {
  let post
  switch (type) {
    case PIN_POST_PENDING:
      post = Post.withId(meta.postId)
      // this line is to clear the selector memoization
      post.update({ _invalidate: (post._invalidate || 0) + 1 })
      let postMembership = post.postMemberships.filter(p =>
        Number(p.group) === Number(meta.groupId)).toModelArray()[0]
      postMembership && postMembership.update({ pinned: !postMembership.pinned })
      break

    case FULFILL_POST_PENDING:
      post = Post.withId(meta.postId)
      post.update({ fulfilledAt: (new Date()).toISOString() })
      break

    case UNFULFILL_POST_PENDING:
      post = Post.withId(meta.postId)
      post.update({ fulfilledAt: null })
      break
  }
}
