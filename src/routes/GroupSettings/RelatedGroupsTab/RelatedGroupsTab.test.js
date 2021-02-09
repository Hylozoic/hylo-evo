import RelatedGroupsTab, { Banner, SearchBar, GroupsList, GroupCard } from './RelatedGroupsTab'
import { shallow } from 'enzyme'
import React from 'react'

describe('RelatedGroupstab', () => {
  it('renders correctly', () => {
    const parentGroups = [
      { id: 9 }, { id: 8 }, { id: 7 }
    ]
    const childGroups = [
      { id: 6 }, { id: 5 }, { id: 4 }
    ]
    const wrapper = shallow(<RelatedGroupsTab
      parentGroups={parentGroups}
      childGroups={childGroups} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('GroupsList', () => {
  it('renders correctly', () => {
    const groups = [
      { id: 9 }, { id: 8 }, { id: 7 }
    ]
    const wrapper = shallow(<GroupsList
      groups={groups}
      fetchMoreGroups={() => {}} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('GroupsCard', () => {
  it('renders correctly', () => {
    const group = {
      name: 'Foom',
      avatarUrl: 'foom.png',
      numMembers: 77
    }
    const wrapper = shallow(<GroupCard
      group={group} />)
    expect(wrapper).toMatchSnapshot()
  })
})
