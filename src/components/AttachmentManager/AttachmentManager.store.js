import { pullAt, clone, get, getOr } from 'lodash/fp'
import { ID_FOR_NEW } from 'store/actions/uploadAttachment'

export { ID_FOR_NEW }

export const MODULE_NAME = 'AttachmentManager'
export const LOAD_ATTACHMENTS = `${MODULE_NAME}/LOAD_ATTACHMENTS`
export const SET_ATTACHMENTS = `${MODULE_NAME}/SET_ATTACHMENTS`
export const ADD_ATTACHMENT = `${MODULE_NAME}/ADD_ATTACHMENT`
export const REMOVE_ATTACHMENT = `${MODULE_NAME}/REMOVE_ATTACHMENT`
export const SWITCH_ATTACHMENTS = `${MODULE_NAME}/SWITCH_ATTACHMENTS`

// -- LOCAL STORE --

// action generators

export function setAttachments (type, id, attachmentType, attachments) {
  return {
    type: SET_ATTACHMENTS,
    payload: {
      attachmentKey: makeAttachmentKey({ type, id, attachmentType }),
      attachments
    }
  }
}

export function addAttachment (attachment) {
  return {
    type: ADD_ATTACHMENT,
    payload: {
      attachmentKey: makeAttachmentKey(attachment),
      attachment
    }
  }
}

export function removeAttachment (attachment, position) {
  return {
    type: REMOVE_ATTACHMENT,
    payload: {
      attachmentKey: makeAttachmentKey(attachment),
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

// selectors

export function getAttachments (state, {
  type,
  id,
  attachmentType
}) {
  const result = getOr([], [MODULE_NAME, makeAttachmentKey(type, id, attachmentType)], state)
  return result
}

// reducer

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
          payload.attachment
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

// -- UTILITY --

export const makeAttachmentKey = (typeOrObject, objectId, providedAttachmentType) => {
  let type, id, attachmentType

  if (typeof typeOrObject !== 'object') {
    [type, id, attachmentType] = [typeOrObject, objectId, providedAttachmentType]
  } else {
    [type, id] = [typeOrObject['type'], typeOrObject['id']]
    attachmentType = typeOrObject['attachmentType']
      ? typeOrObject['attachmentType']
      : 'file'
  }

  id = id || ID_FOR_NEW

  return [type, id, attachmentType].join('-')
}
