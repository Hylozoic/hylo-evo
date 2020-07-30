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
export const ID_FOR_NEW = 'new'

// -- LOCAL STORE --

// Action generators

export function setAttachments (type, id, attachmentType, attachments) {
  return {
    type: SET_ATTACHMENTS,
    payload: {
      attachmentKey: makeAttachmentKey(type, id, attachmentType),
      attachments
    }
  }
}

export function addAttachment (type, id, attachmentType, url) {
  return {
    type: ADD_ATTACHMENT,
    payload: {
      attachmentKey: makeAttachmentKey(type, id, attachmentType),
      url
    }
  }
}

export function removeAttachment (type, id, attachmentType, position) {
  return {
    type: REMOVE_ATTACHMENT,
    payload: {
      attachmentKey: makeAttachmentKey(type, id, attachmentType),
      position
    }
  }
}

export function switchAttachments (type, id, attachmentType, position1, position2) {
  return {
    type: SWITCH_ATTACHMENTS,
    payload: {
      attachmentKey: makeAttachmentKey(type, id, attachmentType),
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
  const result = getOr([], [MODULE_NAME, makeAttachmentKey(type, id, attachmentType)], state)
  return result
}

// Reducer

export const defaultState = {}

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  const attachmentKey = get('attachmentKey', payload)
  const attachmentsForKey = getOr([], [attachmentKey], state)
  
  switch (type) {
    case SET_ATTACHMENTS:
      const attachments = get('attachments', payload)
      return {
        ...state,
        [attachmentKey]: attachments
      }
    case ADD_ATTACHMENT:
      return {
        ...state,
        [attachmentKey]: [
          ...attachmentsForKey,
          payload.url
        ]
      }
    case REMOVE_ATTACHMENT:
      return {
        ...state,
        [attachmentKey]: pullAt(payload.position, attachmentsForKey)
      }
    case SWITCH_ATTACHMENTS:
      const { position1, position2 } = payload
      const attachmentsForKeyCopy = clone(attachmentsForKey)
      attachmentsForKey[position1] = attachmentsForKeyCopy[position2]
      attachmentsForKey[position2] = attachmentsForKeyCopy[position1]
      return {
        ...state,
        [attachmentKey]: attachmentsForKey
      }
    default:
      return state
  }
}

// -- GLOBAL STORE --

// Selectors

export const getAttachmentsFromObject = ormCreateSelector(
  orm,
  (state, _) => get('orm', state),
  (_, props) => props,
  ({ Attachment }, { id = ID_FOR_NEW, type, attachmentType }) => {
    console.log('!!!! in getAttachmentsFromObject -- id,type,attachemenType:', id, type, attachmentType)
    return Attachment
      .all()
      .filter(({ type: at, ...rest }) =>
        at === attachmentType &&
        rest[type.toLowerCase()] === id
      )
      .orderBy('position')
      .toModelArray()
      .map(a => a.url)
  }
)

export function getUploadPending ({ pending }, props) {
  const pendingUpload = get(UPLOAD_ATTACHMENT, pending)

  if (!props || !pendingUpload) return Boolean(pendingUpload)

  const { type, id = ID_FOR_NEW, attachmentType } = props

  return pendingUpload.type === type &&
    pendingUpload.id === id &&
    pendingUpload.attachmentType === attachmentType
}

// Action generators

export function uploadAttachment ({
  type, // this is the type of thing that the upload is for, e.g. post
  id = ID_FOR_NEW, // this is the id of the thing that the upload is for
  attachmentType // this is the attachment type used to identify a related attachment manager
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
      attachmentType
    })
  })

  return {
    type: UPLOAD_ATTACHMENT,
    payload,
    meta: { type, id, attachmentType }
  }
}

// -- UTILITY --

export const makeAttachmentKey = (typeOrObject, objectId, attachmentType) => {
  let type, id

  if (typeof typeOrObject === 'object') {
    [type, id, attachmentType] = [typeOrObject['type'], typeOrObject['id'], typeOrObject['attachmentType']]
  } else {
    [type, id] = [typeOrObject, objectId, attachmentType]
  }

  id = id || ID_FOR_NEW

  return [type, id, attachmentType].join('-')
}
