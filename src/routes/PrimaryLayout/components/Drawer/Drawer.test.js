import React from 'react'
import { shallow } from 'enzyme'
import Drawer from './Drawer'

const communities = [
  {id: '1', slug: 'foo', name: 'Foomunity', avatarUrl: '/foo.png'},
  {id: '2', slug: 'bar', name: 'Barmunity', avatarUrl: '/bar.png'}
]

it('renders with a current community', () => {
  const wrapper = shallow(<Drawer currentCommunity={communities[0]}
    communities={communities} />)
  expect(wrapper).toMatchSnapshot()
})

it('renders without a current community', () => {
  const wrapper = shallow(<Drawer communities={communities} />)
  expect(wrapper).toMatchSnapshot()
})
