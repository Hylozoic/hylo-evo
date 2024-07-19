import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { FULFILL_POST, UNFULFILL_POST, UNFULFILL_POST_PENDING, FULFILL_POST_PENDING, UPDATE_PROPOSAL_OUTCOME } from 'store/constants'

export const MODULE_NAME = 'PostHeader'

// Constants
export const PIN_POST = `${MODULE_NAME}/PIN_POST`
export const PIN_POST_PENDING = `${PIN_POST}_PENDING`

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

export function updateProposalOutcome (postId, proposalOutcome) {
  return {
    type: UPDATE_PROPOSAL_OUTCOME,
    graphql: {
      query: `mutation ($postId: ID, $proposalOutcome: String) {
        updateProposalOutcome (postId: $postId, proposalOutcome: $proposalOutcome) {
          success
        }
      }`,
      variables: {
        postId,
        proposalOutcome
      }
    },
    meta: {
      optimistic: true,
      postId,
      proposalOutcome
    }
  }
}

export const getGroup = ormCreateSelector(
  orm,
  (_, { routeParams }) => routeParams,
  (session, { groupSlug }) => session.Group.safeGet({ slug: groupSlug })
)

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
