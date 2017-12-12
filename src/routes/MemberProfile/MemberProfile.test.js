import { shallow } from 'enzyme'
import React from 'react'

import MemberProfile, { SocialButtons, TabContentSwitcher } from './MemberProfile'
import denormalized from './MemberProfile.test.json'

describe('MemberProfile', () => {
  const { person } = denormalized.data

  it('renders the same as the last snapshot', () => {
    const match = { params: { id: '1' } }
    const wrapper = shallow(
      <MemberProfile match={match} person={person} fetchPerson={jest.fn()} ready />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('displays an error if one is present', () => {
    const props = {
      error: 'WOMBAT-TYPE INVALID',
      person
    }
    const wrapper = shallow(<MemberProfile {...props} />)
    expect(wrapper.contains(props.error)).toBe(true)
  })
})

describe('SocialButtons', () => {
  it('only renders buttons where there is a set value', () => {
    const wrapper = shallow(
      <SocialButtons facebookUrl='foo' twitterName={'bar'} />
    )
    expect(wrapper.find('Icon').length).toBe(2)
  })
})

describe('TabContentSwitcher', () => {
  it('displays bio on the Overview tab', () => {
    const wrapper = shallow(
      <TabContentSwitcher currentTab='Overview' bio='WOMBATS' />
    )
    expect(wrapper.contains('WOMBATS')).toBe(true)
  })

  it('does not display bio on other tabs', () => {
    const wrapper = shallow(
      <TabContentSwitcher currentTab='Upvotes' bio='WOMBATS' votes={[]} />
    )
    expect(wrapper.contains('WOMBATS')).toBe(false)
  })

  it('renders RecentActivity on Overview', () => {
    const wrapper = shallow(
      <TabContentSwitcher currentTab='Overview' />
    )
    expect(wrapper.text().includes('RecentActivity')).toBe(true)
  })

  it('renders MemberPosts on Posts', () => {
    const wrapper = shallow(
      <TabContentSwitcher currentTab='Posts' />
    )
    expect(wrapper.text().includes('MemberPosts')).toBe(true)
  })

  it('renders MemberComments on Comments', () => {
    const wrapper = shallow(
      <TabContentSwitcher currentTab='Comments' />
    )
    expect(wrapper.text().includes('MemberComments')).toBe(true)
  })

  it('renders MemberVotes on Upvotes', () => {
    const wrapper = shallow(
      <TabContentSwitcher currentTab='Upvotes' />
    )
    expect(wrapper.text().includes('MemberVotes')).toBe(true)
  })
})
