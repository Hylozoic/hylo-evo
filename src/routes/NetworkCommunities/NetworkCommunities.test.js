import NetworkCommunities, { Banner, SearchBar, CommunityList, CommunityCard } from './NetworkCommunities'
import { shallow } from 'enzyme'
import React from 'react'

describe('NetworkCommunities', () => {
  it('renders correctly', () => {
    const network = {id: 78}
    const communities = [
      {id: 9}, {id: 8}, {id: 7}
    ]
    const wrapper = shallow(<NetworkCommunities
      network={network}
      communities={communities}
      search='fo'
      sortBy='name'
      setSearch={() => {}}
      setSort={() => {}}
      fetchMoreCommunities={() => {}} />)
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
      communitiesTotal='12' />)
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

describe('CommunityList', () => {
  it('renders correctly', () => {
    const communities = [
      {id: 9}, {id: 8}, {id: 7}
    ]
    const wrapper = shallow(<CommunityList
      communities={communities}
      fetchMoreCommunities={() => {}} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('CommunityList', () => {
  it('renders correctly', () => {
    const community = {
      name: 'Foom',
      avatarUrl: 'foom.png',
      numMembers: 77
    }
    const wrapper = shallow(<CommunityCard
      community={community} />)
    expect(wrapper).toMatchSnapshot()
  })
})
