import { pullAt, clone, get, getOr } from 'lodash/fp'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { uploadFile } from 'client/filepicker'
import { UPLOAD_ATTACHMENT } from 'store/constants'

export const MODULE_NAME = 'AttachmentManager'
export const LOAD_ATTACHMENTS = `${MODULE_NAME}/LOAD_ATTACHMENTS`
export const SET_ATTACHMENTS = `${MODULE_NAME}/SET_ATTACHMENTS`
export const ADD_ATTACHMENT = `${MODULE_NAME}/ADD_ATTACHMENT`
export const REMOVE_ATTACHMENT = `${MODULE_NAME}/REMOVE_ATTACHMENT`
export const SWITCH_ATTACHMENTS = `${MODULE_NAME}/SWITCH_ATTACHMENTS`

// -- LOCAL STORE --

// Action generators

export function setAttachments (type, id, attachmentType, attachments) {
  return {
    type: SET_ATTACHMENTS,
    payload: {
      polymorphicId: makePolymorphicId(type, id),
      attachmentType,
      attachments
    }
  }
}

export function addAttachment (type, id, attachmentType, url) {
  return {
    type: ADD_ATTACHMENT,
    payload: {
      polymorphicId: makePolymorphicId(type, id),
      attachmentType,
      url
    }
  }
}

export function removeAttachment (type, id, attachmentType, position) {
  return {
    type: REMOVE_ATTACHMENT,
    payload: {
      polymorphicId: makePolymorphicId(type, id),
      attachmentType,
      position
    }
  }
}

export function switchAttachments (type, id, attachmentType, position1, position2) {
  return {
    type: SWITCH_ATTACHMENTS,
    payload: {
      polymorphicId: makePolymorphicId(type, id),
      attachmentType,
      position1,
      position2
    }
  }
}

// Selectors

export function getAttachments (state, {
  type,
  id,
  attachmentType
}) {
  const result = getOr([], [MODULE_NAME, makePolymorphicId(type, id), attachmentType], state)
  return result
}

// Reducer

export const defaultState = {}

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  const polymorphicId = get('polymorphicId', payload)
  const attachmentType = get('attachmentType', payload)
  const attachmentsForId = getOr([], [polymorphicId], state)
  const attachmentsForAttachmentType = getOr([], [polymorphicId, attachmentType], state)

  switch (type) {
    case SET_ATTACHMENTS:
      const attachments = get('attachments', payload)
      return {
        ...state,
        [polymorphicId]: {
          ...attachmentsForId,
          [attachmentType]: attachments
        }
      }
    case ADD_ATTACHMENT:
      return {
        ...state,
        [polymorphicId]: {
          ...attachmentsForId,
          [attachmentType]: [
            ...attachmentsForAttachmentType,
            payload.url
          ]
        }
      }
    case REMOVE_ATTACHMENT:
      return {
        ...state,
        [polymorphicId]: {
          ...attachmentsForId,
          [attachmentType]: pullAt(payload.position, attachmentsForAttachmentType)
        }
      }
    case SWITCH_ATTACHMENTS:
      const { position1, position2 } = payload
      const attachmentsForAttachmentTypeCopy = clone(attachmentsForAttachmentType)
      attachmentsForAttachmentType[position1] = attachmentsForAttachmentTypeCopy[position2]
      attachmentsForAttachmentType[position2] = attachmentsForAttachmentTypeCopy[position1]
      return {
        ...state,
        [polymorphicId]: {
          ...attachmentsForId,
          [attachmentType]: attachmentsForAttachmentType
        }
      }
    default:
      return state
  }
}

// -- GLOBAL STORE --

// Selectors

export function getUploadPending ({ pending }, props) {
  const pendingUpload = get(UPLOAD_ATTACHMENT, pending)

  if (!props || !pendingUpload) return pendingUpload

  const { type, id, attachmentType } = props

  return pendingUpload.type === type &&
    pendingUpload.id === id &&
    pendingUpload.fileType === attachmentType
}

export const getAttachmentsFromObject = ormCreateSelector(
  orm,
  (state, _) => get('orm', state),
  (_, props) => props,
  ({ Attachment }, { id, type, attachmentType }) => Attachment
    .all()
    .filter(({ type: at, ...rest }) =>
      at === attachmentType &&
      rest[type.toLowerCase()] === id
    )
    .orderBy('position')
    .toModelArray()
    .map(a => a.url)
)

// Action generators

export function uploadAttachment ({
  type, // this is the type of thing that the upload is for, e.g. post
  id = 'new', // this is the id of the thing that the upload is for
  fileType // this is the attachment type used to identify a related attachment manager
}) {
  const payload = new Promise((resolve, reject) => {
    uploadFile({
      success: (url, filename) => resolve({
        api: {
          method: 'post',
          path: '/noo/upload',
          params: { type, id, url, filename }
        }
      }),
      cancel: () => resolve({}),
      failure: err => reject(err),
      fileType
    })
  })

  return {
    type: UPLOAD_ATTACHMENT,
    payload,
    meta: { type, id, fileType }
  }
}

// -- UTILITY --

export const makePolymorphicId = (typeOrObject, objectId) => {
  let type, id

  if (typeof typeOrObject === 'object') {
    [type, id] = [typeOrObject['type'], typeOrObject['id']]
  } else {
    [type, id] = [typeOrObject, objectId]
  }

  id = id || 'new'

  return [type, id].join('-')
}

