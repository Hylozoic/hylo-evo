import UserSettings from './UserSettings'
import { shallow } from 'enzyme'
import React from 'react'

describe('UserSettings', () => {
  it('renders correctly', () => {
    const currentUser = { id: 1, hasFeature: () => true, blockedUsers: { toRefArray: () => ['a user'] } }
    const memberships = [{ id: 2 }, { id: 3 }]
    const updateUserSettings = () => {}
    const leaveCommunity = () => {}
    const loginWithService = () => {}
    const unlinkAccount = () => {}
    const setConfirm = () => {}
    const updateMembershipSettings = () => {}
    const fetchPending = true

    const wrapper = shallow(<UserSettings
      currentUser={currentUser}
      memberships={memberships}
      updateUserSettings={updateUserSettings}
      leaveCommunity={leaveCommunity}
      loginWithService={loginWithService}
      unlinkAccount={unlinkAccount}
      setConfirm={setConfirm}
      fetchForCurrentUser={jest.fn()}
      updateMembershipSettings={updateMembershipSettings}
      fetchPending={fetchPending} />)
    expect(wrapper).toMatchSnapshot()
  })
})
