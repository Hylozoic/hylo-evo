import RelatedGroupstab, { Banner, SearchBar, GroupsList, GroupCard } from './RelatedGroupstab'
import { shallow } from 'enzyme'
import React from 'react'

describe('RelatedGroupstab', () => {
  it('renders correctly', () => {
    const network = { id: 78 }
    const groups = [
      { id: 9 }, { id: 8 }, { id: 7 }
    ]
    const wrapper = shallow(<RelatedGroupstab
      network={network}
      groups={groups}
      search='fo'
      sortBy='name'
      fetchNetwork={jest.fn()}
      setSearch={() => {}}
      setSort={() => {}}
      fetchMoreGroups={() => {}} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('Banner', () => {
  it('renders correctly', () => {
    const network = {
      id: 78,
      memberCount: 123
    }
    const wrapper = shallow(<Banner
      network={network}
      groupsTotal='12' />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('SearchBar', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<SearchBar
      sortBy='name'
      search='fo'
      setSearch={() => {}}
      setSort={() => {}} />)
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

describe('GroupsList', () => {
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
