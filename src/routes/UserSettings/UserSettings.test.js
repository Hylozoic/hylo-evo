import UserSettings from './UserSettings'
import { shallow } from 'enzyme'
import React from 'react'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: (domain) => {
    return {
      t: (str) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {})
      }
    }
  }
}))

describe('UserSettings', () => {
  it('renders correctly', () => {
    const currentUser = { id: 1, hasFeature: () => true, blockedUsers: { toRefArray: () => ['a user'] } }
    const memberships = [{ id: 2 }, { id: 3 }]
    const updateUserSettings = () => {}
    const leaveGroup = () => {}
    const loginWithService = () => {}
    const unlinkAccount = () => {}
    const setConfirm = () => {}
    const updateMembershipSettings = () => {}
    const fetchSavedSearches = () => {}
    const fetchPending = true

    const wrapper = shallow(<UserSettings
      currentUser={currentUser}
      memberships={memberships}
      updateUserSettings={updateUserSettings}
      leaveGroup={leaveGroup}
      loginWithService={loginWithService}
      unlinkAccount={unlinkAccount}
      setConfirm={setConfirm}
      fetchForCurrentUser={jest.fn()}
      updateMembershipSettings={updateMembershipSettings}
      fetchSavedSearches={fetchSavedSearches}
      fetchPending={fetchPending} />)
    expect(wrapper).toMatchSnapshot()
  })
})
