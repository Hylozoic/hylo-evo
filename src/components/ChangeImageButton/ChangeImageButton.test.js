import { mapStateToProps } from './ChangeImageButton.connector'
import { UPLOAD_ATTACHMENT } from 'store/constants'

describe('mapStateToProps', () => {
  const props = {
    type: 'user-avatar',
    id: '123',
    attachmentType: 'image'
  }

  it('sets loading to false when not pending', () => {
    const state = {
      pending: {}
    }

    expect(mapStateToProps(state, props)).toEqual({
      loading: false
    })
  })

  it("sets loading to false when pending doesn't match settings", () => {
    const state = {
      pending: {
        [UPLOAD_ATTACHMENT]: {
          type: 'user-avatar',
          id: '124',
          fileType: 'image'
        }
      }
    }

    expect(mapStateToProps(state, props)).toEqual({
      loading: false
    })
  })

  it('sets loading to true when pending matches settings', () => {
    const state = {
      pending: {
        [UPLOAD_ATTACHMENT]: {
          type: 'user-avatar',
          id: '123',
          fileType: 'image'
        }
      }
    }

    expect(mapStateToProps(state, props)).toEqual({
      loading: true
    })
  })
})
