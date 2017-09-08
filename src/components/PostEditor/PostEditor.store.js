import { get, pullAt } from 'lodash/fp'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import linkMatcher from 'util/linkMatcher'

export const MODULE_NAME = 'PostEditor'
export const CREATE_POST = `${MODULE_NAME}/CREATE_POST`
export const UPDATE_POST = `${MODULE_NAME}/UPDATE_POST`
export const FETCH_LINK_PREVIEW = `${MODULE_NAME}/FETCH_LINK_PREVIEW`
export const REMOVE_LINK_PREVIEW = `${MODULE_NAME}/REMOVE_LINK_PREVIEW`
export const RESET_LINK_PREVIEW = `${MODULE_NAME}/RESET_LINK_PREVIEW`
export const SET_IMAGE_PREVIEWS = `${MODULE_NAME}/SET_IMAGE_PREVIEWS`
export const REMOVE_IMAGE_PREVIEW = `${MODULE_NAME}/REMOVE_IMAGE_PREVIEW`
export const SWITCH_IMAGE_PREVIEWS = `${MODULE_NAME}/SWITCH_IMAGE_PREVIEWS`

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

export function setImagePreviews (imagePreviews) {
  return {
    type: SET_IMAGE_PREVIEWS,
    payload: imagePreviews
  }
}

export function removeImagePreview (position) {
  return {
    type: REMOVE_IMAGE_PREVIEW,
    payload: position
  }
}

export function switchImagePreviews (position1, position2) {
  return {
    type: SWITCH_IMAGE_PREVIEWS,
    payload: {
      position1,
      position2
    }
  }
}

// Selectors

export const getLinkPreview = ormCreateSelector(
  orm,
  state => state.orm,
  state => state[MODULE_NAME],
  ({ LinkPreview }, { linkPreviewId }) =>
    LinkPreview.hasId(linkPreviewId) ? LinkPreview.withId(linkPreviewId).ref : null
)

export function getImagePreviews (state) {
  return state[MODULE_NAME].imagePreviews
}

// Reducer

export const defaultState = {
  linkPreviewId: null,
  linkPreviewStatus: null,
  imagePreviews: [
    'http://www.sftravel.com/sites/sftraveldev.prod.acquia-sites.com/files/styles/sft_views_background_mobile/public/landmark-images/golden-gate_web.jpg?itok=wcIdLd3y&timestamp=1499715987',
    'https://www.thesun.co.uk/wp-content/uploads/2017/05/nintchdbpict000290298948.jpg?strip=all&w=960',
    'https://i.ytimg.com/vi/SfLV8hD7zX4/maxresdefault.jpg',
    'https://www.rover.com/blog/wp-content/uploads/2016/07/pug-superheroes.jpg',
    'https://www.rover.com/blog/wp-content/uploads/2015/05/dog-candy-junk-food-599x340.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/American_Eskimo_Dog_1.jpg/1200px-American_Eskimo_Dog_1.jpg'
  ]
}

export default function reducer (state = defaultState, action) {
  const { error, type, payload, meta } = action
  if (error) return state

  switch (type) {
    case FETCH_LINK_PREVIEW:
      const linkPreview = (meta.extractModel.getRoot(payload.data))
      if (linkPreview && !linkPreview.title) {
        return {...state, linkPreviewId: null, linkPreviewStatus: 'invalid'}
      }
      return {...state, linkPreviewId: get('id')(linkPreview), linkPreviewStatus: null}
    case REMOVE_LINK_PREVIEW:
      return {...state, linkPreviewId: null, linkPreviewStatus: 'removed'}
    case RESET_LINK_PREVIEW:
      return {...state, linkPreviewId: null, linkPreviewStatus: 'reset'}
    case SET_IMAGE_PREVIEWS:
      return {...state, imagePreviews: payload}
    case REMOVE_IMAGE_PREVIEW:
      return {...state, imagePreviews: pullAt(payload, state.imagePreviews)}
    case SWITCH_IMAGE_PREVIEWS:
      const { position1, position2 } = payload
      const tmp = state.imagePreviews[position1]
      const imagePreviews = state.imagePreviews
      imagePreviews[position1] = imagePreviews[position2]
      imagePreviews[position2] = tmp
      return {
        ...state,
        imagePreviews
      }
    default:
      return state
  }
}
