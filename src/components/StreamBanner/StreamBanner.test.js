import React from 'react'
import StreamBanner from './StreamBanner'
import { mount } from 'enzyme'

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

const currentUser = {
  avatarUrl: 'me.png',
  firstName: () => 'Bob',
  memberships: {
    count: () => 18
  }
}

const group = {
  bannerUrl: 'banner.png',
  avatarUrl: 'avatar.png',
  name: 'Spacebase',
  location: 'space, duh'
}

it('renders with a group', () => {
  const node = mount(<StreamBanner
    group={group}
    isTesting
  />)
  expect(node).toMatchSnapshot()
})

it('renders for all groups', () => {
  const node = mount(<StreamBanner
    all
    currentUser={currentUser}
    currentUserHasMemberships
  />)
  expect(node).toMatchSnapshot()
})

it('matches the snapshot for an orphan user', () => {
  const node = mount(<StreamBanner
    all
    currentUser={currentUser}
    currentUserHasMemberships={false}
  />)
  expect(node).toMatchSnapshot()
})
