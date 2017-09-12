/* eslint-env jest */
import { merge } from 'lodash'
import reducer, {
  FETCH_LINK_PREVIEW,
  REMOVE_LINK_PREVIEW,
  CLEAR_LINK_PREVIEW,
  SET_IMAGE_PREVIEWS,
  ADD_IMAGE_PREVIEW,
  REMOVE_IMAGE_PREVIEW,
  SWITCH_IMAGE_PREVIEWS,
  defaultState,
  fetchLinkPreview
} from './PostEditor.store'

describe('PostEditor store', () => {
  const validLinkPreview = {
    id: 'found',
    title: 'has a title'
  }
  describe('reducer', () => {
    describe(`when ${FETCH_LINK_PREVIEW}`, () => {
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

    describe(`when ${REMOVE_LINK_PREVIEW}`, () => {
      const action = {type: REMOVE_LINK_PREVIEW}
      test('linkPreviewId is cleared and status set to "removed"', () => {
        const finalState = reducer(defaultState, action)
        expect(finalState.linkPreviewId).toBeFalsy()
        expect(finalState.linkPreviewStatus).toEqual('removed')
        expect(finalState).toMatchSnapshot()
      })
    })

    describe(`when ${CLEAR_LINK_PREVIEW}`, () => {
      const action = {type: CLEAR_LINK_PREVIEW}
      test('linkPreviewId is cleared and status set to "cleared"', () => {
        const finalState = reducer(defaultState, action)
        expect(finalState.linkPreviewId).toBeFalsy()
        expect(finalState.linkPreviewStatus).toEqual('cleared')
        expect(finalState).toMatchSnapshot()
      })
    })

    describe(`when ${SET_IMAGE_PREVIEWS}`, () => {
      const action = {
        type: SET_IMAGE_PREVIEWS,
        payload: ['foo.png', 'bar.jog']
      }
      it('sets image previews', () => {
        const finalState = reducer(defaultState, action)
        expect(finalState).toMatchSnapshot()
      })
    })

    describe(`when ${ADD_IMAGE_PREVIEW}`, () => {
      const action = {
        type: ADD_IMAGE_PREVIEW,
        payload: 'bar.jog'
      }
      it('adds an image preview', () => {
        const finalState = reducer(defaultState, action)
        expect(finalState).toMatchSnapshot()
      })
    })

    describe(`when ${REMOVE_IMAGE_PREVIEW}`, () => {
      const action = {
        type: REMOVE_IMAGE_PREVIEW,
        payload: 1
      }
      it('removes an image preview', () => {
        const state = {
          ...defaultState,
          imagePreviews: ['a.png', 'b.png', 'c.png']
        }
        const finalState = reducer(state, action)
        expect(finalState).toMatchSnapshot()
      })
    })

    describe(`when ${SWITCH_IMAGE_PREVIEWS}`, () => {
      const action = {
        type: SWITCH_IMAGE_PREVIEWS,
        payload: {
          position1: 1,
          position2: 2
        }
      }
      it('switches two image previews', () => {
        const state = {
          ...defaultState,
          imagePreviews: ['a.png', 'b.png', 'c.png']
        }
        const finalState = reducer(state, action)
        expect(finalState).toMatchSnapshot()
      })
    })
  })
})
