/* eslint-env jest */
import { get } from 'lodash/fp'
import { merge } from 'lodash'
import reducer, {
  FETCH_LINK_PREVIEW,
  REMOVE_LINK_PREVIEW,
  RESET_LINK_PREVIEW,
  defaultState,
  fetchLinkPreview,
  removeLinkPreview,
  resetLinkPreview
} from './PostEditor.store'

describe('PostEditor reducer', () => {
  const validLinkPreview = {
    id: 'found',
    title: 'has a title'
  }

  describe(`with ${FETCH_LINK_PREVIEW}`, () => {
    test('linkPreviewId is set if record is found', () => {
      const action = merge(fetchLinkPreview(), {
        payload: {
          data: {
            findOrCreateLinkPreviewByUrl: validLinkPreview
          }
        }
      })
      const finalState = reducer(defaultState, action)
      expect(finalState.linkPreviewId).toEqual(validLinkPreview.id)
      expect(finalState.linkPreviewStatus).toEqual(null)
      expect(finalState).toMatchSnapshot()
    })
    test('linkPreviewId is not set status is "invalid" if a record is not found', () => {
      const action = merge(fetchLinkPreview(), {
        payload: {
          data: {
            findOrCreateLinkPreviewByUrl: {}
          }
        }
      })
      const finalState = reducer(defaultState, action)
      expect(finalState.linkPreviewId).toBeFalsy()
      expect(finalState.linkPreviewStatus).toEqual('invalid')
      expect(finalState).toMatchSnapshot()
    })
  })

  describe(`with ${REMOVE_LINK_PREVIEW}`, () => {
    const action = {type: REMOVE_LINK_PREVIEW}
    test('linkPreviewId is cleared and status set to "removed"', () => {
      const finalState = reducer(defaultState, action)
      expect(finalState.linkPreviewId).toBeFalsy()
      expect(finalState.linkPreviewStatus).toEqual('removed')
      expect(finalState).toMatchSnapshot()
    })
  })

  describe(`with ${RESET_LINK_PREVIEW}`, () => {
    const action = {type: RESET_LINK_PREVIEW}
    const statuses = ['removed', 'invalid']
    statuses.forEach(status => {
      return test(`linkPreviewId is set to "reset" if transitioning from ${status}`, () => {
        const initialState = {linkPreviewId: null, linkPreviewStatus: status}
        const finalState = reducer(initialState, action)
        expect(finalState.linkPreviewId).toBeFalsy()
        expect(finalState.linkPreviewStatus).toEqual('reset')
        expect(finalState).toMatchSnapshot()
      })
    })

    it('should not clear the linkPreviewId or set status to "reset" if a preview exists and wasn\'t removed', () => {
      const linkPreviewId = 'valid-id'
      const initialState = {linkPreviewId, linkPreviewStatus: null}
      const finalState = reducer(initialState, action)
      expect(finalState.linkPreviewId).toEqual('valid-id')
      expect(finalState.linkPreviewStatus).toEqual(null)
      expect(finalState).toMatchSnapshot()
    })
  })
})

// export default function reducer (state = defaultState, action) {
//   const { error, type, payload, meta } = action
//   if (error) return state
//
//   switch (type) {
//     case FETCH_LINK_PREVIEW:
//       const linkPreview = (meta.extractModel.getRoot(payload.data))
//       if (linkPreview && !linkPreview.title) {
//         return {...state, linkPreviewId: null, linkPreviewStatus: 'invalid'}
//       }
//       return {...state, linkPreviewId: get('id')(linkPreview)}
//     case REMOVE_LINK_PREVIEW:
//       return {...state, linkPreviewId: null, linkPreviewStatus: 'removed'}
//     case RESET_LINK_PREVIEW:
//       let { linkPreviewStatus } = state
//       if (linkPreviewStatus !== 'removed' && linkPreviewStatus !== 'invalid') return state
//       return {...state, linkPreviewId: null, linkPreviewStatus: 'reset'}
//     default:
//       return state
//   }
// }
