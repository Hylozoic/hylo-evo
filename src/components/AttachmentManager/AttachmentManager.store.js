import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { get, getOr, filter, reject, pick, clone } from 'lodash/fp'
import { UPLOAD_ATTACHMENT } from 'store/constants'

export const MODULE_NAME = 'AttachmentManager'
export const LOAD_ATTACHMENTS = `${MODULE_NAME}/LOAD_ATTACHMENTS`
export const SET_ATTACHMENTS = `${MODULE_NAME}/SET_ATTACHMENTS`
export const ADD_ATTACHMENT = `${MODULE_NAME}/ADD_ATTACHMENT`
export const REMOVE_ATTACHMENT = `${MODULE_NAME}/REMOVE_ATTACHMENT`
export const SWITCH_ATTACHMENTS = `${MODULE_NAME}/SWITCH_ATTACHMENTS`
export const ID_FOR_NEW = 'new'

// -- LOCAL STORE --

// action generators

export function setAttachments (type, id, attachmentType, attachments) {
  return {
    type: SET_ATTACHMENTS,
    payload: {
      attachmentKey: makeAttachmentKey(type, id),
      attachmentType,
      attachments
    }
  }
}

export function clearAttachments (type, id, attachmentType) {
  return setAttachments(type, id, attachmentType, [])
}

export function addAttachment (type, id, attachment) {
  return {
    type: ADD_ATTACHMENT,
    payload: {
      attachmentKey: makeAttachmentKey(type, id),
      attachment
    }
  }
}

export function removeAttachment (type, id, attachment) {
  return {
    type: REMOVE_ATTACHMENT,
    payload: {
      attachmentKey: makeAttachmentKey(type, id),
      attachment
    }
  }
}

export function switchAttachments (type, id, attachmentType, position1, position2) {
  return {
    type: SWITCH_ATTACHMENTS,
    payload: {
      attachmentKey: makeAttachmentKey(type, id),
      attachmentType,
      position1,
      position2
    }
  }
}

// selectors

export function getAttachments (state, {
  type,
  id = ID_FOR_NEW,
  attachmentType
}) {
  const allAttachments = getOr([], [MODULE_NAME, makeAttachmentKey(type, id)], state)

  if (attachmentType) return filter({ attachmentType }, allAttachments)

  return allAttachments
}

// Gets Attachments for any ReduxORM object matching
// the provided type and id pair
export const getAttachmentsFromObject = ormCreateSelector(
  orm,
  (_, props) => props,
  ({ Attachment }, { id = ID_FOR_NEW, type, attachmentType }) => Attachment
    .all()
    .filter(({ type: at, ...rest }) => at === attachmentType && rest[type.toLowerCase()] === id)
    .orderBy('position')
    .toRefArray()
    .map(({ url }) => ({
      type,
      id,
      url,
      attachmentType
    }))
)

export function getUploadAttachmentPending ({ pending }, { type, id = ID_FOR_NEW, attachmentType } = {}) {
  const pendingUpload = get(UPLOAD_ATTACHMENT, pending)

  if (!pendingUpload) return false
  if (!attachmentType) return pendingUpload.type === type && pendingUpload.id === id

  return pendingUpload.type === type &&
    pendingUpload.id === id &&
    pendingUpload.attachmentType === attachmentType
}

// reducer

export const defaultState = {}

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action

  if (error) return state

  const attachment = get('attachment', payload)
  const attachments = get('attachments', payload)
  const attachmentKey = get('attachmentKey', payload)
  const attachmentsForKey = getOr([], [attachmentKey], state)
  const attachmentType = get('attachmentType', payload)

  switch (type) {
    case SET_ATTACHMENTS:
      return {
        ...state,
        [attachmentKey]: [
          ...attachmentType ? reject({ attachmentType }, attachmentsForKey) : [],
          ...attachments.map(a => pick(ATTACHMENT_KEYS_WHITELIST, a))
        ]
      }
    case ADD_ATTACHMENT:
      return {
        ...state,
        [attachmentKey]: [
          ...attachmentsForKey,
          pick(ATTACHMENT_KEYS_WHITELIST, attachment)
        ]
      }
    case REMOVE_ATTACHMENT:
      return {
        ...state,
        [attachmentKey]: reject(attachment, attachmentsForKey)
      }
    case SWITCH_ATTACHMENTS:
      const { position1, position2 } = payload
      const forAttachmentType = filter({ attachmentType }, attachmentsForKey)
      const forAttachmentTypeCopy = clone(forAttachmentType)
      forAttachmentType[position1] = forAttachmentTypeCopy[position2]
      forAttachmentType[position2] = forAttachmentTypeCopy[position1]
      return {
        ...state,
        [attachmentKey]: [
          ...forAttachmentType,
          ...reject({ attachmentType }, attachmentsForKey)
        ]
      }
    default:
      return state
  }
}

// -- UTILITY --

export const ATTACHMENT_KEYS_WHITELIST = ['url', 'attachmentType']

export const makeAttachmentKey = (type, id) => [type, id || ID_FOR_NEW].join('-')
