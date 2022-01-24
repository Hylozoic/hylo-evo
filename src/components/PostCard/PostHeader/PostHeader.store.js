import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import gql from 'graphql-tag'

export const MODULE_NAME = 'PostHeader'

// Constants
export const DELETE_POST = `${MODULE_NAME}/DELETE_POST`
export const DELETE_POST_PENDING = DELETE_POST + '_PENDING'
export const REMOVE_POST = `${MODULE_NAME}/REMOVE_POST`
export const REMOVE_POST_PENDING = REMOVE_POST + '_PENDING'
export const PIN_POST = `${MODULE_NAME}/PIN_POST`
export const PIN_POST_PENDING = `${PIN_POST}_PENDING`
export const FULFILL_POST = `${MODULE_NAME}/FULFILL_POST`
export const FULFILL_POST_PENDING = `${MODULE_NAME}/FULFILL_POST_PENDING`

// Action Creators
export function deletePost (id, groupId) {
  return {
    type: DELETE_POST,
    graphql: {
      query: gql`
        mutation DeletePost($id: ID) {
          deletePost(id: $id) {
            success
          }
        }
      `,
      variables: {
        id
      }
    },
    meta: {
      optimistic: true,
      id,
      groupId
    }
  }
}

export function removePost (postId, slug) {
  return {
    type: REMOVE_POST,
    graphql: {
      query: gql`
        mutation RemovePost($postId: ID, $slug: String) {
          removePost(postId: $postId, slug: $slug) {
            success
          }
        }
      `,
      variables: {
        postId,
        slug
      }
    },
    meta: {
      optimistic: true,
      postId,
      slug
    }
  }
}

export function pinPost (postId, groupId) {
  return {
    type: PIN_POST,
    graphql: {
      query: gql`
        mutation PinPost($postId: ID, $groupId: ID) {
          pinPost(postId: $postId, groupId: $groupId) {
            success
          }
        }
      `,
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
      query: gql`
        mutation FullfillPost($postId: ID) {
          fulfillPost (postId: $postId) {
            success
          }
        }
      `,
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
    case DELETE_POST_PENDING:
      post = Post.withId(meta.id)
      if (meta.groupId) {
        const group = Group.withId(meta.groupId)
        removePostFromGroup(post, group)
      }
      post.delete()
      break

    case REMOVE_POST_PENDING: {
      post = Post.withId(meta.postId)
      const groups = post.groups.filter(c =>
        c.slug !== meta.slug).toModelArray()
      post.update({ groups })
      const group = Group.safeGet({ slug: meta.slug })
      removePostFromGroup(post, group)
      break
    }

    case PIN_POST_PENDING:
      post = Post.withId(meta.postId)
      // this line is to clear the selector memoization
      post.update({ _invalidate: (post._invalidate || 0) + 1 })
      let postMembership = post.postMemberships.filter(p =>
        Number(p.group) === Number(meta.groupId)).toModelArray()[0]
      postMembership && postMembership.update({ pinned: !postMembership.pinned })
  }
}
