import {
  UPDATE_THREAD_READ_TIME
} from 'store/constants'

export function updateThreadReadTime (id) {
  return {
    type: UPDATE_THREAD_READ_TIME,
    payload: {api: true, path: `/noo/post/${id}/update-last-read`, method: 'POST'},
    meta: {id}
  }
}
