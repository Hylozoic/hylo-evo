/* eslint-env jest */
import reducer, {
  SET_ATTACHMENTS,
  ADD_ATTACHMENT,
  REMOVE_ATTACHMENT,
  SWITCH_ATTACHMENTS,
  defaultState
} from './AttachmentManager.store'

describe('AttachmentManager store', () => {
  describe('reducer', () => {
    describe('when SET_ATTACHMENTS', () => {
      const action = {
        type: SET_ATTACHMENTS,
        payload: {
          attachments: ['foo.png', 'bar.jog'],
          type: 'image'
        }
      }
      it('sets attachments', () => {
        const finalState = reducer(defaultState, action)
        expect(finalState).toMatchSnapshot()
      })
    })

    describe('when ADD_ATTACHMENT', () => {
      const action = {
        type: ADD_ATTACHMENT,
        payload: {
          url: 'bar.pdf',
          type: 'file'
        }
      }
      it('adds an attachment', () => {
        const finalState = reducer(defaultState, action)
        expect(finalState).toMatchSnapshot()
      })
    })

    describe('when REMOVE_ATTACHMENT', () => {
      const action = {
        type: REMOVE_ATTACHMENT,
        payload: {
          position: 1,
          type: 'file'
        }
      }
      it('removes an attachment', () => {
        const state = {
          ...defaultState,
          image: ['a.png', 'b.png', 'c.png'],
          file: ['a.pdf', 'b.pdf', 'c.pdf']
        }
        const finalState = reducer(state, action)
        expect(finalState).toMatchSnapshot()
      })
    })

    describe('when SWITCH_ATTACHMENTS', () => {
      const action = {
        type: SWITCH_ATTACHMENTS,
        payload: {
          position1: 1,
          position2: 2,
          type: 'image'
        }
      }
      it('switches two attachments', () => {
        const state = {
          ...defaultState,
          image: ['a.png', 'b.png', 'c.png'],
          file: ['a.pdf', 'b.pdf', 'c.pdf']
        }
        const finalState = reducer(state, action)
        expect(finalState).toMatchSnapshot()
      })
    })
  })
})
