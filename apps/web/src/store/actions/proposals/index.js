import {
  ADD_PROPOSAL_VOTE,
  REMOVE_PROPOSAL_VOTE,
  SWAP_PROPOSAL_VOTE
} from 'store/constants'

export function addProposalVote ({ optionId, postId }) {
  return {
    type: ADD_PROPOSAL_VOTE,
    graphql: {
      query: `mutation ($optionId: ID, $postId: ID) {
        addProposalVote (optionId: $optionId, postId: $postId) {
          success
          error
        }
      }`,
      variables: { optionId, postId }
    },
    meta: {
      optionId,
      postId,
      optimistic: true
    }
  }
}

export function removeProposalVote ({ optionId, postId }) {
  return {
    type: REMOVE_PROPOSAL_VOTE,
    graphql: {
      query: `mutation ($optionId: ID, $postId: ID) {
        removeProposalVote (optionId: $optionId, postId: $postId) {
          success
          error
        }
      }`,
      variables: { optionId, postId }
    },
    meta: {
      optionId,
      postId,
      optimistic: true
    }
  }
}

export function swapProposalVote ({ postId, addOptionId, removeOptionId }) {
  return {
    type: SWAP_PROPOSAL_VOTE,
    graphql: {
      query: `mutation ($addOptionId: ID, $removeOptionId: ID, $postId: ID) {
        swapProposalVote (addOptionId: $addOptionId, removeOptionId: $removeOptionId, postId: $postId) {
          success
          error
        }
      }`,
      variables: { postId, addOptionId, removeOptionId }
    },
    meta: {
      postId,
      addOptionId,
      removeOptionId,
      optimistic: true
    }
  }
}
