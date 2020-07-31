/* eslint-env jest */

describe('uploadAttachment', () => {
  const url = 'http://filepicker.io/hfwoe/eh98e'
  const filename = 'foo.jpg'
  const opts = { type: 'userAvatar', id: 3, attachmentType: 'image' }
  
  it('returns an API action after filepicker succeeds', () => {
    const uploadAttachment = setupUploadAttachment(true, { url, filename })
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
    const uploadAttachment = setupUploadAttachment(false, new Error('nope'))
    return expect(uploadAttachment(opts).payload).rejects.toEqual(new Error('nope'))
  })
})

function setupUploadAttachment (shouldSucceed, callbackArgs) {
  jest.resetModules()

  jest.doMock('client/filepicker', () => {
    if (shouldSucceed) {
      return { uploadFile: opts => opts.success(callbackArgs) }
    } else {
      return { uploadFile: opts => opts.failure(callbackArgs) }
    }
  })

  const uploadAttachment = require('./uploadAttachment')
  
  return uploadAttachment.default
}