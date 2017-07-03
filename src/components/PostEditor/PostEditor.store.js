import { get } from 'lodash/fp'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import linkMatcher from 'util/linkMatcher'

export const MODULE_NAME = 'PostEditor'
export const CREATE_POST = `${MODULE_NAME}/CREATE_POST`
export const UPDATE_POST = `${MODULE_NAME}/UPDATE_POST`
export const FETCH_LINK_PREVIEW = `${MODULE_NAME}/FETCH_LINK_PREVIEW`
export const REMOVE_LINK_PREVIEW = `${MODULE_NAME}/REMOVE_LINK_PREVIEW`
export const RESET_LINK_PREVIEW = `${MODULE_NAME}/RESET_LINK_PREVIEW`

// Actions

export function createPost (post) {
  const { type, title, details, communities, linkPreview } = post
  const linkPreviewId = linkPreview && linkPreview.id
  const communityIds = communities.map(c => c.id)
  return {
    type: CREATE_POST,
    graphql: {
      query: `mutation ($type: String, $title: String, $details: String, $linkPreviewId: String, $communityIds: [String]) {
        createPost(data: {type: $type, title: $title, details: $details, linkPreviewId: $linkPreviewId, communityIds: $communityIds}) {
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
          linkPreview {
            id
          }
        }
      }`,
      variables: {
        type,
        title,
        details,
        linkPreviewId,
        communityIds
      }
    },
    meta: {extractModel: 'Post'}
  }
}

export function updatePost (post) {
  const { id, type, title, details, communities, linkPreview } = post
  const linkPreviewId = linkPreview && linkPreview.id
  const communityIds = communities.map(c => c.id)
  return {
    type: UPDATE_POST,
    graphql: {
      query: `mutation ($id: ID, $type: String, $title: String, $details: String, $linkPreviewId: String, $communityIds: [String]) {
        updatePost(id: $id, data: {type: $type, title: $title, details: $details, linkPreviewId: $linkPreviewId, communityIds: $communityIds}) {
          id
          type
          title
          details
          linkPreview {
            id
          }
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
        linkPreviewId,
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

export function fetchLinkPreview (url) {
  return {
    type: FETCH_LINK_PREVIEW,
    graphql: {
      query: `mutation ($url: String) {
        findOrCreateLinkPreviewByUrl(data: {url: $url}) {
          id
          url
          imageUrl
          title
          description
          imageWidth
          imageHeight
          status
        }
      }`,
      variables: {
        url
      }
    },
    meta: {
      extractModel: {
        modelName: 'LinkPreview',
        getRoot: get('findOrCreateLinkPreviewByUrl')
      }
    }
  }
}

export function pollingFetchLinkPreview (dispatch, htmlContent) {
  const poll = (url, delay) => {
    if (delay > 4) return
    dispatch(fetchLinkPreview(url)).then(value => {
      if (!value) return
      const linkPreviewFound = value.meta.extractModel.getRoot(value.payload.data)
      if (!linkPreviewFound) {
        setTimeout(() => poll(url, delay * 2), delay * 1000)
      }
    })
  }
  if (linkMatcher.test(htmlContent)) {
    const urlMatch = linkMatcher.match(htmlContent)[0].url
    poll(urlMatch, 0.5)
  }
}

export function removeLinkPreview () {
  return {type: REMOVE_LINK_PREVIEW}
}

export function resetLinkPreview () {
  return {type: RESET_LINK_PREVIEW}
}

// Selectors

export const getLinkPreview = ormCreateSelector(
  orm,
  state => state.orm,
  state => state[MODULE_NAME],
  ({ LinkPreview }, { linkPreviewId }) =>
    LinkPreview.hasId(linkPreviewId) ? LinkPreview.withId(linkPreviewId).ref : null
)

// Reducer

export const defaultState = {linkPreviewId: null, linkPreviewStatus: null}

export default function reducer (state = defaultState, action) {
  const { error, type, payload, meta } = action
  if (error) return state

  switch (type) {
    case FETCH_LINK_PREVIEW:
      const linkPreview = (meta.extractModel.getRoot(payload.data))
      if (linkPreview && !linkPreview.title) {
        return {...state, linkPreviewId: null, linkPreviewStatus: 'invalid'}
      }
      return {...state, linkPreviewId: get('id')(linkPreview)}
    case REMOVE_LINK_PREVIEW:
      return {...state, linkPreviewId: null, linkPreviewStatus: 'removed'}
    case RESET_LINK_PREVIEW:
      // if (!state.linkPreviewStatus) return state
      return {...state, linkPreviewId: null, linkPreviewStatus: 'reset'}
    default:
      return state
  }
}
