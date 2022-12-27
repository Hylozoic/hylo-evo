import React from 'react'
import StreamBanner, { PostPrompt } from './StreamBanner'
import { MemoryRouter } from 'react-router-dom'
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
    routeParams={{ view: 'stream' }}
    isTesting
  />)
  expect(node).toMatchSnapshot()
})

it('renders for all groups', () => {
  const node = mount(<StreamBanner
    all
    routeParams={{ view: 'stream' }}
    currentUser={currentUser}
    currentUserHasMemberships
  />)
  expect(node).toMatchSnapshot()
})

it('matches the snapshot for an orphan user', () => {
  const node = mount(<StreamBanner
    all
    routeParams={{ view: 'stream' }}
    currentUser={currentUser}
    currentUserHasMemberships={false}
  />)
  expect(node).toMatchSnapshot()
})

describe('PostPrompt', () => {
  it('renders a post prompt', () => {
    const firstName = 'Arturo'
    const wrapper = mount(<MemoryRouter><PostPrompt firstName={firstName} type='project' /></MemoryRouter>)

    expect(wrapper).toMatchSnapshot()
  })
})
