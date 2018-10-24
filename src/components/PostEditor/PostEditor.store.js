import { get } from 'lodash/fp'
import { textLength } from 'hylo-utils/text'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { AnalyticsEvents } from 'hylo-utils/constants'
import linkMatcher from 'util/linkMatcher'
import { getPostFieldsFragment } from 'store/actions/fetchPost'

export const MODULE_NAME = 'PostEditor'
export const CREATE_POST = `${MODULE_NAME}/CREATE_POST`
export const CREATE_PROJECT = `${MODULE_NAME}/CREATE_PROJECT`
export const UPDATE_POST = `${MODULE_NAME}/UPDATE_POST`
export const UPDATE_POST_PENDING = `${UPDATE_POST}_PENDING`
export const FETCH_LINK_PREVIEW = `${MODULE_NAME}/FETCH_LINK_PREVIEW`
export const REMOVE_LINK_PREVIEW = `${MODULE_NAME}/REMOVE_LINK_PREVIEW`
export const CLEAR_LINK_PREVIEW = `${MODULE_NAME}/CLEAR_LINK_PREVIEW`
export const ANNOUNCEMENT = `${MODULE_NAME}/ANNOUNCEMENT`
export const SHOW_ANNOUNCEMENT_CONFIRMATION = `${MODULE_NAME}/SHOW_ANNOUNCEMENT_CONFIRMATION`
export const SET_ANNOUNCEMENT = `${MODULE_NAME}/SET_ANNOUNCEMENT`

export const MAX_TITLE_LENGTH = 50

// Actions

export function createPost (post) {
  const {
    type, title, details, communities, linkPreview, imageUrls, fileUrls, topicNames, sendAnnouncement
  } = post
  const linkPreviewId = linkPreview && linkPreview.id
  const communityIds = communities.map(c => c.id)
  return {
    type: CREATE_POST,
    graphql: {
      query: `mutation (
        $type: String,
        $title: String,
        $details: String,
        $linkPreviewId: String,
        $communityIds: [String],
        $imageUrls: [String],
        $fileUrls: [String],
        $announcement: Boolean
        $topicNames: [String]
      ) {
        createPost(data: {
          type: $type,
          title: $title,
          details: $details,
          linkPreviewId: $linkPreviewId,
          communityIds: $communityIds,
          imageUrls: $imageUrls,
          fileUrls: $fileUrls,
          announcement: $announcement
          topicNames: $topicNames
        }) {${getPostFieldsFragment(false)}}
      }`,
      variables: {
        type,
        title,
        details,
        linkPreviewId,
        communityIds,
        imageUrls,
        fileUrls,
        announcement: sendAnnouncement,
        topicNames
      }
    },
    meta: {
      extractModel: 'Post',
      analytics: {
        eventName: AnalyticsEvents.POST_CREATED,
        detailsLength: textLength(details),
        isAnnouncement: sendAnnouncement
      }
    }
  }
}

export function createProject (post) {
  const {
    type,
    title,
    details,
    communities,
    linkPreview,
    imageUrls,
    fileUrls,
    topicNames,
    sendAnnouncement,
    memberIds = []
  } = post
  const linkPreviewId = linkPreview && linkPreview.id
  const communityIds = communities.map(c => c.id)
  return {
    type: CREATE_PROJECT,
    graphql: {
      query: `mutation (
        $title: String,
        $details: String,
        $linkPreviewId: String,
        $communityIds: [String],
        $imageUrls: [String],
        $fileUrls: [String],
        $announcement: Boolean
        $topicNames: [String]
        $memberIds: [ID]        
      ) {
        createProject(data: {
          title: $title,
          details: $details,
          linkPreviewId: $linkPreviewId,
          communityIds: $communityIds,
          imageUrls: $imageUrls,
          fileUrls: $fileUrls,
          announcement: $announcement
          topicNames: $topicNames
          memberIds: $memberIds
        }) {${getPostFieldsFragment(false)}}
      }`,
      variables: {
        type,
        title,
        details,
        linkPreviewId,
        communityIds,
        imageUrls,
        fileUrls,
        announcement: sendAnnouncement,
        topicNames,
        memberIds
      }
    },
    meta: {
      extractModel: 'Post',
      analytics: {
        eventName: AnalyticsEvents.POST_CREATED,
        detailsLength: textLength(details),
        isAnnouncement: sendAnnouncement
      }
    }
  }
}

export function updatePost (post) {
  const {
    id, type, title, details, communities, linkPreview, imageUrls, fileUrls, topicNames, memberIds
  } = post
  const linkPreviewId = linkPreview && linkPreview.id
  const communityIds = communities.map(c => c.id)
  return {
    type: UPDATE_POST,
    graphql: {
      query: `mutation (
        $id: ID,
        $type: String,
        $title: String,
        $details: String,
        $linkPreviewId: String,
        $communityIds: [String],
        $imageUrls: [String],
        $fileUrls: [String],
        $topicNames: [String],
        $memberIds: [ID]
      ) {
        updatePost(id: $id, data: {
          type: $type,
          title: $title,
          details: $details,
          linkPreviewId: $linkPreviewId,
          communityIds: $communityIds,
          imageUrls: $imageUrls,
          fileUrls: $fileUrls,
          topicNames: $topicNames,
          memberIds: $memberIds
        }) {${getPostFieldsFragment(false)}}
      }`,
      variables: {
        id,
        type,
        title,
        details,
        linkPreviewId,
        communityIds,
        imageUrls,
        fileUrls,
        topicNames,
        memberIds
      }
    },
    meta: {
      id,
      extractModel: {
        modelName: 'Post',
        getRoot: get('updatePost'),
        append: false
      },
      optimistic: true,
      analytics: {
        eventName: AnalyticsEvents.POST_UPDATED,
        detailsLength: textLength(details)
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

export function clearLinkPreview () {
  return {type: CLEAR_LINK_PREVIEW}
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
  state => state.orm,
  state => state[MODULE_NAME],
  ({ LinkPreview }, { linkPreviewId }) =>
    LinkPreview.hasId(linkPreviewId) ? LinkPreview.withId(linkPreviewId).ref : null
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
        return {...state, linkPreviewId: null, linkPreviewStatus: 'invalid'}
      }
      return {...state, linkPreviewId: get('id')(linkPreview), linkPreviewStatus: null}
    case REMOVE_LINK_PREVIEW:
      return {...state, linkPreviewId: null, linkPreviewStatus: 'removed'}
    case CLEAR_LINK_PREVIEW:
      return {...state, linkPreviewId: null, linkPreviewStatus: 'cleared'}
    case SHOW_ANNOUNCEMENT_CONFIRMATION:
      return {...state, showAnnouncementConfirmation: payload}
    case SET_ANNOUNCEMENT:
      return {...state, announcement: payload}
    default:
      return state
  }
}
