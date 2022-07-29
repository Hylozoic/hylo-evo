import { get } from 'lodash/fp'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import linkMatcher from 'util/linkMatcher'

export const MODULE_NAME = 'PostEditor'
export const FETCH_LINK_PREVIEW = `${MODULE_NAME}/FETCH_LINK_PREVIEW`
export const REMOVE_LINK_PREVIEW = `${MODULE_NAME}/REMOVE_LINK_PREVIEW`
export const CLEAR_LINK_PREVIEW = `${MODULE_NAME}/CLEAR_LINK_PREVIEW`
export const ANNOUNCEMENT = `${MODULE_NAME}/ANNOUNCEMENT`
export const SHOW_ANNOUNCEMENT_CONFIRMATION = `${MODULE_NAME}/SHOW_ANNOUNCEMENT_CONFIRMATION`
export const SET_ANNOUNCEMENT = `${MODULE_NAME}/SET_ANNOUNCEMENT`

// Actions

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

export async function pollingFetchLinkPreview (dispatch, contentText) {
  const MAX_RETRIES = 4
  const poll = async (url, retry = 1) => {
    if (retry > MAX_RETRIES) return

    const value = await dispatch(fetchLinkPreview(url))

    if (!value) return

    const linkPreviewFound = value.meta.extractModel.getRoot(value.payload.data)

    if (!linkPreviewFound) {
      setTimeout(() => poll(url, retry + 1), retry * 0.5 * 1000)
    }
  }

  if (linkMatcher.test(contentText)) {
    // const linksHTML = TextHelpers.sanitizeHTML(htmlContent, {
    //   allowedTags: ['a'],
    //   allowedAttributes: { a: ['href'] }
    // })
    const linksFound = linkMatcher.match(contentText)
    const urlMatch = linksFound[0].url

    poll(urlMatch)
  }
}

export function removeLinkPreview () {
  return { type: REMOVE_LINK_PREVIEW }
}

export function clearLinkPreview () {
  return { type: CLEAR_LINK_PREVIEW }
}

export function showAnnouncementConfirmation (bool) {
  return {
    type: SHOW_ANNOUNCEMENT_CONFIRMATION,
    payload: bool
  }
}

export function setAnnouncement (bool) {
  return {
    type: SET_ANNOUNCEMENT,
    payload: bool
  }
}

// Selectors

export const getLinkPreview = ormCreateSelector(
  orm,
  state => state[MODULE_NAME],
  ({ LinkPreview }, { linkPreviewId }) =>
    LinkPreview.idExists(linkPreviewId) ? LinkPreview.withId(linkPreviewId).ref : null
)

// Reducer

export const defaultState = {
  linkPreviewId: null,
  linkPreviewStatus: null
}

export default function reducer (state = defaultState, action) {
  const { error, type, payload, meta } = action

  if (error) return state

  switch (type) {
    case FETCH_LINK_PREVIEW: {
      const linkPreview = meta.extractModel.getRoot(payload.data)

      if (linkPreview && !linkPreview.title) {
        return { ...state, linkPreviewId: null, linkPreviewStatus: 'invalid' }
      }
      return { ...state, linkPreviewId: get('id')(linkPreview), linkPreviewStatus: null }
    }
    case REMOVE_LINK_PREVIEW: {
      return { ...state, linkPreviewId: null, linkPreviewStatus: 'removed' }
    }
    case CLEAR_LINK_PREVIEW: {
      return { ...state, linkPreviewId: null, linkPreviewStatus: 'cleared' }
    }
    case SHOW_ANNOUNCEMENT_CONFIRMATION: {
      return { ...state, showAnnouncementConfirmation: payload }
    }
    case SET_ANNOUNCEMENT: {
      return { ...state, announcement: payload }
    }
    default: {
      return state
    }
  }
}
