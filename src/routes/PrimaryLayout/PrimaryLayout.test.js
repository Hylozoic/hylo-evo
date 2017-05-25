import React from 'react'
import PrimaryLayout from './PrimaryLayout'
import { shallow } from 'enzyme'

it('shows nothing for a community route if the community is not loaded', () => {
  const wrapper = shallow(<PrimaryLayout isCommunityRoute />)
  expect(wrapper.name()).toEqual('Loading')
})

it('shows normal children for a community route if the community is loaded', () => {
  const wrapper = shallow(<PrimaryLayout
    isCommunityRoute
    location={{pathname: '/'}}
    community={{id: '1'}} />)
  expect(wrapper.name()).toEqual('div')
})
