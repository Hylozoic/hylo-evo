import { get, getOr, filter, reject, pick, clone } from 'lodash/fp'
import { ID_FOR_NEW } from 'store/actions/uploadAttachment'
import { NEW_THREAD_ID } from 'routes/Messages/Messages'

export { ID_FOR_NEW }

export const MODULE_NAME = 'AttachmentManager'
export const LOAD_ATTACHMENTS = `${MODULE_NAME}/LOAD_ATTACHMENTS`
export const SET_ATTACHMENTS = `${MODULE_NAME}/SET_ATTACHMENTS`
export const ADD_ATTACHMENT = `${MODULE_NAME}/ADD_ATTACHMENT`
export const REMOVE_ATTACHMENT = `${MODULE_NAME}/REMOVE_ATTACHMENT`
export const SWITCH_ATTACHMENTS = `${MODULE_NAME}/SWITCH_ATTACHMENTS`

// -- LOCAL STORE --

// action generators

export function setAttachments (type, id, attachments) {
  return {
    type: SET_ATTACHMENTS,
    payload: {
      attachmentKey: makeAttachmentKey(type, id),
      attachments
    }
  }
}

export function clearAttachments (type, id) {
  return setAttachments(type, id, [])
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
  id = NEW_THREAD_ID,
  attachmentType
}) {
  const allAttachments = getOr([], [MODULE_NAME, makeAttachmentKey(type, id)], state)

  if (attachmentType) return filter({ attachmentType }, allAttachments)

  return allAttachments
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
        [attachmentKey]: attachments.map(a => pick(validAttachmentKeys, a))
      }
    case ADD_ATTACHMENT:
      return {
        ...state,
        [attachmentKey]: [
          ...attachmentsForKey,
          pick(validAttachmentKeys, attachment)
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
export const validAttachmentKeys = ['url', 'attachmentType'] 

export const makeAttachmentKey = (type, id) => [type, id || ID_FOR_NEW].join('-')
