import NetworkSettings, { PaginatedList, PaginationLinks } from './NetworkSettings'
import { shallow } from 'enzyme'
import React from 'react'

import FullPageModal from 'routes/FullPageModal'

describe('NetworkSettings', () => {
  let props

  beforeEach(() => {
    props = {
      addCommunityToNetwork: () => {},
      addNetworkModeratorRole: () => {},
      communities: [ { id: 4 }, { id: 5 } ],
      communitiesPage: 3,
      communitiesPageCount: 5,
      communitiesPending: true,
      fetchNetworkSettings: () => {},
      isAdmin: true,
      moderators: [ { id: 2 }, { id: 3 } ],
      moderatorsPage: 2,
      moderatorsPageCount: 7,
      moderatorsPending: false,
      network: { id: 1, slug: 'mycelium' },
      removeCommunityFromNetwork: () => {},
      removeNetworkModeratorRole: () => {},
      setCommunitiesPage: () => {},
      setConfirm: () => {},
      setModeratorsPage: () => {},
      updateNetworkSettings: () => {}
    }
  })

  it('matches the previous snapshot', () => {
    const wrapper = shallow(<NetworkSettings {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('prevents non-admin access (at least for now)', () => {
    props.isAdmin = false
    const wrapper = shallow(<NetworkSettings {...props} />)
    const actual = wrapper.find(FullPageModal).children()
    expect(actual.text()).toContain('must be an admin')
  })
})

describe('PaginatedList', () => {
  it('renders correctly', () => {
    const items = [{id: 2}, {id: 3}]

    const wrapper = shallow(<PaginatedList
      isAdmin
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
      isAdmin
      page={3}
      pageCount={5}
      setPage={() => {}} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders null with 1 page', () => {
    const wrapper = shallow(<PaginationLinks
      page={1}
      pageCount={1}
      setPage={() => {}} />)
    expect(wrapper.html()).toEqual(null)
  })
})
