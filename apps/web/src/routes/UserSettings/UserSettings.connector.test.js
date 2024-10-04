import orm from 'store/models'
import { mapStateToProps, mergeProps } from './UserSettings.connector'

describe('mapStateToProps', () => {
  it('returns the right keys', () => {
    const session = orm.session(orm.getEmptyState())
    const state = {
      orm: session.state,
      FullPageModal: {},
      pending: {},
      SavedSearches: {
        searches: []
      }
    }
    const props = {
      location: {
        search: ''
      }
    }
    expect(mapStateToProps(state, props)).toMatchSnapshot()
  })
})

describe('mergeProps', () => {
  it("setConfirm only fires if it's a change", () => {
    const setConfirmBeforeClose = jest.fn()

    const dispatchProps = {
      setConfirmBeforeClose
    }

    var { setConfirm } = mergeProps({ confirm: false }, dispatchProps, {})

    setConfirm(false)
    expect(setConfirmBeforeClose).not.toHaveBeenCalled()
    setConfirm('message')
    expect(setConfirmBeforeClose).toHaveBeenCalledWith('message')

    setConfirmBeforeClose.mockClear()
    setConfirm = mergeProps({ confirm: 'message' }, dispatchProps, {}).setConfirm

    setConfirm('message')
    expect(setConfirmBeforeClose).not.toHaveBeenCalled()
    setConfirm(false)
    expect(setConfirmBeforeClose).toHaveBeenCalledWith(false)
  })
})
