function setupUpload (shouldSucceed, callbackArgs) {
  jest.resetModules()

  jest.doMock('client/filepicker', () => {
    if (shouldSucceed) {
      return { pick: opts => opts.success(...callbackArgs) }
    } else {
      return { pick: opts => opts.failure(...callbackArgs) }
    }
  })

  const { upload } = require('./ChangeImageButton.store')
  return upload
}

const url = 'http://filepicker.io/hfwoe/eh98e'
const filename = 'foo.jpg'
const opts = { type: 'userAvatar', id: 3, attachmentType: 'image' }

it('returns an API action after filepicker succeeds', () => {
  const upload = setupUpload(true, [url, filename])
  const action = upload(opts)

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
  const upload = setupUpload(false, [new Error('nope')])
  return expect(upload(opts).payload).rejects.toEqual(new Error('nope'))
})
