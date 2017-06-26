import { get } from 'lodash/fp'

export const MODULE_NAME = 'PostEditor'
export const CREATE_POST = `${MODULE_NAME}/CREATE_POST`
export const UPDATE_POST = `${MODULE_NAME}/UPDATE_POST`
export const FETCH_LINK_PREVIEW = `${MODULE_NAME}/FETCH_LINK_PREVIEW`

export function createPost (post) {
  const { type, title, details, communities } = post
  const communityIds = communities.map(c => c.id)
  return {
    type: CREATE_POST,
    graphql: {
      query: `mutation ($type: String, $title: String, $details: String, $communityIds: [String]) {
        createPost(data: {type: $type, title: $title, details: $details, communityIds: $communityIds}) {
          id
          type
          title
          details
          commentersTotal
          communities {
            id
            name
            slug
          }
          creator {
            id
          }
        }
      }`,
      variables: {
        type,
        title,
        details,
        communityIds
      }
    },
    meta: {extractModel: 'Post'}
  }
}

export function updatePost (post) {
  const { id, type, title, details, communities } = post
  const communityIds = communities.map(c => c.id)
  return {
    type: UPDATE_POST,
    graphql: {
      query: `mutation ($id: ID, $type: String, $title: String, $details: String, $communityIds: [String]) {
        updatePost(id: $id, data: {type: $type, title: $title, details: $details, communityIds: $communityIds}) {
          id
          type
          title
          details
          communities {
            id
            name
            slug
          }
        }
      }`,
      variables: {
        id,
        type,
        title,
        details,
        communityIds
      }
    },
    meta: {
      extractModel: {
        modelName: 'Post',
        getRoot: get('updatePost'),
        append: false
      }
    }
  }
}

export function fetchLinkPreview (linkPreview) {
  // const { id, linkPreview } = post
  return {
    type: FETCH_LINK_PREVIEW,
    payload: {
      linkPreview
    }
    // graphql: {
    //   query: `mutation ($id: ID, $linkPreview: String) {
    //     linkPreview(id: $id, data: {linkPreview: $linkPreview}) {
    //       id
    //       linkPreview
    //     }
    //   }`,
    //   variables: {
    //     id,
    //     linkPreview
    //   }
    // },
    // meta: {
    //   extractModel: {
    //     modelName: 'Post',
    //     getRoot: get('updatePost'),
    //     append: false
    //   }
    // }
  }
}

const defaultState = {}

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case FETCH_LINK_PREVIEW:
      return {...state, linkPreview: payload.linkPreview}
    default:
      return state
  }
}
