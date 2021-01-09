import GroupSettings from './GroupSettings'
import { shallow } from 'enzyme'
import React from 'react'

it('renders correctly with no group', () => {
  const wrapper = shallow(<GroupSettings fetchGroupSettings={jest.fn()} />)
  expect(wrapper).toMatchSnapshot()
})

it('renders a redirect if you can not moderate', () => {
  const group = { id: 1, slug: 'foo', name: 'Foomunity' }
  const wrapper = shallow(<GroupSettings fetchGroupSettings={jest.fn()}
    group={group} />)
  expect(wrapper).toMatchSnapshot()
})

it('renders correctly with a group', () => {
  const group = { id: 1, slug: 'foo', name: 'Foomunity' }
  const wrapper = shallow(<GroupSettings fetchGroupSettings={jest.fn()} group={group} canModerate />)
  expect(wrapper).toMatchSnapshot()
})
