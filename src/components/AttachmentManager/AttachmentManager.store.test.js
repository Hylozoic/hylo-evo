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
          attachmentKey: 'post-new',
          attachments: [
            { url: 'foo.pdf', attachementType: 'file' },
            { url: 'bar.xls', attachementType: 'file' },
            { url: 'foo.png', attachementType: 'image' },
            { url: 'bar.jpg', attachementType: 'file' }
          ]
        }
      }
      it('sets attachments', () => {
        let finalState = reducer(defaultState, action)
        expect(finalState).toMatchSnapshot()
      })
    })

    describe('when ADD_ATTACHMENT', () => {
      const action = {
        type: ADD_ATTACHMENT,
        payload: {
          attachmentKey: 'post-new',
          attachment: { url: 'bar.pdf', attachmentType: 'file' }
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
          attachmentKey: 'post-new',
          attachment: { url: 'b.pdf', attachmentType: 'file' }
        }
      }
      it('removes an attachment', () => {
        const state = {
          ...defaultState,
          ['post-new']: [
            { url: 'a.pdf', attachmentType: 'file' },
            { url: 'b.pdf', attachmentType: 'file' },
            { url: 'c.pdf', attachmentType: 'file' },
            { url: 'a.png', attachmentType: 'image' },
            { url: 'b.png', attachmentType: 'image' },
            { url: 'c.png', attachmentType: 'image' }
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
          attachmentKey: 'post-new',
          attachmentType: 'image',
          position1: 1,
          position2: 2,
        }
      }
      it('switches two attachments', () => {
        const state = {
          ...defaultState,
          ['post-new']: [
            { url: 'a.pdf', attachmentType: 'file' },
            { url: 'b.pdf', attachmentType: 'file' },
            { url: 'c.pdf', attachmentType: 'file' },
            { url: 'a.png', attachmentType: 'image' },
            { url: 'b.png', attachmentType: 'image' },
            { url: 'c.png', attachmentType: 'image' }
          ]
        }
        const finalState = reducer(state, action)
        expect(finalState).toMatchSnapshot()
      })
    })
  })
})
