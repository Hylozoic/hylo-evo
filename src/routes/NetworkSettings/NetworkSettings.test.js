import NetworkSettings, { Moderators, Communities, Pagination } from './NetworkSettings'
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

describe('Moderators', () => {
  it('renders correctly', () => {
    const moderators = [{id: 2}, {id: 3}]

    const wrapper = shallow(<Moderators
      moderators={moderators}
      page={3}
      pageCount={5}
      setPage={() => {}} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('Communities', () => {
  it('renders correctly', () => {
    const communities = [{id: 2}, {id: 3}]

    const wrapper = shallow(<Communities
      communities={communities}
      page={3}
      pageCount={5}
      setPage={() => {}} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('Pagination', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Pagination
      page={3}
      pageCount={5}
      setPage={() => {}} />)
    expect(wrapper).toMatchSnapshot()
  })
})
