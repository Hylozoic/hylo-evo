import { mapStateToProps } from './ChangeImageButton.connector'
import { UPLOAD_IMAGE } from 'store/constants'

describe('mapStateToProps', () => {
  const props = {
    uploadSettings: {
      id: '123',
      subject: 'user-avatar'
    }
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
        [UPLOAD_IMAGE]: {
          id: '124',
          subject: 'user-avatar'
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
        [UPLOAD_IMAGE]: {
          id: '123',
          subject: 'user-avatar'
        }
      }
    }

    expect(mapStateToProps(state, props)).toEqual({
      loading: true
    })
  })
})
