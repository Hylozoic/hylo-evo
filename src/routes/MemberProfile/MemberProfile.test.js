import { shallow } from 'enzyme'
import React from 'react'
import denormalized from './MemberProfile.test.json'
import MemberProfile from './MemberProfile'
jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: (str) => str }
    return Component
  }
}))

describe('MemberProfile', () => {
  const defaultTestProps = {
    routeParams: { personId: '1' },
    person: denormalized.data.person,
    fetchPerson: jest.fn()
  }

  it('renders the same as the last snapshot', () => {
    const wrapper = shallow(<MemberProfile {...defaultTestProps} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('displays an error if one is present', () => {
    const props = {
      ...defaultTestProps,
      error: 'WOMBAT-TYPE INVALID'
    }
    const wrapper = shallow(<MemberProfile {...props} />)
    expect(wrapper.text().includes('Error')).toBe(true)
  })

  it('displays bio on the Overview tab', () => {
    const props = {
      ...defaultTestProps,
      currentTab: 'Overview',
      person: {
        ...defaultTestProps.person,
        bio: 'WOMBATS'
      }
    }
    const wrapper = shallow(<MemberProfile {...props} />)
    expect(wrapper.text().includes('WOMBATS')).toBe(true)
  })

  it('does not display bio on other tabs', () => {
    const props = {
      ...defaultTestProps,
      currentTab: 'Reactions',
      bio: 'WOMBATS',
      votes: []
    }
    const wrapper = shallow(<MemberProfile {...props} />)
    expect(wrapper.contains('WOMBATS')).toBe(false)
  })

  it('renders RecentActivity on Overview', () => {
    const props = {
      ...defaultTestProps,
      currentTab: 'Overview'
    }
    const wrapper = shallow(<MemberProfile {...props} />)
    expect(wrapper.text().includes('recent activity')).toBe(true)
  })

  it('renders MemberPosts on Posts', () => {
    const props = {
      ...defaultTestProps,
      currentTab: 'Posts'
    }
    const wrapper = shallow(<MemberProfile {...props} />)
    expect(wrapper.text().includes('{{name}}s posts')).toBe(true)
  })

  it('renders MemberComments on Comments', () => {
    const props = {
      ...defaultTestProps,
      currentTab: 'Comments'
    }
    const wrapper = shallow(<MemberProfile {...props} />)
    expect(wrapper.text().includes('{{name}}s comments')).toBe(true)
  })

  it('renders MemberVotes on reactions', () => {
    const props = {
      ...defaultTestProps,
      currentTab: 'Reactions'
    }
    const wrapper = shallow(<MemberProfile {...props} />)
    expect(wrapper.text().includes('{{name}}s reactions')).toBe(true)
  })
})
