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
          attachmentKey: 'post-new-image',
          attachments: [
            'foo.png',
            'bar.jog'
          ]
        }
      }
      const action2 = {
        type: SET_ATTACHMENTS,
        payload: {
          attachmentKey: 'post-new-file',
          attachments: [
            'foo.pdf',
            'bar.xls'
          ]
        }
      }
      it('sets attachments', () => {
        let finalState = reducer(reducer(defaultState, action), action2)
        expect(finalState).toMatchSnapshot()
      })
    })

    describe('when ADD_ATTACHMENT', () => {
      const action = {
        type: ADD_ATTACHMENT,
        payload: {
          attachmentKey: 'post-new-file',
          url: 'bar.pdf',
          position: 0
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
          attachmentKey: 'post-new-file',
          position: 1
        }
      }
      it('removes an attachment', () => {
        const state = {
          ...defaultState,
          ['post-new-file']: [
            'a.pdf',
            'b.pdf',
            'c.pdf'  
          ],
          ['post-new-image']: [
            'a.png',
            'b.png',
            'c.png'  
          ]
        }
        const finalState = reducer(state, action)
        expect(finalState).toMatchSnapshot()
      })
    })

    describe('when SWITCH_ATTACHMENTS', () => {
      const action = {
        type: SWITCH_ATTACHMENTS,
        payload: {
          attachmentKey: 'post-new-image',
          position1: 1,
          position2: 2,
        }
      }
      it('switches two attachments', () => {
        const state = {
          ...defaultState,
          ['post-new-file']: [
            'a.pdf',
            'b.pdf',
            'c.pdf'  
          ],
          ['post-new-image']: [
            'a.png',
            'b.png',
            'c.png'  
          ]
        }
        const finalState = reducer(state, action)
        expect(finalState).toMatchSnapshot()
      })
    })
  })
})
