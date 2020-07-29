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
          polymorphicId: 'post-new',
          attachmentType: 'image',
          attachments: [
            'foo.png',
            'bar.jog'
          ]
        }
      }
      const action2 = {
        type: SET_ATTACHMENTS,
        payload: {
          polymorphicId: 'post-new',
          attachmentType: 'file',
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
          polymorphicId: 'post-new',
          attachmentType: 'file',
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
          polymorphicId: 'post-new',
          attachmentType: 'file',
          position: 1
        }
      }
      it('removes an attachment', () => {
        const state = {
          ...defaultState,
          ['post-new']: {
            ['image']: [
              'a.png',
              'b.png',
              'c.png'  
            ],
            ['file']: [
              'a.pdf',
              'b.pdf',
              'c.pdf'  
            ]
          }
        }
        const finalState = reducer(state, action)
        expect(finalState).toMatchSnapshot()
      })
    })

    describe('when SWITCH_ATTACHMENTS', () => {
      const action = {
        type: SWITCH_ATTACHMENTS,
        payload: {
          polymorphicId: 'post-new',
          attachmentType: 'image',
          position1: 1,
          position2: 2,
        }
      }
      it('switches two attachments', () => {
        const state = {
          ...defaultState,
          ['post-new']: {
            ['image']: [
              'a.png',
              'b.png',
              'c.png'  
            ],
            ['file']: [
              'a.pdf',
              'b.pdf',
              'c.pdf'  
            ]
          }
        }
        const finalState = reducer(state, action)
        expect(finalState).toMatchSnapshot()
      })
    })
  })

  describe('upload', () => {
    const url = 'http://filepicker.io/hfwoe/eh98e'
    const filename = 'foo.jpg'
    const opts = { type: 'userAvatar', id: 3, attachmentType: 'image' }
    
    it('returns an API action after filepicker succeeds', () => {
      const uploadAttachment = setupUploadAttachment(true, [url, filename])
      const action = uploadAttachment(opts)
    
      expect(action).toEqual({
        type: 'UPLOAD_ATTACHMENT',
        payload: expect.any(Promise),
        meta: opts
      })
    
      return expect(action.payload).resolves.toEqual({
        api: {
          method: 'post',
          path: '/noo/upload',
          params: { url, id: 3, type: 'userAvatar', filename }
        }
      })
    })
    
    it('rejects when picker fails', () => {
      const uploadAttachment = setupUploadAttachment(false, [new Error('nope')])
      return expect(uploadAttachment(opts).payload).rejects.toEqual(new Error('nope'))
    })
  })
})

function setupUploadAttachment (shouldSucceed, callbackArgs) {
  jest.resetModules()

  jest.doMock('client/filepicker', () => {
    if (shouldSucceed) {
      return { uploadFile: opts => opts.success(...callbackArgs) }
    } else {
      return { uploadFile: opts => opts.failure(...callbackArgs) }
    }
  })

  const { uploadAttachment } = require('./AttachmentManager.store')
  return uploadAttachment
}
