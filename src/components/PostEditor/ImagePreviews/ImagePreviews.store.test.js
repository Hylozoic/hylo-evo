/* eslint-env jest */
import reducer, {
  SET_IMAGE_PREVIEWS,
  ADD_IMAGE_PREVIEW,
  REMOVE_IMAGE_PREVIEW,
  SWITCH_IMAGE_PREVIEWS,
  defaultState
} from './ImagePreviews.store'

describe('ImagePreviews store', () => {
  describe('reducer', () => {
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
