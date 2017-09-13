import { pullAt, clone, get } from 'lodash/fp'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'

export const MODULE_NAME = 'AttachmentManager'
export const LOAD_IMAGE_PREVIEWS = `${MODULE_NAME}/LOAD_IMAGE_PREVIEWS`
export const SET_IMAGE_PREVIEWS = `${MODULE_NAME}/SET_IMAGE_PREVIEWS`
export const ADD_IMAGE_PREVIEW = `${MODULE_NAME}/ADD_IMAGE_PREVIEW`
export const REMOVE_IMAGE_PREVIEW = `${MODULE_NAME}/REMOVE_IMAGE_PREVIEW`
export const SWITCH_IMAGE_PREVIEWS = `${MODULE_NAME}/SWITCH_IMAGE_PREVIEWS`

// action generators

export function setImagePreviews (imagePreviews) {
  return {
    type: SET_IMAGE_PREVIEWS,
    payload: imagePreviews
  }
}

export function addImagePreview (url) {
  return {
    type: ADD_IMAGE_PREVIEW,
    payload: url
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

export function getImagePreviews (state) {
  return state[MODULE_NAME].imagePreviews
}

export const getImages = ormCreateSelector(
  orm,
  get('orm'),
  (state, { postId }) => postId,
  ({ Attachment }, postId) =>
    Attachment.all()
    .filter(({ type, post }) =>
      type === 'image' && post === postId)
    .orderBy('position')
    .toModelArray()
  )

// Reducer

export const defaultState = {
  imagePreviews: []
}

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case SET_IMAGE_PREVIEWS:
      return {...state, imagePreviews: payload}
    case ADD_IMAGE_PREVIEW:
      return {...state, imagePreviews: state.imagePreviews.concat([payload])}
    case REMOVE_IMAGE_PREVIEW:
      return {...state, imagePreviews: pullAt(payload, state.imagePreviews)}
    case SWITCH_IMAGE_PREVIEWS:
      const { position1, position2 } = payload
      const imagePreviews = clone(state.imagePreviews)
      imagePreviews[position1] = state.imagePreviews[position2]
      imagePreviews[position2] = state.imagePreviews[position1]
      return {
        ...state,
        imagePreviews
      }
    default:
      return state
  }
}
