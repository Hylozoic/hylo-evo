import { get, isEmpty, includes } from 'lodash/fp'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { FETCH_DEFAULT_TOPICS } from 'store/constants'
import presentTopic from 'store/presenters/presentTopic'
import { makeGetQueryResults } from 'store/reducers/queryResults'
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

const getDefaultTopicsResults = makeGetQueryResults(FETCH_DEFAULT_TOPICS)

export const getDefaultTopics = ormCreateSelector(
  orm,
  getDefaultTopicsResults,
  (_, props) => props,
  (session, results, props) => {
    if (isEmpty(results) || isEmpty(results.ids)) return []
    const topics = session.Topic.all()
      .filter(x => includes(x.id, results.ids))
      .orderBy(x => results.ids.indexOf(x.id))
      .toModelArray()

    return topics.map(topic => presentTopic(topic, props))
  }
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
    case FETCH_LINK_PREVIEW:
      const linkPreview = (meta.extractModel.getRoot(payload.data))
      if (linkPreview && !linkPreview.title) {
        return { ...state, linkPreviewId: null, linkPreviewStatus: 'invalid' }
      }
      return { ...state, linkPreviewId: get('id')(linkPreview), linkPreviewStatus: null }
    case REMOVE_LINK_PREVIEW:
      return { ...state, linkPreviewId: null, linkPreviewStatus: 'removed' }
    case CLEAR_LINK_PREVIEW:
      return { ...state, linkPreviewId: null, linkPreviewStatus: 'cleared' }
    case SHOW_ANNOUNCEMENT_CONFIRMATION:
      return { ...state, showAnnouncementConfirmation: payload }
    case SET_ANNOUNCEMENT:
      return { ...state, announcement: payload }
    default:
      return state
  }
}
