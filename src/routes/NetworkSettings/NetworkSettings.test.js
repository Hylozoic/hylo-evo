import NetworkSettings, { PaginatedList, PaginationLinks } from './NetworkSettings'
import { shallow } from 'enzyme'
import React from 'react'

describe('NetworkSettings', () => {
  it('renders correctly', () => {
    const network = {
      id: 1
    }
    const moderators = [{id: 2}, {id: 3}]
    const communities = [{id: 4}, {id: 5}]

    const wrapper = shallow(<NetworkSettings
      network={network}
      updateNetworkSettings={() => {}}
      moderators={moderators}
      communities={communities}
      setConfirm={() => {}}
      moderatorsPage={2}
      moderatorsPageCount={7}
      setModeratorsPage={() => {}}
      communitiesPage={3}
      communitiesPageCount={5}
      setCommunitiesPage={() => {}}
      communitiesPending />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('PaginatedList', () => {
  it('renders correctly', () => {
    const items = [{id: 2}, {id: 3}]

    const wrapper = shallow(<PaginatedList
      items={items}
      page={3}
      pageCount={5}
      setPage={() => {}}
      itemProps={{square: true, size: 40}} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('PaginationLinks', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<PaginationLinks
      page={3}
      pageCount={5}
      setPage={() => {}} />)
    expect(wrapper).toMatchSnapshot()
  })
})
