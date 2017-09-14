import { pullAt, clone, get } from 'lodash/fp'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'

export const MODULE_NAME = 'AttachmentManager'
export const LOAD_ATTACHMENTS = `${MODULE_NAME}/LOAD_ATTACHMENTS`
export const SET_ATTACHMENTS = `${MODULE_NAME}/SET_ATTACHMENTS`
export const ADD_ATTACHMENT = `${MODULE_NAME}/ADD_ATTACHMENT`
export const REMOVE_ATTACHMENT = `${MODULE_NAME}/REMOVE_ATTACHMENT`
export const SWITCH_ATTACHMENTS = `${MODULE_NAME}/SWITCH_ATTACHMENTS`

// action generators

export function setAttachments (attachments, type) {
  return {
    type: SET_ATTACHMENTS,
    payload: {
      attachments,
      type
    }
  }
}

export function addAttachment (url, type) {
  return {
    type: ADD_ATTACHMENT,
    payload: {
      url,
      type
    }
  }
}

export function removeAttachment (position, type) {
  return {
    type: REMOVE_ATTACHMENT,
    payload: {
      position,
      type
    }
  }
}

export function switchAttachments (position1, position2, type) {
  return {
    type: SWITCH_ATTACHMENTS,
    payload: {
      position1,
      position2,
      type
    }
  }
}

// Selectors

export function getAttachments (state, { type }) {
  return state[MODULE_NAME][type]
}

export const makeAttachmentSelector = attachmentType => ormCreateSelector(
  orm,
  get('orm'),
  (state, { postId }) => postId,
  ({ Attachment }, postId) =>
    Attachment.all()
    .filter(({ type, post }) =>
      type === attachmentType && post === postId)
    .orderBy('position')
    .toModelArray()
  )

// Reducer

export const defaultState = {
  image: [],
  file: []
}

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case SET_ATTACHMENTS:
      return {...state, [payload.type]: payload.attachments}
    case ADD_ATTACHMENT:
      return {...state, [payload.type]: state[payload.type].concat([payload.url])}
    case REMOVE_ATTACHMENT:
      return {...state, [payload.type]: pullAt(payload.position, state[payload.type])}
    case SWITCH_ATTACHMENTS:
      const { position1, position2 } = payload
      const attachments = clone(state[payload.type])
      attachments[position1] = state[payload.type][position2]
      attachments[position2] = state[payload.type][position1]
      return {
        ...state,
        [payload.type]: attachments
      }
    default:
      return state
  }
}
